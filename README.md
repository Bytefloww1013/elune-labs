# Elune Labs

EverShop 2.2.1 storefront for research reference compounds in five categories (GLPs, Bioregulators, Recovery, GH Releasing, Other). The storefront theme is `themes/elune`. Payment is manual crypto on the built-in cash-on-delivery method. An age gate and a fixed research-use line ship in the theme.

Related drafts in this audit:

- [ARCHITECTURE-grok-unapproved.md](ARCHITECTURE-grok-unapproved.md)
- [IMPLEMENTATION-grok-unapproved.md](IMPLEMENTATION-grok-unapproved.md)
- [docs/design/8-1-deployment-grok-unapproved.md](docs/design/8-1-deployment-grok-unapproved.md)
- [docs/design/8-2-ui-compliance-payment-grok-unapproved.md](docs/design/8-2-ui-compliance-payment-grok-unapproved.md)
- [docs/design/8-3-catalog-orders-grok-unapproved.md](docs/design/8-3-catalog-orders-grok-unapproved.md)
- [DESIGN-grok-unapproved.md](DESIGN-grok-unapproved.md)

*Source: [`package.json`](package.json), [`config/default.json`](config/default.json)*

## Runbook

Prerequisites: Docker Engine with the Compose plugin. The committed defaults publish the storefront on `127.0.0.1:3000`. `PORT`, `BIND_HOST`, and `HOME_URL` in `.env` override that. The app process inside the container always listens on port 3000.

```bash
# 1. Clone
git clone <repo-url> elune-labs && cd elune-labs

# 2. Environment
cp .env.example .env
# Set DB_PASSWORD. Leave the other keys unless this host needs a different
# published port, bind address, or public base URL.
```

`.env.example` is the committed contract:

| Key | Default | Role |
|---|---|---|
| `PORT` | `3000` | Host port Docker publishes. Not the port inside the container. |
| `BIND_HOST` | `127.0.0.1` | Address Docker publishes on. Loopback keeps the port off other interfaces. |
| `HOME_URL` | `http://localhost:3000` | Public base URL passed to the app as `EVERSHOP_HOME_URL`. |
| `DB_HOST` | `database` | Overridden again in Compose to the service name `database`. |
| `DB_PORT` | `5432` | Postgres port on the Compose network. Not published to the host. |
| `DB_NAME` | `evershop` | Database name. |
| `DB_USER` | `evershop` | Database role. |
| `DB_PASSWORD` | `change-me-strong` | Required. Compose fails fast if it is unset: `${DB_PASSWORD:?set DB_PASSWORD in .env}`. |
| `DB_SSLMODE` | `disable` | Passed through `env_file`. |

A Postgres data volume keeps the password it was initialized with. If `DB_PASSWORD` later changes, either remove the `postgres-data` volume or change the role password inside the running database.

```bash
# 3. Bring up. --wait blocks until both healthchecks pass.
docker compose up -d --wait

# 4. Create the admin user.
#    evershop user:create in image 2.2.1 accepts any password of length >= 8.
docker compose exec app npm run user:create -- \
  --email "admin@elunelabs.example" \
  --password "ChangeMe123" \
  --name "Admin"

# 5. Verify. Use the host PORT from .env, which defaults to 3000.
PORT="$(sed -n 's/^PORT=//p' .env)"; PORT="${PORT:-3000}"
curl -sf  -o /dev/null -w 'storefront %{http_code}\n' "http://127.0.0.1:$PORT/"
curl -sL -o /dev/null -w 'admin %{http_code}\n' "http://127.0.0.1:$PORT/admin"
# Unauthenticated /admin redirects to /admin/login. -L follows that to the login page.
```

`npm run seed` in the root `package.json` is EverShop's own demo seeder (`evershop seed`). It is not the peptide catalog. Catalog bootstrap is [Seed the catalog](#seed-the-catalog).

*Source: [`.env.example`](.env.example), [`docker-compose.yml`](docker-compose.yml), [`package.json`](package.json). Password length check: `evershop/evershop:2.2.1` `dist/bin/user/create.js` (`isValidPassword` requires `password.length >= 8`).*

## Remote access

Compose publishes `${BIND_HOST:-127.0.0.1}:${PORT:-3000}:3000`. The container port on the right is fixed at 3000, and the app healthcheck calls `http://127.0.0.1:3000/`. With the default bind address, the port is reachable on the host loopback only. A tailnet client reaches it through Tailscale Serve, which terminates TLS and forwards to that loopback port:

```bash
PORT="$(sed -n 's/^PORT=//p' .env)"; PORT="${PORT:-3000}"
tailscale serve --bg "http://127.0.0.1:${PORT}"
tailscale serve status
```

Set `BIND_HOST=0.0.0.0` only when the port should be published on every interface. That path is outside the loopback-plus-Serve layout in `docker-compose.yml`.

### Base URL (`HOME_URL`)

EverShop writes an absolute base URL into links, form actions, and email. Compose passes:

```yaml
EVERSHOP_HOME_URL: "${HOME_URL:-http://localhost:${PORT:-3000}}"
```

The value is read when the app container is created. After editing `HOME_URL`, recreate the app:

```bash
# .env
HOME_URL=https://<node-name>.<tailnet>.ts.net

docker compose up -d app
```

Check that the HTML base URL matches the origin the browser uses. `scripts/smoke-checkout.mjs` performs the same check against `EVERSHOP_STOREFRONT_URL`, then `HOME_URL`, then the API base URL.

```bash
PORT="$(sed -n 's/^PORT=//p' .env)"; PORT="${PORT:-3000}"
curl -sf -o /dev/null -w 'local %{http_code}\n' "http://127.0.0.1:$PORT/"
```

*Source: [`docker-compose.yml`](docker-compose.yml), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs)*

## Payment settings

Admin page: **Settings → Payment** at `/admin/setting/payments`. The `elune-payments` card is `Crypto Wallet Settings`, with BTC, USDT — Ethereum (ERC-20), ETH, and instructions. Saving writes the `setting` table through the admin settings form. The next checkout load reads the new values. No theme rebuild and no app restart.

The same keys can be written with an admin session:

```bash
PORT="$(sed -n 's/^PORT=//p' .env)"; PORT="${PORT:-3000}"

curl -s -c /tmp/cookies.txt "http://127.0.0.1:$PORT/admin/user/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elunelabs.example","password":"ChangeMe123"}'

curl -s -b /tmp/cookies.txt "http://127.0.0.1:$PORT/api/settings" \
  -H "Content-Type: application/json" \
  -d '{"crypto_wallet_btc":"bc1q...","crypto_wallet_usdt":"0x...","crypto_wallet_eth":"0x...","crypto_wallet_instructions":"Send the order total, then paste your TXID."}'
```

`POST /admin/user/login` requires `email` and `password`. `POST /api/settings` is a private route.

Read the rails back through GraphQL:

```bash
curl -s "http://127.0.0.1:$PORT/api/graphql" -H "Content-Type: application/json" \
  -d '{"query":"{ setting { codDisplayName cryptoWalletBtc cryptoWalletUsdt cryptoWalletEth cryptoWalletInstructions } }"}'
```

Each rail resolves to the stored string only when the value matches that rail's shape, after trim:

| Field | Setting key | Accepted shape |
|---|---|---|
| `cryptoWalletBtc` | `crypto_wallet_btc` | `bc1` plus 8–87 bech32 characters, or a legacy `1…` / `3…` address |
| `cryptoWalletUsdt` | `crypto_wallet_usdt` | `0x` and exactly 40 hex digits |
| `cryptoWalletEth` | `crypto_wallet_eth` | `0x` and exactly 40 hex digits |
| `cryptoWalletInstructions` | `crypto_wallet_instructions` | Stored text, or the resolver's default sentence when the row is absent |

Anything else — blank, a placeholder, a TRON `T…` address — resolves to `null`. Checkout then prints `Not configured — contact us before sending.` and renders no Copy control. The admin card uses the same predicates and rejects a non-empty value of the wrong shape. Blank is allowed and means unconfigured.

The checkout labels are `BTC — Bitcoin (native SegWit)`, `USDT — Ethereum (ERC-20)`, and `ETH — Ethereum (ERC-20)`. The BTC predicate also accepts legacy `1…` and `3…` addresses.

The catalog seeder does not write wallet keys or `codPaymentStatus`. Enable COD and set the display name in the admin payment screen, or `POST /api/settings` with `codPaymentStatus` and `codDisplayName`, before taking orders.

*Source: [`extensions/elune-payments/src/lib/walletAddress.js`](extensions/elune-payments/src/lib/walletAddress.js), [`extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js`](extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js), [`extensions/elune-payments/src/pages/admin/paymentSetting/CryptoWalletSetting.tsx`](extensions/elune-payments/src/pages/admin/paymentSetting/CryptoWalletSetting.tsx), [`themes/elune/src/pages/checkout/CashOnDelivery.tsx`](themes/elune/src/pages/checkout/CashOnDelivery.tsx). Image routes: `dist/modules/auth/pages/admin/adminLoginJson/route.json` (`POST /user/login`), `dist/modules/setting/pages/admin/paymentSetting/route.json` (`GET /setting/payments`), `dist/modules/setting/api/saveSetting/route.json` (`POST /settings`, private).*

## Seed the catalog

`scripts/seed-catalog.mjs` is the catalog bootstrap. Run it inside the app container so `DB_HOST=database` resolves and `PORT` is the container port 3000. It fails closed without `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Plain HTTP is allowed only for loopback (`localhost`, `127.0.0.1`, `[::1]`).

```bash
docker compose exec app sh -c '
  ADMIN_EMAIL="admin@elunelabs.example" ADMIN_PASSWORD="ChangeMe123" \
  node /app/scripts/seed-catalog.mjs
'
```

Optional `EVERSHOP_BASE_URL` overrides the default `http://localhost:${PORT:-3000}`.

One run, in order:

1. `POST /api/user/tokens` and keep the bearer token. A later 401 logs in once and retries that request once.
2. Set `storeName`, `storeDescription`, and `favicon` only when each is currently empty.
3. Upsert the five categories and 14 products in `scripts/catalog-data.json`.
4. Attach every product to its category on every run.
5. Reconcile native Size variant groups for products that declare `family` and `size`.
6. Retire live categories and products the data file no longer lists (`PATCH` `status: 0`, never `DELETE`).
7. Assert the result. A failure prints `SEED FAILURE:` and exits non-zero.
8. Create CMS pages `/faqs`, `/shipping`, and `/contact` when those `url_key`s are missing. Existing pages are left as saved.

Re-running is safe. It does not overwrite CMS copy or a store name, description, or favicon the admin has already set.

*Source: [`scripts/seed-catalog.mjs`](scripts/seed-catalog.mjs), [`scripts/catalog-data.json`](scripts/catalog-data.json)*

## Build

Theme and extension compiles run inside the app container. The image's `/app/package.json` is not this repo's manifest and does not declare workspaces, so use `npm --prefix`, not `npm --workspace`.

```bash
docker compose exec app npm --prefix themes/elune run build
docker compose exec app npm --prefix extensions/elune-payments run build
docker compose exec app npm --prefix extensions/elune-catalog run build
docker compose exec app npm run build
```

Each package's `build` script is `swc ./src -d dist --copy-files --strip-leading-paths`. Compose sets `NODE_ENV=production`. In that mode the image's extension loader reads `extensions/<name>/dist` and exits if `dist/` is missing. `themes/*/dist/` is gitignored; extension `dist/` is tracked and must be rebuilt when `src/` changes. `npm run build` is EverShop's webpack build into `.evershop`.

`themes/elune/dist` and `extensions/elune-catalog/dist` are often root-owned because the container wrote them. If a host-side rebuild cannot replace those files, run the SWC build inside the container as above.

### Restart after a build

`scripts/restart.sh` is the restart sequence used when `docker compose restart app` is unreliable on a host:

```bash
docker compose exec app kill -TERM 1
sleep 2
docker compose start app
```

Wait until the app healthcheck passes before verifying. Do not send `SIGTERM` to pid 1 while `npm run build` is still writing `.evershop`.

### Verify

`scripts/smoke-checkout.mjs` places a guest order and captures it. It loads `.env` when that file exists (`process.loadEnvFile`). It refuses to run unless `EVERSHOP_ALLOW_MUTATION=1` and both admin variables are set.

```bash
EVERSHOP_ALLOW_MUTATION=1 \
ADMIN_EMAIL="admin@elunelabs.example" \
ADMIN_PASSWORD="ChangeMe123" \
node scripts/smoke-checkout.mjs
```

| Variable | Default | Meaning |
|---|---|---|
| `EVERSHOP_ALLOW_MUTATION` | unset | Must be `1` or the script throws before any request. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | unset | Required. Used for `POST /api/user/tokens` and the capture calls. |
| `EVERSHOP_BASE_URL` | `http://localhost:${PORT:-3000}` | Checkout API origin. HTTP is allowed only for loopback; otherwise HTTPS. |
| `EVERSHOP_STOREFRONT_URL` | `HOME_URL`, else the API base | Page whose `baseUrl` must match the browser origin. |
| `EVERSHOP_CHECKOUT_SKU` | `BPC157-10MG` | Line item. Used verbatim. |
| `CHROMIUM_PATH` | Playwright cache `chrome-linux64/chrome` | Browser binary for the add-to-cart step. |
| `CHROMIUM_NO_SANDBOX` | unset | Set to `1` on AppArmor hosts. |

The browser step prints `SKIP add to cart only marks the clicked card busy (browser): storefront is not loopback` when the storefront host is not loopback. The REST steps still run. Point `HOME_URL` or `EVERSHOP_STOREFRONT_URL` at loopback when that browser assertion should run. Exit 0 prints `ALL CHECKOUT SMOKE STEPS PASSED`.

*Source: [`themes/elune/package.json`](themes/elune/package.json), [`extensions/elune-payments/package.json`](extensions/elune-payments/package.json), [`extensions/elune-catalog/package.json`](extensions/elune-catalog/package.json), [`docker-compose.yml`](docker-compose.yml), [`scripts/restart.sh`](scripts/restart.sh), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs), [`.gitignore`](.gitignore)*

## Backup

```bash
mkdir -p backups
set -a; source .env; set +a
docker compose exec -T database pg_dump -U "$DB_USER" "$DB_NAME" > "backups/elune-$(date +%F).sql"
```

`exec -T` is required so the dump is not a TTY stream. `backups/` is gitignored.

## Restore

```bash
set -a; source .env; set +a
docker compose stop app
docker compose exec -T database psql -U "$DB_USER" "$DB_NAME" < backups/elune-YYYY-MM-DD.sql
docker compose up -d --wait
```

`docker compose down -v` deletes the named volumes, including `postgres-data`, `media-data`, `public-data`, `evershop-build`, and `log-data`. Use it only when the restore target is a new volume.

## Upgrades

1. Take the backup above.
2. Change `image: evershop/evershop:2.2.1` in `docker-compose.yml`.
3. `docker compose pull && docker compose up -d --wait`.

The image runs migrations on start. The pinned COD capture route is `POST /api/cod/captures` with `{ "order_id": "<uuid>" }`. A newer image that renames that route or the pending/paid codes will break `scripts/smoke-checkout.mjs` and the admin capture step until those callers are updated.

*Source: [`docker-compose.yml`](docker-compose.yml), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs), [`.gitignore`](.gitignore)*

## What is in the tree

- `config/default.json` — read-only bind. Active theme `elune`, extensions `elune-payments` and `elune-catalog`, `themeConfig.copyRight`, `checkout.showShippingNote: true`.
- `themes/elune/` — storefront theme, bind-mounted read-write. SWC compiles `src/` to `dist/`.
- `extensions/elune-payments/` — wallet GraphQL fields, admin card, address-shape checks. Production loads `dist/`.
- `extensions/elune-catalog/` — routes `GET /all` and `GET /new-releases`. Page bodies are theme components.
- `scripts/seed-catalog.mjs` and `scripts/catalog-data.json` — catalog bootstrap, read-only bind.
- `scripts/smoke-checkout.mjs` — guest checkout and capture smoke. Not mounted as the way to run it; run it on the host against the published port, or inside the container with `EVERSHOP_BASE_URL=http://127.0.0.1:3000`.
- `scripts/restart.sh` — TERM pid 1, then `docker compose start app`.
- `scripts/cut-dag.sh` — one-shot beads ticket cutter. Its embedded file contracts describe an older compose port mapping and a three-category catalog. It is not part of bring-up.

*Source: [`config/default.json`](config/default.json), [`docker-compose.yml`](docker-compose.yml), [`scripts/cut-dag.sh`](scripts/cut-dag.sh)*
