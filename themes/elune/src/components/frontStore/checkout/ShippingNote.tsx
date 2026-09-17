import { useCartState } from '@components/frontStore/cart/CartContext.js';
import {
  useCheckout,
  useCheckoutDispatch
} from '@components/frontStore/checkout/CheckoutContext.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { NotebookPen } from 'lucide-react';
import React from 'react';
import './checkout.scss';

// The order note IS the TXID carrier: the string pasted here reaches
// `cart.shipping_note` and is carried onto the order, where the owner checks it
// on-chain by hand before dispatch. That contract is untouched — this file
// changes presentation only.
export function ShippingNote() {
  const { checkoutData } = useCheckout();
  const { updateCheckoutData } = useCheckoutDispatch();
  const { data: cart } = useCartState();
  const note = checkoutData.note ?? cart?.shippingNote ?? '';
  // The checkout page renders this panel twice (form flow and summary rail), so
  // the field's id is generated rather than spelled out.
  const fieldId = React.useId();

  return (
    <div className="checkout-txid">
      <label className="checkout-txid__title" htmlFor={fieldId}>
        <NotebookPen className="checkout-txid__icon" aria-hidden="true" />
        <span>{_('Transaction ID (TXID)')}</span>
      </label>
      <textarea
        id={fieldId}
        className="checkout-txid__field"
        value={note}
        onChange={(e) => updateCheckoutData({ note: e.target.value })}
        placeholder={_('Paste your BTC / USDT / ETH transaction ID (hash)')}
        rows={3}
      />
    </div>
  );
}
