import { Button } from '@components/common/ui/Button.js';
import { toast } from '@components/common/ui/Sonner.js';
import {
  useCheckout,
  useCheckoutDispatch
} from '@components/frontStore/checkout/CheckoutContext.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React, { useEffect } from 'react';

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
      formRenderer: () => (
        <div className="flex justify-center text-muted-foreground">
          <div className="w-2/3 py-3">
            <p className="mb-4">{setting.cryptoWalletInstructions}</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>BTC — Bitcoin (native SegWit):</span>
                <span className="font-mono">{setting.cryptoWalletBtc}</span>
              </div>
              <div className="flex justify-between">
                <span>USDT — TRON (TRC-20):</span>
                <span className="font-mono">{setting.cryptoWalletUsdt}</span>
              </div>
              <div className="flex justify-between">
                <span>ETH — Ethereum (ERC-20):</span>
                <span className="font-mono">{setting.cryptoWalletEth}</span>
              </div>
            </div>
          </div>
        </div>
      ),
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
