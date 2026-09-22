# Deployment: Compose layout, volumes, and runbook

The storefront runs as two Compose services. This document matches `docker-compose.yml` and `.env.example`. Operator commands are repeated, shorter, in [README-grok-unapproved.md](../../README-grok-unapproved.md).

## 1. Services

| Service | Image | Publish | Restart |
|---|---|---|---|
| `app` | `evershop/evershop:2.2.1` | `${BIND_HOST:-127.0.0.1}:${PORT:-3000}:3000` | `unless-stopped` |
| `database` | `postgres:16` | none | `unless-stopped` |

`app` reads `env_file: .env` and then sets:

| Variable | Value |
|---|---|
| `DB_HOST` | `database` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `EVERSHOP_HOME_URL` | `${HOME_URL:-http://localhost:${PORT:-3000}}` |

`PORT=3000` inside the container overrides `PORT` from `.env`. The host port and the in-container port are different variables on purpose. The healthcheck always requests `http://127.0.0.1:3000/`.

`database` takes `POSTGRES_USER=${DB_USER}`, `POSTGRES_PASSWORD=${DB_PASSWORD:?set DB_PASSWORD in .env}`, `POSTGRES_DB=${DB_NAME}`. An empty or missing `DB_PASSWORD` fails `docker compose` before the container starts.

`app` depends on `database` with `condition: service_healthy`.

*Source: [`docker-compose.yml`](../../docker-compose.yml)*

## 2. Volumes

Named volumes hold state that the image copy-up populates on first start:

| Volume | Container path |
|---|---|
| `media-data` | `/app/media` |
| `public-data` | `/app/public` |
| `evershop-build` | `/app/.evershop` |
| `log-data` | `/app/.log` |
| `postgres-data` | `/var/lib/postgresql/data` |

Binds hold source:

| Host path | Container path | Mode |
|---|---|---|
| `./themes` | `/app/themes` | read-write (SWC writes `dist/`) |
| `./extensions` | `/app/extensions` | read-write (SWC writes `dist/`) |
| `./scripts` | `/app/scripts` | read-only |
| `./config` | `/app/config` | read-only |

`config/default.json` is the file that selects theme `elune` and enables `elune-payments` and `elune-catalog`. Because the config directory is read-only in the container, the running app cannot rewrite that file.

There is no `version` key and no custom network. Compose's default network is what lets `DB_HOST=database` resolve.

*Source: [`docker-compose.yml`](../../docker-compose.yml), [`config/default.json`](../../config/default.json)*

## 3. Healthchecks

App:

```yaml
test: ["CMD-SHELL", "wget -q --spider http://127.0.0.1:3000/ || exit 1"]
interval: 10s
timeout: 5s
retries: 12
start_period: 60s
```

The start period covers image pull and the first migration run.

Database:

```yaml
test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
interval: 5s
timeout: 5s
retries: 10
start_period: 10s
```

`docker compose up -d --wait` returns when both checks are healthy.

*Source: [`docker-compose.yml`](../../docker-compose.yml)*

## 4. Environment file

Copy `.env.example` to `.env`. Committed defaults:

```
PORT=3000
DB_HOST=database
DB_PORT=5432
DB_NAME=evershop
DB_USER=evershop
DB_PASSWORD=change-me-strong
DB_SSLMODE=disable
BIND_HOST=127.0.0.1
HOME_URL=http://localhost:3000
```

`.env` is gitignored. `DB_HOST` in the file is overwritten by the service `environment` block. `DB_PORT` is not published on the host; it is the port Postgres listens on inside the Compose network. The seeder's `pg` client uses `DB_PORT` when the script runs in the app container.

The Postgres volume stores the password from the first initialization. Changing `DB_PASSWORD` later does not alter that role. Either `ALTER ROLE` inside the database container or remove `postgres-data` and initialize again.

`user:create` in this image rejects passwords shorter than 8 characters and accepts longer passwords with no letter or digit requirement (`dist/bin/user/create.js`, `isValidPassword`).

*Source: [`.env.example`](../../.env.example), [`.gitignore`](../../.gitignore)*

## 5. Bootstrap

```bash
cp .env.example .env
# set DB_PASSWORD

docker compose up -d --wait

docker compose exec app npm run user:create -- \
  --email "admin@elunelabs.example" \
  --password "ChangeMe123" \
  --name "Admin"
```

Then, on the host port (`PORT` from `.env`, else 3000):

```bash
PORT="$(sed -n 's/^PORT=//p' .env)"; PORT="${PORT:-3000}"
curl -sf -o /dev/null -w 'storefront %{http_code}\n' "http://127.0.0.1:$PORT/"
curl -sL -o /dev/null -w 'admin %{http_code}\n' "http://127.0.0.1:$PORT/admin"
```

Catalog seed and the payment-card walkthrough are in [8-3-catalog-orders-grok-unapproved.md](8-3-catalog-orders-grok-unapproved.md) and [8-2-ui-compliance-payment-grok-unapproved.md](8-2-ui-compliance-payment-grok-unapproved.md). The seed does not enable COD and does not write wallet addresses.

### Loopback and Tailscale Serve

Default `BIND_HOST` is `127.0.0.1`, so the published port is not on the LAN. Serve can forward a tailnet HTTPS name to it:

```bash
tailscale serve --bg "http://127.0.0.1:${PORT}"
```

Put the `https://` node URL in `HOME_URL` and recreate the app container (`docker compose up -d app`) so `EVERSHOP_HOME_URL` matches the origin browsers use. A page loaded through Serve while `HOME_URL` is still `http://localhost:3000` will emit localhost links.

`BIND_HOST=0.0.0.0` publishes on all interfaces. The Compose comments describe loopback plus Serve as the intended remote path.

*Source: [`docker-compose.yml`](../../docker-compose.yml), [`.env.example`](../../.env.example)*

## 6. Rebuild

Production mode loads extension code from `dist/`. Theme `dist/` is gitignored and produced by SWC. EverShop's own bundle is `npm run build` (webpack) into the `evershop-build` volume.

```bash
docker compose exec app npm --prefix themes/elune run build
docker compose exec app npm --prefix extensions/elune-payments run build
docker compose exec app npm --prefix extensions/elune-catalog run build
docker compose exec app npm run build
```

Use `--prefix`. The image manifest at `/app/package.json` is not this repo's `package.json` and has no workspaces.

Restart sequence in `scripts/restart.sh`:

```bash
docker compose exec app kill -TERM 1
sleep 2
docker compose start app
```

Do not signal pid 1 while webpack is still writing `/app/.evershop`.

*Source: [`docker-compose.yml`](../../docker-compose.yml), [`scripts/restart.sh`](../../scripts/restart.sh), [`package.json`](../../package.json)*

## 7. Backup and restore

```bash
mkdir -p backups
set -a; source .env; set +a
docker compose exec -T database pg_dump -U "$DB_USER" "$DB_NAME" > "backups/elune-$(date +%F).sql"
```

`-T` disables the TTY. Without it, `pg_dump` output is not a clean SQL file.

Restore while the database stays up and the app is stopped:

```bash
set -a; source .env; set +a
docker compose stop app
docker compose exec -T database psql -U "$DB_USER" "$DB_NAME" < backups/elune-YYYY-MM-DD.sql
docker compose up -d --wait
```

`docker compose down -v` removes every named volume listed in section 2, not only Postgres.

*Source: [`docker-compose.yml`](../../docker-compose.yml), [`.gitignore`](../../.gitignore)*

## 8. Upgrade

1. Dump the database.
2. Change the `evershop/evershop` tag in `docker-compose.yml`. Leave `postgres:16` unless the Postgres major version is part of the change.
3. `docker compose pull && docker compose up -d --wait`.

Migrations run on app start. The checkout smoke and the admin capture button call `POST /api/cod/captures`. Re-run `scripts/smoke-checkout.mjs` after a tag bump. A newer image that moves capture to another path will fail that script until the script is updated.

*Source: [`docker-compose.yml`](../../docker-compose.yml), [`scripts/smoke-checkout.mjs`](../../scripts/smoke-checkout.mjs)*

## 9. Not in this Compose file

- No TLS terminator. HTTPS in front of the store is `tailscale serve` or another proxy the operator runs.
- No published Postgres port.
- No backup sidecar. The dump command above is the backup.
- No bind mount of the repo `package.json`.

*Source: [`docker-compose.yml`](../../docker-compose.yml)*
