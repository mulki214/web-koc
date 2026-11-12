# Production deployment on the Manuflow VPS

The production checkout is `/opt/knockoutclub` on branch `main`. Docker Compose runs a separate PostgreSQL 16 database and the Next.js app on host port `127.0.0.1:3001`. The existing Manuflow Caddy container reaches the app through the shared `manuflow_proxy` Docker network and serves HTTPS at `https://knockoutclub.id`.

## Initial setup

```bash
git clone --branch main https://github.com/mulki214/web-koc.git /opt/knockoutclub
cd /opt/knockoutclub
cp .env.production.example .env.production
chmod 600 .env.production
# Set strong random POSTGRES_PASSWORD and SESSION_SECRET values.
docker compose --env-file .env.production -f compose.production.yaml build migrate web
docker compose --env-file .env.production -f compose.production.yaml up -d db
docker compose --env-file .env.production -f compose.production.yaml run --rm migrate
docker compose --env-file .env.production -f compose.production.yaml up -d web
```

Append `deploy/production/Caddyfile.snippet` to `/opt/manuflow/deploy/production/Caddyfile`. Validate with `docker exec manuflow-caddy-1 caddy validate --config /etc/caddy/Caddyfile`, then reload with `docker exec manuflow-caddy-1 caddy reload --config /etc/caddy/Caddyfile`. Check `https://koc.103.93.134.27.nip.io` after the certificate is issued.

## Updates from main

Every push to `main`, including a pull request merge, runs `.github/workflows/deploy-main.yml`. The workflow checks types, tests, and builds before opening an SSH connection. GitHub stores the dedicated private key in the repository secret `KOC_DEPLOY_SSH_KEY`. The matching public key is restricted to the root-owned `/usr/local/bin/knockoutclub-deploy` command on the VPS. That command accepts the push commit SHA, skips superseded commits, takes a deployment lock, pulls `main`, builds the images, applies migrations, recreates the web container, and checks HTTP responses. A failed verification job leaves the running application untouched. A failed migration leaves the old web container running; a failed post-deploy health check marks the workflow failed and needs investigation.

The VPS command is installed from `deploy/production/deploy-main.sh` by a server administrator and should stay owned by root. If the script changes in Git, install the reviewed version on the VPS separately. The deploy key cannot open an interactive shell or forward ports.

For manual updates, run:

```bash
cd /opt/knockoutclub
git pull --ff-only origin main
docker compose --env-file .env.production -f compose.production.yaml build migrate web
docker compose --env-file .env.production -f compose.production.yaml run --rm migrate
docker compose --env-file .env.production -f compose.production.yaml up -d --no-deps web
```

Review migrations before updating and back up the database. The deploy retains the PostgreSQL volume. Roll back the application with a known good `main` commit and rebuild; database migrations may need their own recovery plan.

## First admin

`ADMIN_EMAIL` and `ADMIN_PASSWORD` are empty until an administrator is chosen. When ready, set them in `.env.production` and run:

```bash
docker compose --env-file .env.production -f compose.production.yaml build bootstrap
docker compose --env-file .env.production -f compose.production.yaml run --rm bootstrap
```

The password must have at least 12 characters. Clear those two values from `.env.production` after the one-time bootstrap. No public demo content is seeded into production.

## Official domain

After the `A` records for `knockoutclub.id` and `www.knockoutclub.id` point to `103.93.134.27`, append `deploy/production/Caddyfile.official.snippet` to the live Caddyfile. Validate and reload Caddy, then set `SITE_URL=https://knockoutclub.id` in `.env.production` and recreate the web container. Check HTTPS, canonical metadata, `robots.txt`, and `sitemap.xml` on the official domain. The `www` hostname redirects to the apex domain. The DNS change is external to this repository.

## Checks

```bash
docker compose --env-file .env.production -f compose.production.yaml ps
curl -fsSI http://127.0.0.1:3001/
curl -fsSI https://knockoutclub.id/
```

The contact form and newsletter store submissions in PostgreSQL. Email delivery is not configured. Back up the database volume before relying on persistent submissions.
