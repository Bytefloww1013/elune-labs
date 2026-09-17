import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
import '../../components/frontStore/checkout/checkout.scss';

interface ConfirmationStatusProps {
  order: {
    status: { name: string } | null;
    paymentStatus: { name: string } | null;
    shippingNote: string | null;
  };
  setting: {
    showShippingNote: boolean;
  };
}

/**
 * The confirmation's payment panel: the order's own state, the payment status
 * the order actually carries, and the TXID it was placed with.
 *
 * Core's checkoutSuccess page renders nothing for payment state — the component
 * that would (`pages/frontStore/checkoutSuccess/ShippingNote.js`) targets an area
 * id, `checkoutSuccessSummary`, that no page in 2.2.1 declares, so the note it
 * holds never reaches a visitor. This component lands in the real left area
 * instead, beside the core blocks, and reads the same contract they do
 * (`order(uuid: getContextValue('orderId'))`).
 *
 * Every value is the stored one: no status is asserted that the order does not
 * hold, no TXID is invented when the buyer left the field empty, and the panel
 * promises nothing about detection, crediting or timing — the manual flow means
 * the order keeps its status until the owner records the payment (DESIGN.md,
 * Payment presentation). The RUO line DESIGN.md lists for this surface is
 * already carried on every storefront page by RuoFooter, so it is not repeated
 * here.
 */
export default function ConfirmationStatus({
  order: { status, paymentStatus, shippingNote },
  setting: { showShippingNote }
}: ConfirmationStatusProps) {
  const txid = showShippingNote ? (shippingNote ?? '').trim() : '';

  return (
    <div className="checkout-confirmation">
      <h2 className="checkout-confirmation__title">{_('Payment')}</h2>
      <dl className="checkout-confirmation__list">
        {status?.name && (
          <div className="checkout-confirmation__row">
            <dt className="checkout-confirmation__label">
              {_('Order status')}
            </dt>
            <dd className="checkout-confirmation__value">{status.name}</dd>
          </div>
        )}
        {paymentStatus?.name && (
          <div className="checkout-confirmation__row">
            <dt className="checkout-confirmation__label">
              {_('Payment status')}
            </dt>
            <dd className="checkout-confirmation__value">
              {paymentStatus.name}
            </dd>
          </div>
        )}
        {showShippingNote && (
          <div className="checkout-confirmation__row">
            <dt className="checkout-confirmation__label">
              {_('Transaction ID (TXID)')}
            </dt>
            <dd className="checkout-confirmation__value">
              {txid ? (
                <span className="mono checkout-confirmation__txid">{txid}</span>
              ) : (
                <span className="checkout-confirmation__absent">
                  {_('Not provided with this order.')}
                </span>
              )}
            </dd>
          </div>
        )}
      </dl>
      <p className="checkout-confirmation__note">
        {_('We check the transfer by hand and record it against this order.')}
      </p>
    </div>
  );
}

export const layout = {
  areaId: 'checkoutSuccessPageLeft',
  sortOrder: 20
};

export const query = `
  query Query {
    order (uuid: getContextValue('orderId')) {
      status {
        name
      }
      paymentStatus {
        name
      }
      shippingNote
    }
    setting {
      showShippingNote
    }
  }
`;