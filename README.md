# Knockout Club

Phase 1 foundation for an Indonesian boxing promotion and editorial platform. Public demo content is labeled and is never presented as an official event, real fighter, or verified result.

## Requirements

- Node.js 20.9+ and npm
- PostgreSQL 16 for persistent content/admin

## Run the public demo

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Without `DATABASE_URL`, the site displays labeled demo content. The admin and contact submission need PostgreSQL.

## Run with PostgreSQL

```bash
cp .env.example .env.local
# Edit DATABASE_URL, SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Alternatively start PostgreSQL with `docker compose up -d db`. The seed command creates only the first admin; it inserts no public demo records. Visit `/admin/login` to sign in. Create an event, fighter, or article as Draft, review it, then save the same slug as Published. The editor also handles fight-card assignments, homepage hero and section order, curated media links, sponsors, and Instagram highlights. Results approval, rich text editing, object uploads, and fuller edit screens remain on the implementation plan.

## Check and build

```bash
npm run typecheck
npm run build
```

## Deploy

For the VPS that hosts Manuflow, follow [the production deployment guide](docs/DEPLOYMENT.md). The app uses its own PostgreSQL container and port 3001 behind the existing HTTPS proxy. Production secrets belong in `.env.production` on the VPS, not Git.

The contact form stores inquiries in PostgreSQL; email notifications are not configured. Instagram highlights use curated URLs and permitted embeds; no Meta API access is claimed. Newsletter addresses are stored with consent when the database is configured; email delivery, object storage, and ticketing are not active.

## Docs

- [Overview](docs/PROJECT_OVERVIEW.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Sitemap](docs/SITEMAP.md)
- [Database ERD](docs/DATABASE_ERD.md)
- [Features](docs/FEATURES.md)
- [Social integration](docs/SOCIAL_MEDIA_INTEGRATION.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
