# Architecture: Elune Labs storefront

Pinned runtime: image `evershop/evershop:2.2.1` and `postgres:16`, one Compose project. The repo adds a theme, two extensions, a catalog seeder, and a checkout smoke. Commerce, order creation, and the COD capture route stay in the image.

## Runtime

```
docker compose
  app          evershop/evershop:2.2.1
               NODE_ENV=production, listens on 3000
               healthcheck wget http://127.0.0.1:3000/
               published as ${BIND_HOST:-127.0.0.1}:${PORT:-3000}:3000
               EVERSHOP_HOME_URL=${HOME_URL:-http://localhost:${PORT:-3000}}
               binds:
                 ./themes      -> /app/themes       (rw)
                 ./extensions  -> /app/extensions   (rw)
                 ./scripts     -> /app/scripts      (ro)
                 ./config      -> /app/config       (ro)
               named volumes:
                 media-data       /app/media
                 public-data      /app/public
                 evershop-build   /app/.evershop
                 log-data         /app/.log
  database     postgres:16
               no host ports
               volume postgres-data
               healthcheck pg_isready
  app depends_on database, condition service_healthy
```

`config/default.json` selects theme `elune` and enables both extensions. The host `package.json` name is `evershop-docker`; its `workspaces` entry is `themes/*` only. That file is not mounted into the container. The image's own `/app/package.json` is what `npm run build` and `npm run user:create` execute.

Named volumes are required for `/app/media`, `/app/public`, `/app/.evershop`, and `/app/.log`. Replacing those paths with empty host directories drops the image's copy-up contents.

*Source: [`docker-compose.yml`](docker-compose.yml), [`config/default.json`](config/default.json), [`package.json`](package.json)*

## Subsystems

### Deployment

Single Compose file. Postgres is reachable only on the Compose network. The storefront is on loopback unless `BIND_HOST` is changed. Operational steps, backup, and the image upgrade note are in [docs/design/8-1-deployment-grok-unapproved.md](docs/design/8-1-deployment-grok-unapproved.md).

*Source: [`docker-compose.yml`](docker-compose.yml)*

### Storefront theme

`themes/elune` is the active theme. Tokens live in `src/pages/all/shadcn.css` (`:root`) and are mapped for Tailwind v4 in `src/pages/all/tailwind.css`. Global type, selection, caret, and scrollbars are in `src/pages/all/global.scss`. Header, footer, and the age gate are in `src/pages/all/chrome.scss`.

The visual system in the source tree is the light Lunar Plates palette: `--snow` canvas, `--night` ink, one `--beam` accent, and five category hues `--accent-glps`, `--accent-bioregulators`, `--accent-recovery`, `--accent-gh-releasing`, `--accent-other`. Fonts are self-hosted Manrope and JetBrains Mono under `themes/elune/public/assets/fonts/`.

Theme components are EverShop area overrides. Routes the theme cannot register are provided by `elune-catalog`.

| Surface | Implementation |
|---|---|
| Every storefront page | `Announce` (`headerTop`), `Wordmark` (`headerMiddleLeft`), `Nav` (`headerMiddleCenter`), `MiniCartIcon` (`headerMiddleRight`), `FooterNav`, `RuoFooter` (`footerBottom`), `AgeGate` (`body`) |
| Suppressed core header widgets | `Logo`, `SearchBox`, and `CustomerIcon` render `null` so the demo mark, search field, and account icon do not occupy the header. Account routes and `/search` remain core routes. |
| `/` | `pages/homepage/Elune.tsx` in area `content` |
| `/all` | Extension route plus `pages/allProducts/AllProducts.tsx`. Alphabetical by name. |
| `/new-releases` | Extension route plus `pages/newReleases/NewReleases.tsx`. Newest 6 by descending `productId`. |
| Category pages | Core category route. `CatalogueHeading` inserts a visually hidden `h2`. Product grid is `CategoryProducts`. |
| Product page | `ProductDescription`, `ProductSpecs`, `RuoNotice` |
| Checkout | `CashOnDelivery` registers payment method `cod`. `ShippingNote` is the TXID field. |
| Checkout success | `ConfirmationStatus` and `CustomerInfo` in `checkoutSuccessPageLeft` |

`system.theme` is committed, so the active theme does not depend on `evershop theme:active`.

The design rules those components follow are in [DESIGN-grok-unapproved.md](DESIGN-grok-unapproved.md). Compliance copy and the payment panel are in [docs/design/8-2-ui-compliance-payment-grok-unapproved.md](docs/design/8-2-ui-compliance-payment-grok-unapproved.md).

*Source: [`themes/elune/src/pages/all/shadcn.css`](themes/elune/src/pages/all/shadcn.css), [`config/default.json`](config/default.json)*

### Catalog extension

`extensions/elune-catalog` registers two front-store routes and sets `pageInfo.title` / `description` by merging the GraphQL context key `pageInfo`:

| Method | Path | Theme body |
|---|---|---|
| `GET` | `/all` | `themes/elune/src/pages/allProducts/AllProducts.tsx` |
| `GET` | `/new-releases` | `themes/elune/src/pages/newReleases/NewReleases.tsx` |

Production mode loads `extensions/elune-catalog/dist`.

*Source: [`extensions/elune-catalog/src/pages/frontStore/allProducts/route.json`](extensions/elune-catalog/src/pages/frontStore/allProducts/route.json), [`extensions/elune-catalog/src/pages/frontStore/newReleases/route.json`](extensions/elune-catalog/src/pages/frontStore/newReleases/route.json)*

### Payments

Wallet addresses are rows in EverShop's `setting` table, not files. `elune-payments` extends GraphQL type `Setting` with `cryptoWalletBtc`, `cryptoWalletUsdt`, `cryptoWalletEth`, and `cryptoWalletInstructions`. Resolvers return an address only when `isBitcoinAddress` or `isErc20Address` accepts it. The admin card at area `paymentSetting` validates with the same functions.

The theme does not change order creation. `CashOnDelivery.tsx` calls `registerPaymentComponent('cod', …)` and `checkout()`. The TXID is the stock shipping note (`checkoutData.note` → cart shipping note → `order.shipping_note`). Capture remains `POST /api/cod/captures` with `{ "order_id" }`, a private route in the 2.2.1 image. A successful capture moves `paymentStatus.code` to `paid`. A second capture of the same order returns HTTP 400.

USDT is ERC-20. A TRON address fails the ERC-20 predicate and the rail renders unconfigured.

*Source: [`extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.graphql`](extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.graphql), [`themes/elune/src/pages/checkout/CashOnDelivery.tsx`](themes/elune/src/pages/checkout/CashOnDelivery.tsx), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs)*

### Catalog data path

`scripts/catalog-data.json` is the commerce source: 5 categories, 14 products, prices 29.99–79.99, quantity 100. Three families (`bpc-157`, `tb-500`, `cjc-1295-no-dac`) carry `family` and `size` and are grouped into a native Size variant group. Each child stays its own SKU, price, and stock. Unpaired SKUs are not grouped.

Analytical fields are not in the JSON file. They live in `themes/elune/src/data/productSpecs.ts`, keyed by SKU. Narrative copy lives in `themes/elune/src/data/productLiterature.ts`.

The seeder authenticates with `POST /api/user/tokens`, writes through the REST API, and reads the catalog with `pg` (`DB_*`) because this image's product and category GraphQL filters do not honor `sku` / `url_key` and the product connection is capped at 20 rows. CMS pages are created once and then left alone.

Detail is in [docs/design/8-3-catalog-orders-grok-unapproved.md](docs/design/8-3-catalog-orders-grok-unapproved.md).

*Source: [`scripts/catalog-data.json`](scripts/catalog-data.json), [`scripts/seed-catalog.mjs`](scripts/seed-catalog.mjs), [`themes/elune/src/data/productSpecs.ts`](themes/elune/src/data/productSpecs.ts)*

## Invariants in this tree

- Fulfillment after payment is an operational rule. The smoke expects `payment_status` `pending` at checkout and `paid` only after `POST /api/cod/captures`. The theme has no client path that marks an order paid.
- Age gate reads and writes `elune_age_ok` in the browser. It returns immediately when `pathname` starts with `/admin`. Theme components are not mounted on admin or API routes.
- The fixed sentence `For research use only. Not for human consumption.` is rendered by `Announce`, `RuoFooter`, and `RuoNotice`.
- Seed identity is SKU and category `url_key`. Re-runs patch declared products, restore retired categories, and retire rows the file no longer declares. They do not delete rows.
- Wallet GraphQL fields are null unless the stored value matches that rail. Instructions fall back to a built-in sentence only when the setting row is absent.
- `checkout.showShippingNote` is `true` in `config/default.json`. The confirmation panel hides the TXID row when that flag is false.

*Source: [`themes/elune/src/pages/all/AgeGate.tsx`](themes/elune/src/pages/all/AgeGate.tsx), [`themes/elune/src/pages/all/Announce.tsx`](themes/elune/src/pages/all/Announce.tsx), [`themes/elune/src/pages/checkoutSuccess/ConfirmationStatus.tsx`](themes/elune/src/pages/checkoutSuccess/ConfirmationStatus.tsx), [`config/default.json`](config/default.json)*

## Process boundaries

| Concern | Where it lives |
|---|---|
| Schema, carts, orders, COD capture, admin shell | `evershop/evershop:2.2.1` image |
| Theme presentation and spec/literature records | `themes/elune` |
| Wallet shape checks and Setting fields | `extensions/elune-payments` |
| `/all` and `/new-releases` route registration | `extensions/elune-catalog` |
| Category, product, variant, CMS, store-name bootstrap | `scripts/seed-catalog.mjs` |
| Guest checkout regression | `scripts/smoke-checkout.mjs` |
| Address-shape unit tests | `extensions/elune-payments/tests/walletAddress.test.mjs` (`node --test tests/`) |

`scripts/cut-dag.sh` writes beads issues whose descriptions still mention a three-category catalog and a host-port mapping of `${PORT}:${PORT}`. The Compose file and `catalog-data.json` supersede those descriptions.

*Source: [`extensions/elune-payments/package.json`](extensions/elune-payments/package.json), [`scripts/cut-dag.sh`](scripts/cut-dag.sh)*
