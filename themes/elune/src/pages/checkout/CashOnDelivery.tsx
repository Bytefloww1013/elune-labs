import { Button } from '@components/common/ui/Button.js';
import { toast } from '@components/common/ui/Sonner.js';
import { useCartState } from '@components/frontStore/cart/CartContext.js';
import {
  useCheckout,
  useCheckoutDispatch
} from '@components/frontStore/checkout/CheckoutContext.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { Copy } from 'lucide-react';
import React, { useEffect } from 'react';

// Clipboard copy with user feedback. The storefront is served over plain http
// on a LAN/tailnet address, where `navigator.clipboard` does not exist, so the
// textarea + execCommand path is the real one for most visitors.
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
      document.execCommand('copy');
      document.body.removeChild(scratch);
    }
    toast.success(_('Address copied to clipboard'));
  } catch {
    toast.error(_('Could not copy the address. Select it manually.'));
  }
}

interface CashOnDeliveryMethodProps {
  setting: {
    codDisplayName: string;
    cryptoWalletBtc: string;
    cryptoWalletUsdt: string;
    cryptoWalletEth: string;
    cryptoWalletInstructions: string;
  };
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
      formRenderer: () => {
        const { data: cart } = useCartState();
        const wallets: Array<{ label: string; address?: string }> = [
          {
            label: _('BTC — Bitcoin (native SegWit)'),
            address: setting.cryptoWalletBtc
          },
          {
            label: _('USDT — TRON (TRC-20)'),
            address: setting.cryptoWalletUsdt
          },
          {
            label: _('ETH — Ethereum (ERC-20)'),
            address: setting.cryptoWalletEth
          }
        ];
        return (
          <div className="w-full space-y-4 py-3 text-left">
            <div className="rounded-md border border-border bg-card p-4">
              <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                <span className="text-muted-foreground">{_('Order total')}</span>
                <span className="text-lg font-semibold text-foreground">
                  {cart?.grandTotal?.text}
                </span>
              </div>
              <dl className="mt-4 space-y-4">
                {wallets.map((wallet) => {
                  const address = wallet.address;
                  return address ? (
                    <div key={wallet.label}>
                      <dt className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-foreground">
                          {wallet.label}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => copyAddress(address)}
                          aria-label={_('Copy ${label} address', {
                            label: wallet.label
                          })}
                        >
                          <Copy className="size-4" />
                          {_('Copy')}
                        </Button>
                      </dt>
                      <dd className="mt-1 font-mono text-sm text-foreground break-all">
                        {address}
                      </dd>
                    </div>
                  ) : null;
                })}
              </dl>
            </div>
            {setting.cryptoWalletInstructions && (
              <p className="text-sm text-muted-foreground">
                {setting.cryptoWalletInstructions}
              </p>
            )}
          </div>
        );
      },
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
