# Elune Labs

EverShop 2.2.1 storefront.

## Runbook

Prerequisites: Docker Engine with the Compose plugin; ~2 GB free RAM; port $PORT free (default 3000; set PORT in .env if 3000 is taken — e.g. 3010 on this host).

```bash
# 1. Clone
git clone <repo-url> elune-labs && cd elune-labs

# 2. Environment
cp .env.example .env
# → edit .env: set DB_PASSWORD to a strong value; optionally set PORT (default 3000; 3010 on this host)
# note: a pre-existing postgres-data volume keeps the DB password it was initialized with;
#      if .env's DB_PASSWORD differs, drop the volume or run ALTER ROLE evershop WITH PASSWORD '<new>' inside the database container

# 3. Bring up — blocks until DB is healthy AND the storefront answers
docker compose up -d --wait
# first start pulls images, runs migrations automatically; expect ~1 min

# 4. Create the admin user
#    password policy: >= 8 chars, >= 1 letter, >= 1 digit
docker compose exec app npm run user:create -- \
  --email "admin@elunelabs.example" \
  --password "ChangeMe123" \
  --name "Admin"

# 5. Verify — storefront + admin console on the live port
PORT="$(sed -n 's/^PORT=//p' .env)"; PORT="${PORT:-3000}"
curl -sf  -o /dev/null -w 'storefront %{http_code}\n' "http://localhost:$PORT"
curl -sL -o /dev/null -w 'admin %{http_code}\n' "http://localhost:$PORT/admin"
# (/admin 302-redirects to /admin/login when unauthenticated; -L follows to the 200 login page)
```
