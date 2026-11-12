# Architecture

## Decision

A Next.js App Router modular monolith serves the public pages and protected editor. TypeScript modules in `src/lib` own content access, validation, auth, and social URL rules. PostgreSQL is modeled with Prisma. Server components read published records; forms submit to server actions. Demo content is used only when `DATABASE_URL` is absent, and is labeled on screen. A production deployment must configure a database and bootstrap an admin.

## CMS choice

Payload was evaluated first. Its [current installation requirements](https://payloadcms.com/docs/getting-started/installation) require Node `^22.23.4 || >=24.22.1`, while this workspace has Node 20.20.2. Payload's Postgres adapter also uses its own schema/migration layer, whereas the brief requests Prisma. The Phase 1 editor therefore uses a small Prisma-backed content form and protected session. Evaluate moving editorial collections to Payload on a Node 22+ runtime if its managed editor features outweigh maintaining two persistence models. Do not run Payload and Prisma migrations against the same tables.

## Module boundaries

- `src/app/(public)` public rendering and SEO.
- `src/app/admin`, `src/app/actions.ts` protected editor and mutations.
- `src/lib/content.ts` published data gateway and explicit demo fallback.
- `src/lib/auth.ts` signed sessions and role checks.
- `src/lib/social.ts` curated URL validation and provider contracts.
- `prisma/schema.prisma` relational source of truth, including Phase 2 relationships.

## Deployment

A Node server and PostgreSQL on a Linux VPS; terminate TLS at a reverse proxy. Run migrations before starting. Put secrets in environment variables. Serve uploaded media from a configured S3-compatible bucket in a later iteration; Phase 1 accepts externally hosted, allowlisted media URLs and local project assets. Keep a backup of database and object storage. `Dockerfile` and `compose.yaml` are local/deployment starting points.

## Security

Admin actions check a signed HTTP-only session and role. Inputs are validated. Public queries return only published content. Registration PII belongs in separate private tables and is not projected into public fighter queries. No live social token is required for curated embeds. Add deployment edge rate limiting and CAPTCHA before enabling public write forms at scale.
