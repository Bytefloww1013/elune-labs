# Elune Labs — Shared Implementation Context

## Worktree (ALL work happens here)
`/home/josh/dev/elune-labs/.treehouse/elune-labs-347ecc/1/elune-labs/`

All `docker compose` commands MUST run from this directory.
The running container binds to THIS worktree, not the repo root.
Running `docker compose up -d` from the repo root would destroy the container.

## bd store
Same `.beads` store across worktree and root. Use `bd` from the worktree dir.
Ticket IDs: `elune-labs-b04.9`, `elune-labs-b04.7`, `elune-labs-b04.12`.

## Host Gotchas (CRITICAL)
- **PORT 3010**: Stack runs on port 3010 (host :3000 = OpenChamber, untouched). Use `http://localhost:3010` in all curls.
- **NO HOST SUDO**: Container runs as root; host files in themes/ may be root-owned. Reclaim via `docker compose exec app chown -R $(id -u):$(id -g) /app/themes`. Never host sudo.
- **RESTART DENIED**: `docker compose restart app` fails. Workaround: `docker compose exec app kill -TERM 1; sleep 2; docker compose start app`. A failed restart leaves the container running.
- **config/default.json**: HOST-WRITABLE (josh-owned); MERGE keys, never overwrite. Current content:
  ```json
  {
    "system": {
      "theme": "elune"
    },
    "themeConfig": {
      "copyRight": "© 2026 Elune Labs. All rights reserved."
    }
  }
  ```
- **themes/elune/.swcrc**: exists (jsc.target es2022) — preserves `export const layout` in dist. Do NOT remove.
- **Build**: `docker compose exec app sh -lc "npm run build --workspace=themes/elune && npm run build"`. Both must be green.
- **Leave the stack UP** after all work.

## NODE_ENV
`evershop start` sets `NODE_ENV=production` via `initEnvStart.js` BEFORE the extension loader runs.
`isProductionMode()` returns true at runtime. Extensions need a `dist/` directory.

## Existing theme component pattern
Every master component: `export default function Foo() { ... }` + `export const layout = { areaId: '...', sortOrder: N }`.
Pattern source: `themes/elune/src/pages/all/AgeGate.tsx`, `Wordmark.tsx`.

## COD Setting extension pattern (reference for elune-payments)
GraphQL (`CODSetting.graphql`):
```graphql
extend type Setting {
  codPaymentStatus: Int
  codDisplayName: String
}
```
Resolvers (`CODSetting.resolvers.js`):
```js
export default {
  Setting: {
    codPaymentStatus: (setting) => {
      const v = setting.find((s) => s.name === 'codPaymentStatus');
      return v ? parseInt(v.value, 10) : 0;
    },
    codDisplayName: (setting) => {
      const v = setting.find((s) => s.name === 'codDisplayName');
      return v ? v.value : 'Cash On Delivery';
    }
  }
};
```
The `setting` arg is an array of `{ name, value }` objects from the DB setting table.

## Core ShippingNote.tsx (reference for TXID re-label)
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { Textarea } from '@components/common/ui/Textarea.js';
import { useCartState } from '@components/frontStore/cart/CartContext.js';
import { useCheckout, useCheckoutDispatch } from '@components/frontStore/checkout/CheckoutContext.js';
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
              <span>{_('Order Note')}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={note}
            onChange={(e) => updateCheckoutData({ note: e.target.value })}
            placeholder={_('Add a note to your order')}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

## Extension loader behavior
File: `@evershop/evershop/dist/bin/extension/index.js`
- Reads `getConfig('system.extensions', [])` from config
- Each entry: `{ name, resolve, enabled, priority? }`
- Production mode: checks `existsSync(resolve(extension.resolve, 'dist'))` — must exist
- Pushes `{ ...extension, path: resolve(ROOTPATH, extension.resolve, 'dist') }`
- Extensions are loaded alongside core modules in `startUp.js`

## Theme shadcn.css tokens (for category accents)
```css
--accent: oklch(0.78 0.09 305);           /* lavender fallback */
--accent-peptides: oklch(0.75 0.12 195);  /* teal */
--accent-sarms: oklch(0.75 0.14 40);      /* amber */
--accent-nootropics: oklch(0.75 0.12 130); /* green */
```

## Review handoff
After implementation: `scripts/review-submit.sh <ticket-id> --summary "<what changed + evidence>"`
Scripts are at: `/home/josh/.omp/agent/skills/beadfinder/scripts/`
