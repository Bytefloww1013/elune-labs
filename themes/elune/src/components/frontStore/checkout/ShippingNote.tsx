import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import { Textarea } from '@components/common/ui/Textarea.js';
import { useCartState } from '@components/frontStore/cart/CartContext.js';
import {
  useCheckout,
  useCheckoutDispatch
} from '@components/frontStore/checkout/CheckoutContext.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { NotebookPen } from 'lucide-react';
import React from 'react';
export function ShippingNote() {
  const { checkoutData } = useCheckout();
  const { updateCheckoutData } = useCheckoutDispatch();
  const { data: cart } = useCartState();
  const note = checkoutData.note ?? cart?.shippingNote ?? '';
  return (
    <div className="checkout-shipping-note">
      <Card className="rounded-lg border border-border shadow-none ring-0">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <NotebookPen className="w-5 h-5" />
              <span>{_('Transaction ID (TXID)')}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={note}
            onChange={(e) => updateCheckoutData({ note: e.target.value })}
            placeholder={_('Paste your BTC / USDT / ETH transaction ID (hash)')}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
