# Elune Labs

EverShop 2.2.1 storefront for research reference peptides in five categories.
Custom theme (design system is being migrated — see `DESIGN.md`), crypto-on-delivery payments,
RUO compliance disclaimers, age gate, and TXID capture at checkout.

For the full architecture, extensions, and field-change guide see `ARCHITECTURE.md`,
`IMPLEMENTATION.md` and the design docs under `docs/design/` (`8-1-deployment.md`,
`8-2-ui-compliance-payment.md`, `8-3-catalog-orders.md`). The visual system is `DESIGN.md`.

## Runbook

Prerequisites: Docker Engine with the Compose plugin; ~2 GB free RAM; port $PORT free (default 3000; set PORT in .env if 3000 is taken — e.g. 3010 on this host).

```bash
# 1. Clone
git clone <repo-url> elune-labs && cd elune-labs

# 2. Environment
cp .env.example .env
# -> edit .env: set DB_PASSWORD to a strong value; optionally set PORT (default 3000; 3010 on this host)
# note: a pre-existing postgres-data volume keeps the DB password it was initialized with;
#      if .env's DB_PASSWORD differs, drop the volume or run ALTER ROLE evershop WITH PASSWORD '<new>' inside the database container

# 3. Bring up -- blocks until DB is healthy AND the storefront answers
docker compose up -d --wait
# first start pulls images, runs migrations automatically; expect ~1 min

# 4. Create the admin user
#    password policy: >= 8 chars, >= 1 letter, >= 1 digit
docker compose exec app npm run user:create -- \
  --email "admin@elunelabs.example" \
  --password "ChangeMe123" \
  --name "Admin"

# 5. Verify -- storefront + admin console on the live port
PORT="$(sed -n 's/^PORT=//p' .env)"; PORT="${PORT:-3000}"
curl -sf  -o /dev/null -w 'storefront %{http_code}\n' "http://localhost:$PORT"
curl -sL -o /dev/null -w 'admin %{http_code}\n' "http://localhost:$PORT/admin"
# (/admin 302-redirects to /admin/login when unauthenticated; -L follows to the 200 login page)
```

## Remote access (tailnet)

Compose publishes the storefront on **every host interface** by default
(`${BIND_HOST:-0.0.0.0}` in `docker-compose.yml`), so a machine on the same
tailnet opens it at the host's tailnet address -- on this host:

```
http://100.123.49.43:3010          # storefront
http://100.123.49.43:3010/admin    # admin console
```

(`3010` is this host's `PORT`; use whatever `PORT` resolves to.) To publish on the
tailnet only -- nothing on the LAN, nothing on `localhost`:

```bash
# .env
BIND_HOST=100.123.49.43
```

then `docker compose up -d` to republish. `BIND_HOST` is compose interpolation
only: the container still listens on `PORT`, and the healthcheck stays on
`127.0.0.1:$PORT` inside the container. No host firewall is involved (ufw is
disabled on this host); if one is ever enabled, allow the port on `tailscale0`.

> Tailnet-only means `localhost:$PORT` and the LAN address stop answering: every
> URL becomes the tailnet one -- the runbook's smoke curls, `EVERSHOP_BASE_URL`
> for the seed/smoke scripts, and `HOME_URL`. With the default `BIND_HOST=0.0.0.0`
> both work side by side.

### Base URL (`HOME_URL`)

Publishing the port is only half of it. EverShop bakes an **absolute** base URL
into every link, form action and email. Unset, it falls back to
`http://localhost:$PORT` (`getBaseUrl.js`), so a remote browser resolves every
link back to *itself* -- the page loads, nothing else works.

`docker-compose.yml` therefore passes:

```yaml
EVERSHOP_HOME_URL: "${HOME_URL:-http://100.123.49.43:${PORT:-3000}}"
```

so the default base URL is this host's tailnet address and port. Override it in
`.env` when the browse address differs (different tailnet host, LAN IP, tunnel,
reverse proxy):

```bash
# .env
HOME_URL=https://store.example.com
```

Verify the store emits the address you browse from:

```bash
PORT="$(sed -n 's/^PORT=//p' .env)"; PORT="${PORT:-3000}"
curl -s "http://100.123.49.43:$PORT/" | grep -c 'localhost'   # must print 0
```

## Payment settings (crypto wallets)

Admin console: **Settings → Payment** at `/admin/setting/payments`. The page
shows a crypto wallet card (BTC / USDT / ETH addresses + customer
instructions). Edit the fields and save -- changes take effect
**immediately, with no rebuild and no restart** (values live in the database
`setting` table and are read per request; the checkout payment step shows the
new address on the next page load).

The same values can be set programmatically: login as the admin user, then
`POST /api/settings` with the keys to update:

```bash
PORT="$(sed -n 's/^PORT=//p' .env)"; PORT="${PORT:-3000}"

# login -- stores the admin session cookie
curl -s -c /tmp/cookies.txt "http://localhost:$PORT/admin/user/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elunelabs.example","password":"ChangeMe123"}'

# update wallet addresses (effective immediately, no restart)
curl -s -b /tmp/cookies.txt "http://localhost:$PORT/api/settings" \
  -H "Content-Type: application/json" \
  -d '{"crypto_wallet_btc":"bc1q...","crypto_wallet_usdt":"0x...","crypto_wallet_eth":"0x...","crypto_wallet_instructions":"Send the order total, then paste your TXID."}'
```

Verify from the outside (no auth needed):

```bash
curl -s "http://localhost:$PORT/api/graphql" -H "Content-Type: application/json" \
  -d '{"query":"{ setting { codDisplayName cryptoWalletBtc cryptoWalletUsdt cryptoWalletEth cryptoWalletInstructions } }"}'
```

`cryptoWalletUsdt` returns the stored value **only** when it is a 40-hex-digit
Ethereum address (`0x...`); anything else -- unset, a legacy TRON `T...` value,
or a placeholder -- resolves to `null` and the checkout row renders as
unavailable with no Copy control. This is deliberate: an unconfigured rail must
never be shown as payable.

Bootstrapped state: `codPaymentStatus=1`,
`codDisplayName="Crypto Payment (BTC / USDT / ETH)"`, and the wallet keys hold
placeholders -- replace them with real addresses before going live.

**USDT is Ethereum (ERC-20), not TRON.** The retired TRON (`TRC-20`) value
cannot be reused, and the database still holds it, so **USDT will show as
unavailable at checkout until an Ethereum address is saved** -- that is the
expected state, not a failure. To bring the rail up:

1. Open `/admin/setting/payments`.
2. Replace the USDT field with an Ethereum address (`0x` + 40 hex characters)
   for a wallet that can receive USDT on ERC-20. The field rejects anything else.
3. Save, then reload the checkout payment step -- the address appears with no
   rebuild and no restart.

There is no conversion path and no fallback rail: until then, customers pay by
Bitcoin or Ethereum only. Nothing on the payment step promises when a transfer
will be detected or confirmed -- an order stays `pending` until the owner
verifies it on-chain and captures it.

## Seed the catalog

The seeder authenticates as admin and needs the correct base URL and credentials.
Defaults in the script are `localhost:3000` and `admin@evershop.com` -- **neither
matches this deployment**. Set env vars explicitly:

```bash
docker compose exec app sh -c '
  EVERSHOP_BASE_URL="http://localhost:3010"   ADMIN_EMAIL="admin@elunelabs.example"   ADMIN_PASSWORD="ChangeMe123"   node /app/scripts/seed-catalog.mjs
'
```

Creates the five categories (glps, bioregulators, recovery, gh-releasing, other) and 14 products with prices.
Idempotent -- safe to re-run. See `docs/design/8-3-catalog-orders.md` §2 for the data contract and
`ARCHITECTURE.md` §4 for how the seed fits the system.

## Build workflow

Theme and app builds run **inside the container**. The theme uses SWC (fast),
the app uses webpack (slower, ~30s client + ~10s server).

```bash
# Build theme (SWC -- compiles themes/elune/src -> dist/)
docker compose exec app npm --prefix themes/elune run build

# Build extension (SWC -- compiles extensions/elune-payments/src -> dist/)
docker compose exec app npm --prefix extensions/elune-payments run build

# Build app (webpack -- compiles .evershop/build/)
docker compose exec app npm run build
```

`--prefix`, not `--workspace`: `/app/package.json` is the image manifest (not
bind-mounted) and declares no workspaces, so `--workspace=<dir>` fails on a
fresh container. `npm --prefix <dir> run build` resolves `swc` from
`/app/node_modules/.bin` and needs no image mutation.

### Restart after a build

`docker compose restart app` fails on some hosts. Workaround:

```bash
docker compose exec app kill -TERM 1; sleep 2; docker compose start app
```

Wait for the healthcheck to pass (storefront returns 200) before verifying.

> **Never** run `kill -TERM 1` while a build is still running -- it truncates the
> `.evershop/build` tree. Always wait for the build to finish completely.

### Verify the rebuild

```bash
node scripts/smoke-checkout.mjs    # guest checkout end-to-end; exit 0 = pass
```

Loads `.env`, verifies the Tailscale storefront emits matching browser-facing
cart URLs (override with `EVERSHOP_STOREFRONT_URL`), then runs the checkout API
flow on `http://localhost:3010` (override with `EVERSHOP_BASE_URL`); zero
dependencies, needs no container exec.

## Backup

```bash
mkdir -p backups
set -a; source .env; set +a
docker compose exec -T database pg_dump -U "$DB_USER" "$DB_NAME" > "backups/elune-$(date +%F).sql"
```

`-T` is mandatory (disables TTY allocation).

## Restore

```bash
set -a; source .env; set +a
# Stop the app, keep the DB running
docker compose stop app
# Restore into the existing volume
docker compose exec -T database psql -U "$DB_USER" "$DB_NAME" < backups/elune-YYYY-MM-DD.sql
# Or restore into a fresh volume:
# docker compose down -v  # removes postgres-data volume
docker compose up -d --wait
```

## Upgrades

1. **Backup first** (always)
2. Bump the image tag in `docker-compose.yml` (`image: evershop/evershop:X.Y.Z`)
3. Pull and recreate:
```bash
docker compose pull
docker compose up -d --wait
```
> Migrations run automatically and are irreversible. Major versions can break
> themes — re-verify all components after upgrading.

## Architecture at a glance

```
+------------------------------------------------------+
|  Docker Compose                                       |
|                                                      |
|  +--------------------+     +----------------------+ |
|  |  app (evershop      |     |  database (postgres  | |
|  |  2.2.1, Node 20)    |---->|  16)                 | |
|  |                    |     |                      | |
|  |  ./themes   (bind)  |     |  postgres-data      | |
|  |  ./extensions (rw)  |     |  (named volume)      | |
|  |  ./config (ro)      |     +----------------------+ |
|  |  ./scripts (ro)    |                               |
|  |  .evershop (vol)   |                               |
|  +--------------------+                               |
+------------------------------------------------------+
```

- **config/default.json** -- repo-committed, read-only mount. Sets `system.theme`,
  `system.extensions`, `themeConfig.copyRight`, `checkout.showShippingNote`.
- **themes/elune/** -- custom theme (bind mount, read-write). SWC builds to `dist/`.
  EverShop webpack picks up `dist/` and merges components into the client bundle.
- **extensions/elune-payments/** -- custom extension (bind mount, read-write).
  SWC builds to `dist/`; adds GraphQL fields for crypto wallet addresses to the
  Setting type.
- **scripts/** -- seed catalog, DAG cutter (read-only bind mount).

See `ARCHITECTURE.md` for the subsystem map and `IMPLEMENTATION.md` for the build order.
