# Elune Labs

EverShop 2.2.1 storefront.

## Runbook

Prerequisites: Docker Engine with the Compose plugin; ~2 GB free RAM; port 3000 free.

```bash
# 1. Clone
git clone <repo-url> elune-labs && cd elune-labs

# 2. Environment
cp .env.example .env
# → edit .env: set DB_PASSWORD to a strong value (PORT stays 3000)

# 3. Bring up — blocks until DB is healthy AND the storefront answers
docker compose up -d --wait
# first start pulls images, runs migrations automatically; expect ~1 min

# 4. Create the admin user
#    password policy: >= 8 chars, >= 1 letter, >= 1 digit
docker compose exec app npm run user:create -- \
  --email "admin@elunelabs.example" \
  --password "ChangeMe123" \
  --name "Admin"
```
