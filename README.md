# Elune Labs

EverShop 2.2.1 storefront for research chemicals (peptides, SARMs, nootropics).
Custom dark-violet theme, crypto-on-delivery payments, RUO compliance disclaimers,
age gate, and TXID capture at checkout.

For the full architecture, extensions, and field-change guide see
[docs/DEVELOPER.md](docs/DEVELOPER.md).

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

## Seed the catalog

The seeder authenticates as admin and needs the correct base URL and credentials.
Defaults in the script are `localhost:3000` and `admin@evershop.com` -- **neither
matches this deployment**. Set env vars explicitly:

```bash
docker compose exec app sh -c '
  EVERSHOP_BASE_URL="http://localhost:3010"   ADMIN_EMAIL="admin@elunelabs.example"   ADMIN_PASSWORD="ChangeMe123"   node /app/scripts/seed-catalog.mjs
'
```

Creates 3 categories (peptides, sarms, nootropics) and 15 products with prices.
Idempotent -- safe to re-run. See [docs/DEVELOPER.md](docs/DEVELOPER.md#seed-catalog) for details.

## Build workflow

Theme and app builds run **inside the container**. The theme uses SWC (fast),
the app uses webpack (slower, ~30s client + ~10s server).

```bash
# Build theme (SWC -- compiles themes/elune/src -> dist/)
docker compose exec app npm run build --workspace=themes/elune

# Build app (webpack -- compiles .evershop/build/)
docker compose exec app npm run build
```

### Restart after a build

`docker compose restart app` fails on some hosts. Workaround:

```bash
docker compose exec app kill -TERM 1; sleep 2; docker compose start app
```

Wait for the healthcheck to pass (storefront returns 200) before verifying.

> **Never** run `kill -TERM 1` while a build is still running -- it truncates the
> `.evershop/build` tree. Always wait for the build to finish completely.

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
|  |  ./extensions (ro)  |     |  (named volume)      | |
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
- **extensions/elune-payments/** -- custom extension (bind mount, read-only).
  Adds GraphQL fields for crypto wallet addresses to the Setting type.
- **scripts/** -- seed catalog, DAG cutter (read-only bind mount).

See [docs/DEVELOPER.md](docs/DEVELOPER.md) for the full guide.
