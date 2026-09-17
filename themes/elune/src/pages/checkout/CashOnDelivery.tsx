import { Button } from '@components/common/ui/Button.js';
import { toast } from '@components/common/ui/Sonner.js';
import { useCartState } from '@components/frontStore/cart/CartContext.js';
import {
  useCheckout,
  useCheckoutDispatch
} from '@components/frontStore/checkout/CheckoutContext.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { Copy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import '../../components/frontStore/checkout/checkout.scss';

// Clipboard copy with user feedback. The storefront is served over plain http on
// a LAN/tailnet address, where `navigator.clipboard` does not exist, so the
// textarea + execCommand path is the real one for most visitors. It reports
// whether a copy actually happened: a payment address the buyer believes they
// copied but did not is worse than one they retype, so a failure says so in
// plain text under the row as well as in the toast.
async function copyAddress(address: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(address);
    } else {
      const scratch = document.createElement('textarea');
      scratch.value = address;
      scratch.setAttribute('readonly', '');
      scratch.style.position = 'fixed';
      scratch.style.opacity = '0';
      document.body.appendChild(scratch);
      scratch.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(scratch);
      if (!copied) {
        throw new Error('execCommand("copy") reported failure');
      }
    }
    toast.success(_('Address copied to clipboard'));
    return true;
  } catch {
    toast.error(_('Could not copy the address. Select it manually.'));
    return false;
  }
}

interface CashOnDeliverySetting {
  codDisplayName: string;
  cryptoWalletBtc: string | null;
  cryptoWalletUsdt: string | null;
  cryptoWalletEth: string | null;
  cryptoWalletInstructions: string | null;
}

// The payment step's body. Every address arrives already checked against its own
// rail's shape by the elune-payments resolver, so a rail whose stored value is
// missing, is one of the seeded placeholders (`TPLACEHOLDER_REPLACE_ME`,
// `0xPLACEHOLDER_REPLACE_ME`, `bc1qPLACEHOLDER_REPLACE_ME`) or belongs to another
// network (a TRON USDT address) is null here: that row says it is not configured
// and offers nothing to copy, rather than presenting a destination nobody can be
// paid at.
function WalletRails({ setting }: { setting: CashOnDeliverySetting }) {
  const { data: cart } = useCartState();
  const [failedRail, setFailedRail] = useState<string | null>(null);
  const rails = [
    {
      id: 'btc',
      label: _('BTC — Bitcoin (native SegWit)'),
      address: setting.cryptoWalletBtc
    },
    {
      id: 'usdt',
      label: _('USDT — Ethereum (ERC-20)'),
      address: setting.cryptoWalletUsdt
    },
    {
      id: 'eth',
      label: _('ETH — Ethereum (ERC-20)'),
      address: setting.cryptoWalletEth
    }
  ];

  return (
    <div className="checkout-wallets">
      <div className="checkout-wallets__total">
        <span className="checkout-wallets__total-label">{_('Order total')}</span>
        <span className="mono checkout-wallets__total-value">
          {cart?.grandTotal?.text}
        </span>
      </div>
      <dl className="checkout-wallets__list">
        {rails.map(({ id, label, address }) => (
          <div className="checkout-wallets__row" key={id}>
            <dt className="checkout-wallets__label">
              <span>{label}</span>
              {address && (
                <button
                  type="button"
                  className="checkout-wallets__copy"
                  aria-label={_('Copy ${label} address', { label })}
                  onClick={async () =>
                    setFailedRail((await copyAddress(address)) ? null : id)
                  }
                >
                  <Copy aria-hidden="true" />
                  {_('Copy')}
                </button>
              )}
            </dt>
            <dd className="checkout-wallets__value">
              {address ? (
                <span className="mono checkout-wallets__address">
                  {address}
                </span>
              ) : (
                <span className="checkout-wallets__unavailable">
                  {_('Not configured — contact us before sending.')}
                </span>
              )}
              {failedRail === id && (
                <p className="checkout-wallets__copy-error">
                  {_(
                    'Copy failed — select the address and copy it manually.'
                  )}
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {setting.cryptoWalletInstructions && (
        <p className="checkout-wallets__instructions">
          {setting.cryptoWalletInstructions}
        </p>
      )}
    </div>
  );
}

interface CashOnDeliveryMethodProps {
  setting: CashOnDeliverySetting;
}

export default function CashOnDeliveryMethod({
  setting
}: CashOnDeliveryMethodProps) {
  const { checkoutSuccessUrl, orderPlaced, orderId, checkoutData } =
    useCheckout();
  const { registerPaymentComponent } = useCheckoutDispatch();

  useEffect(() => {
    if (orderPlaced && checkoutData.paymentMethod === 'cod') {
      // Redirect to the checkout success page
      window.location.href = `${checkoutSuccessUrl}/${orderId}`;
    }
  }, [orderPlaced, checkoutSuccessUrl, orderId]);

  useEffect(() => {
    registerPaymentComponent('cod', {
      nameRenderer: () => (
        <div className="flex items-center justify-between w-full">
          <span>{setting.codDisplayName}</span>
        </div>
      ),
      formRenderer: () => <WalletRails setting={setting} />,
      checkoutButtonRenderer: () => {
        const { checkout } = useCheckoutDispatch();
        const { loadingStates, orderPlaced } = useCheckout();
        const handleClick = async (e: React.MouseEvent) => {
          e.preventDefault();
          try {
            await checkout();
          } catch (error) {
            toast.error(
              error.message || _('Failed to place order. Please try again.')
            );
          }
        };
        const isDisabled = loadingStates.placingOrder || orderPlaced;
        return (
          <Button
            variant={'default'}
            size={'xl'}
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            className="w-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-primary"
          >
            <span className="flex items-center justify-center space-x-2">
              {loadingStates.placingOrder ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{_('Placing Order...')}</span>
                </>
              ) : orderPlaced ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>{_('Order Placed')}</span>
                </>
              ) : (
                <>
                  <span>{_('Place Order')}</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </>
              )}
            </span>
          </Button>
        );
      }
    });
  }, [
    registerPaymentComponent,
    setting.codDisplayName,
    setting.cryptoWalletBtc,
    setting.cryptoWalletUsdt,
    setting.cryptoWalletEth,
    setting.cryptoWalletInstructions
  ]);
  return null;
}

export const layout = {
  areaId: 'checkoutFormAfter',
  sortOrder: 10
};

export const query = `
  query Query {
    setting {
      codDisplayName
      cryptoWalletBtc
      cryptoWalletUsdt
      cryptoWalletEth
      cryptoWalletInstructions
    }
  }
`;
