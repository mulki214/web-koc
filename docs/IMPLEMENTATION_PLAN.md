# Implementation plan

1. **Phase 1 foundation:** Next.js, TypeScript, responsive design, public pages, content gateway, Prisma schema, labeled demo content, SEO, protected editor including homepage ordering, fight-card assignment, media and sponsors, curated Instagram URLs, local Docker setup. Validate typecheck, build, and key content logic.
2. **Phase 1 hardening before production:** provision PostgreSQL, run migrations, bootstrap editor, configure email, object storage, edge rate limit/CAPTCHA, editorial review, and real approved content. Replace demo fallback by setting `DATABASE_URL`.
3. **Phase 2 operations:** private applications and documents, approval workflow, event registration, staff match assignment, approved results and record calculation, ticket foundation. Add API and end-to-end tests for these workflows.
4. **Phase 3 growth:** official provider OAuth/API connectors and synchronization, analytics, publishing where allowed, reporting.

## Credentials and decisions

Required for production: `DATABASE_URL`, `SESSION_SECRET`, initial admin credentials (bootstrap only), domain/DNS and TLS. Needed for later features: S3 endpoint/bucket/key, transactional email, anti-spam provider, analytics ID, Meta app credentials/permissions, newsletter provider, ticket/payment processor. None is required to view the local demo.

## Release gate

Review all public claims, imagery, privacy text, accessibility, security, backups, and forms before launch. Test integrations against the real configured service; an unconfigured module is a foundation, not a working integration.
