# Design 8.1 — Deployment Topology: Compose Layout, Volumes, Bootstrap Runbook

Ticket: `elune-labs-tvg.8.1` · Subsystem: Deployment & Operations · Inputs: SPEC.md FR-1, NFR (pinned images, 2 GB RAM, documented pg_dump), ADR #2 (`elune-labs-tvg.2`, research), ADR #6 (VPS deferred, portable compose now).

**Verified against upstream sources** (2026-09-09): official `docker-compose.yml`, root `Dockerfile` (dev image), `docker/Dockerfile` (published image), `docker/package.json`, and the installation guide at evershop.io. Anything not verified upstream is marked **[UNVERIFIED]**.

---

## 1. Upstream facts this design stands on

From `docker/Dockerfile` + `docker/package.json` (the published `evershop/evershop` image):

- Base `node:20-alpine`, `WORKDIR /app`, **no `USER` directive → container runs as root (uid 0)**.
- Installs `@evershop/evershop@<version>` with `--save-exact`; the image tag is a hard pin.
- Runs `npm run build` **at image build time**; `CMD ["npm", "run", "start"]`; `EXPOSE 3000`, port overridable via `PORT` env.
- Scripts available **inside the image**: `setup`, `seed`, `start`, `start:debug`, `build`, `user:create`, `user:changePassword`, `theme:create`, `theme:active`. **Not present**: `dev`, `theme:twizz`, `theme:status`, `theme:uninstall`, `theme:export-content` (they exist only in a manual npm install). Theme workflow in-container is create/activate + build/start, nothing else.
- Stock `docker-compose.yml` has **no healthchecks, no app-side volumes** (`media/`, `public/`, `.evershop/`, `.log/`), plain `depends_on` without condition, publishes Postgres `5432:5432`, uses `restart: always` on app, and hardcodes `postgres/postgres` creds.
- Install guide: write-permission folders are `public/`, `.evershop`, `.log`, `media`; migrations run automatically when the app starts; `user:create` password policy is ≥ 8 chars with ≥ 1 letter and ≥ 1 digit.
- The root `Dockerfile` in the repo is the **development** image (builds the monorepo) — it is *not* what `evershop/evershop:2.2.1` ships. Don't confuse the two when reading upstream.

---

## 2. Decisions

### D1 — App-side state paths: **named volumes, not bind mounts**

| Container path | Mount type | Why |
|---|---|---|
| `/app/media` | named `media-data` | Product images. App (root) writes; named volume ⇒ zero UID friction. Host pull via `docker compose cp`. |
| `/app/public` | named `public-data` | Built static assets. Written by build/start, never hand-edited. |
| `/app/.evershop` | named `evershop-build` | Build artifacts + runtime state. Written by build/start. |
| `/app/.log` | named `log-data` | Logs. Inspect via `docker compose exec app cat` / `docker compose logs`. |

Options considered:

- **Bind mounts** (`./media:/app/media`, …): gives direct host visibility, but the container writes as root — on a Linux host every file the app creates lands **root-owned** in the repo (git-status noise, edit-permission pain); on rootless/podman-style setups it can flip the other way and produce genuine UID-mismatch write failures. Host visibility is a want, not a need.
- **Named volumes** (chosen): no UID semantics at all, survive `down`/`up`, and Docker's copy-up seeds an empty named volume with the image's content at that path on first mount — which is load-bearing here: the baked webpack output in `.evershop/`/`public/` lands in the volume, so first start works. An empty **bind** mount at those paths would *shadow* the baked output and break startup.

Consequences: bulk host access to media means `docker compose cp app:/app/media/. ./media` (and reverse to push). If the owner later wants live host-side media editing, switch `/app/media` to a bind and `chown`/`chmod 777` once — documented escape hatch, not the default. **Do not** convert `.evershop`/`public` to empty host binds (see copy-up above).

### D2 — Source paths: **bind mounts, read-only where possible**

| Container path | Mount | Mode | Why |
|---|---|---|---|
| `/app/themes` | `./themes` | rw | Theme source lives in the repo and must be host-editable (FR-5). RW because one-time `npm run theme:create` scaffolds *into* it from inside the container. |
| `/app/scripts` | `./scripts` | ro | Seed script (FR-6) is repo code the container only reads. |
| `/app/config` | `./config` | ro | **Active-theme persistence**: `theme:active` writes `system.theme` into `config/default.json` (verified upstream CLI docs) — without this bind the file lives only in the container layer and the store silently reverts to the default theme on recreate. The repo commits a one-key `config/default.json`. Wallet/instruction settings are DB rows (design 8.2), so no payment keys land here. |

These binds are what put "mounted theme code" into the stock image (FR-1 assumes it). Read-only mode means root-in-container can never write into host source dirs → no UID pollution there. One caveat: files created by `theme:create` inside the rw `themes/` bind are root-owned on Linux; `sudo chown -R "$(id -u):$(id -g)" themes/` once after scaffolding.

### D3 — Secrets/config: one `.env`, two consumption paths

Single `.env` at repo root (gitignored, `.env.example` committed):

```dotenv
# .env.example — copy to .env, then set DB_PASSWORD
PORT=3000
# Interface Docker publishes the storefront on. 127.0.0.1 = loopback only;
# expose it with `tailscale serve --bg http://127.0.0.1:${PORT}`.
BIND_HOST=127.0.0.1
# Public base URL baked into links/emails. Use the https URL clients reach,
# e.g. https://<node>.<tailnet>.ts.net when fronted by `tailscale serve`.
HOME_URL=http://localhost:3000
DB_HOST=database
DB_PORT=5432
DB_NAME=evershop
DB_USER=evershop
DB_PASSWORD=change-me-strong
DB_SSLMODE=disable
```

- **app** service gets everything via `env_file: .env` (matches the `.env` shape `evershop install` produces upstream).
- **database** service gets `POSTGRES_USER/DB/PASSWORD` via compose **interpolation** of the same file (compose reads root `.env` automatically).
- `PORT` in `.env` is the **host** publish port only. The app publishes on loopback by default and the compose `environment:` override pins the *container* port to 3000, so the two cannot drift when the host port is changed (e.g. `PORT=3010`).
- `DB_HOST=database` is the compose service name — never change it. `DB_SSLMODE=disable` is correct for the on-host compose network (localhost-only exposure).

Fail-fast: the password interpolates as `${DB_PASSWORD:?set DB_PASSWORD in .env}` so `up` aborts with a clear message instead of initializing Postgres with an empty password.

### D4 — Healthchecks and ordering

- `database`: `pg_isready -U $DB_USER -d $DB_NAME` — the stock compose has **no healthcheck at all**; without it the app races Postgres init on first-ever start (the exact failure `depends_on` without condition does not prevent).
- `app`: small `wget --spider` check against the container's own loopback (`http://127.0.0.1:3000/`) — the container port is pinned to 3000, so the check never depends on the host `PORT`. Not upstream, but it makes `docker compose up -d --wait` a single blocking "everything answers" step in the runbook, and gives honest state in `docker compose ps`. `start_period` covers first-start migrations.
- `depends_on: database: condition: service_healthy` — long syntax, per FR-1.

### D5 — Deliberate omissions from the stock compose

- No `version:` key — obsolete in Compose v2, only triggers warnings.
- No custom named network — the default project network already provides service DNS (`database` resolves).
- **Postgres port not published to host** (stock publishes `5432:5432`): nothing on the host needs it; `docker compose exec database psql -U …` covers manual access. Add the mapping temporarily if a GUI client is ever wanted.
- `restart: unless-stopped` on both services (stock app uses `always`; `unless-stopped` respects an explicit `compose stop` across daemon restarts — correct for a laptop/owner-operated host).

---

## 3. Final `docker-compose.yml` sketch

```yaml
# docker-compose.yml — Elune Labs storefront (EverShop 2.2.1 + Postgres 16)
services:
  app:
    image: evershop/evershop:2.2.1        # hard pin; latest == next == 2.2.1 today, pin anyway
    restart: unless-stopped
    env_file: .env                         # DB_*, DB_SSLMODE into the container (PORT pinned below)
    environment:
      DB_HOST: database                    # belt-and-suspenders: service name wins over .env
      # Container always listens on 3000. .env PORT is the *host* port only and
      # is overridden here so the two can never drift apart.
      PORT: 3000
      # Absolute base URL the store bakes into links/forms/emails; defaults to
      # local. Set HOME_URL in .env to the public URL used to reach the store
      # (e.g. https://<node>.<tailnet>.ts.net behind `tailscale serve`).
      EVERSHOP_HOME_URL: "${HOME_URL:-http://localhost:${PORT:-3000}}"
    ports:
      # host-addr : host-port : container-port (container always listens on 3000).
      # BIND_HOST is the address Docker publishes on. Default 127.0.0.1 keeps
      # the storefront off every network interface — reach it through a local
      # proxy such as `tailscale serve --bg http://127.0.0.1:${PORT}`.
      - "${BIND_HOST:-127.0.0.1}:${PORT:-3000}:3000"
    volumes:
      - media-data:/app/media              # product images            (state → named)
      - public-data:/app/public            # built static assets       (state → named)
      - evershop-build:/app/.evershop      # build artifacts, sessions (state → named)
      - log-data:/app/.log                 # logs                      (state → named)
      - ./themes:/app/themes               # theme source              (code → bind, rw for scaffold)
      - ./scripts:/app/scripts:ro          # seed script               (code → bind, ro)
      - ./config:/app/config:ro            # persists system.theme (repo-committed config/default.json)
    depends_on:
      database:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget -q --spider http://127.0.0.1:3000/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 12
      start_period: 60s                    # first start runs migrations

  database:
    image: postgres:16                     # pinned major
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD:?set DB_PASSWORD in .env}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s
    # no ports: — DB is reachable only on the compose network (exec psql to reach it)

volumes:
  postgres-data:
  media-data:
  public-data:
  evershop-build:
  log-data:
```

Repo artifacts this sketch assumes (created by implementation beads, not this one): `.env.example` (contents in D3), `themes/` (8.2/5), `scripts/` (seed script from 8.3), and `config/default.json` containing `{"system": {"theme": "elune"}}` (active-theme persistence — required, not optional). `.env` must be gitignored.

RAM: two services ≈ well under the 2 GB EverShop minimum budget; no tuning needed.

---

## 4. Bootstrap runbook (copy-pasteable)

Prerequisites: Docker Engine with the compose plugin; ~2 GB free RAM; the host `PORT` (default 3000) free; Tailscale on the host (`tailscale serve`) if the store must be reachable from the tailnet.

```bash
# 1. Clone
git clone <repo-url> elune-labs && cd elune-labs

# 2. Environment
cp .env.example .env
# → edit .env: set DB_PASSWORD to a strong value (PORT stays 3000)

# 3. Bring up — blocks until DB is healthy AND the storefront answers
docker compose up -d --wait
# first start pulls images, runs migrations automatically; expect ~1 min
# app publishes on 127.0.0.1:$PORT only — reachable from this host alone

# 3b. Expose it on the tailnet over HTTPS (skip for loopback-only use)
tailscale serve --bg http://127.0.0.1:3010    # 3010 = this host's PORT
tailscale serve status                        # prints the https:// node URL
# then put that https URL in .env as HOME_URL and re-run
# `docker compose up -d` so links/emails use the public address

# 4. Create the admin user
#    password policy: >= 8 chars, >= 1 letter, >= 1 digit
docker compose exec app npm run user:create -- \
  --email "admin@elunelabs.example" \
  --password "ChangeMe123" \
  --name "Admin"

# 5. Seed the catalog (script designed in 8.3 — see docs/design/8-3-*.md;
#    invocation pattern only, final flags owned by that design)
docker compose exec app node scripts/seed-catalog.mjs \
  --email "admin@elunelabs.example" --password "ChangeMe123"
```

### 5. Admin settings walkthrough (`http://localhost:3000/admin`)

Reachable at that loopback URL from the host itself; from another machine use the `tailscale serve` node URL instead (and keep `HOME_URL` in sync, see gotcha 12).

1. Log in with the step-4 credentials.
2. **Settings → store**: name `Elune Labs`, currency `USD` (single-currency invariant — nothing else gets enabled).
3. **Settings → payment**: enable the built-in offline/COD method (`codPaymentStatus` toggle); set display name to something like `Cryptocurrency (manual transfer)` — it must **not** read "cash on delivery" (FR-3); paste the wallet instructions text with the **BTC / USDT (Ethereum, ERC-20) / ETH** address blocks (placeholder addresses per ADR #7; owner swaps real wallets here — no code change). The USDT field takes an **Ethereum** address (`0x…`, 40 hex digits) and nothing else: the retired TRON (`TRC-20`) address cannot be reused, and while the field holds a non-Ethereum value the USDT row renders as unavailable rather than as a payable address. See 8-2 §3.
4. **Settings → shipping**: default zone → core provider → flat rate per order (set the dollar amount; SPEC §5 — one flat rate, no tiers in v1).
5. Payment confirmation flow lives in **Orders**: open a pending order → verify the customer's TXID on-chain → **Capture** → `payment_status` flips to `paid`. This is the only pending→paid path (payment invariant, SPEC §6).

Exact admin menu labels may vary slightly in 2.2.1 — **[UNVERIFIED]** at menu granularity; the setting *capabilities* (name/currency/payment toggle+display name/flat rate) are verified via SPEC FR-7 + ADR #8.

### 6. Verification checks

```bash
curl -sf -o /dev/null -w '%{http_code}\n' http://localhost:3000         # 200
curl -sf -o /dev/null -w '%{http_code}\n' http://localhost:3000/admin   # 200
```

Then the manual smoke from SPEC §7: storefront shows 3 categories with products → add to cart → guest checkout with flat-rate shipping → order appears in admin as pending → Capture → paid. Persistence: `docker compose down && docker compose up -d --wait` → catalog, settings, order all survive (named volumes prove themselves).

---

## 5. Operations

### Theme change rebuild (FR-1)

```bash
# edit themes/<name>/... then:
docker compose exec app npm run build      # recompiles into the .evershop volume
docker compose restart app                 # safe default; the running server doesn't hot-reload
```

One-time theme scaffold (scripts exist in the image — verified):

```bash
docker compose exec app npm run theme:create elune
sudo chown -R "$(id -u):$(id -g)" themes/   # scaffold files were written by root in the container
docker compose exec app npm run build && docker compose restart app
```

Activation is **not** run in the container: `config/` is mounted read-only and the active theme is already pinned by the repo-committed `config/default.json` (`system.theme=elune`). For Elune's presentation-only theme (component/style overrides, no `theme.json` widget content — FR-5 surface) that is all activation would do anyway. Contingency: if the theme later gains `theme.json` content (widgets/placements, which install into the **database**), run `docker compose exec app npm run theme:active -- elune` once with the config bind temporarily flipped to rw — the DB content then survives via `postgres-data`.

### Backup (documented pg_dump only, per ADR #6)

```bash
mkdir -p backups
set -a; source .env; set +a
docker compose exec -T database pg_dump -U "$DB_USER" "$DB_NAME" > "backups/elune-$(date +%F).sql"
```

`exec -T` is **mandatory** — with a TTY the dump is polluted by CRLF/escape sequences and psql will choke on restore.

### Restore (into a fresh volume)

```bash
docker compose down
docker volume rm "$(basename "$PWD")_postgres-data"   # or compose down -v if nuking everything
docker compose up -d --wait database
set -a; source .env; set +a
cat backups/<backup>.sql | docker compose exec -T database psql -U "$DB_USER" -d "$DB_NAME"
docker compose up -d
```

### Upgrade path

1. **Backup first** (command above) — migrations run automatically on app start and are **not reversible** (upstream docs).
2. Bump the pinned tag in `docker-compose.yml` (e.g. `2.2.1` → `2.3.x`; prefer minor/patch).
3. `docker compose pull app && docker compose up -d` — migrations apply on start; data survives via named volumes; theme source survives via bind.
4. Verify: smoke checklist from §4.6.
5. **Major-version upgrades can break themes** (2.2 moved React 17 → 19, failing silently at runtime, not build time — upstream docs): test on a staging copy before touching the live store; expect theme rework (the maintenance cost ADR #5 already accepted).

Rollback = re-pin the old tag and `up -d`. Only safe if the new version's migrations have *not* run yet — after they have, DB rollback means restore-from-backup.

---

## 6. Gotchas carried into the runbook (from research bead `elune-labs-tvg.2` + this design's verification)

1. **Stock compose is incomplete for persistence**: no `media/`, `public/`, `.evershop/`, `.log/` volumes and no healthchecks. Running it verbatim loses uploads/build state on recreate and races Postgres on first start. Our sketch fixes both.
2. **Pin `2.2.1`**: `latest` == `next` == `2.2.1` today — pinning buys upgrade control, not version lag (ADR #2).
3. **Core is baked at image build; CMD is `npm run start`**: theme/code changes need `docker compose exec app npm run build` (+ restart), never an image rebuild for theme tweaks.
4. **Container runs as root** (no `USER` in the published Dockerfile): app-*writable* paths must be named volumes, or a Linux host collects root-owned files / hits UID mismatch (D1).
5. **Named-volume copy-up is load-bearing**: the first mount of an empty named volume copies the image's baked `.evershop/`/`public/` content in. Replacing those with *empty host bind mounts* shadows the baked output and breaks startup. Don't "simplify" D1 into binds.
6. **Image script surface is smaller than a manual install**: no `dev`, `theme:twizz/status/uninstall/export-content` inside the image (verified `docker/package.json`). Anything theme-workflow-shaped beyond create/activate/build/start must run another way.
7. **`user:create` password policy** (≥ 8 chars, ≥ 1 letter + 1 digit) — a weaker password fails the command, not just login.
8. **`exec -T` for pg_dump/psql pipes** — without it the TTY corrupts the SQL stream (§5).
9. **Root repo `Dockerfile` ≠ published image** — don't read it as the deployment truth; the published image builds from `docker/Dockerfile` installing the exact npm release.
10. **First `up` runs migrations automatically** — there is no separate migrate step to run or forget; this is why a pre-upgrade backup is non-negotiable.
11. **`theme:active` writes `config/default.json`** — in a bare container that file is ephemeral, so a recreate silently reverts the storefront to the default theme. The ro `config/` bind + repo-committed file (D2) is what keeps the theme active across `down`/`up`; don't drop the mount.
12. **Loopback publish is the default, so the browser must be local** — `BIND_HOST=127.0.0.1` means only this host reaches the storefront; from anywhere else the store is the `tailscale serve` HTTPS URL. Whenever clients reach it over the tailnet, `HOME_URL` **must** be that public URL too, or EverShop bakes `http://localhost:$PORT` into forms and emails and every link resolves back to the client's own machine.

---

## 7. Explicitly out of scope (per SPEC non-goals / ADR #6)

VPS/TLS/reverse proxy (the tailnet HTTPS ingress is `tailscale serve --bg` against the loopback port, deliberately *not* a compose service — the Caddy-vs-Traefik decision stays deferred until a host exists, and compose stays portable), automated backup scheduling, app-level replication/HA, CI image builds.
