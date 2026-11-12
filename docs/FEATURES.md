# Feature inventory and design system

## Phase 1

Public pages: responsive homepage, event directory/detail and fight card, fighter search/filter and profile, editorial listing/detail, media, about, contact. The site includes metadata, canonical URLs, structured data, sitemap, robots, and social links. The editor foundation supports authenticated creation and slug-based updates of events, fighters, articles, Instagram highlights, fight-card assignments, curated media, sponsors, and homepage section visibility/order. Draft/published state applies where relevant. Contact inquiries and newsletter consent are stored when PostgreSQL is configured. Demo content is visibly marked and is never written to the database.

## Planned

Phase 2: private fighter applications, review states, event eligibility/registration, matchmaking by authorized staff, approved results, ticket foundation. Phase 3: provider OAuth connections, authorized sync and insights. Rich text editing, object uploads, result approval, and newsletter delivery need expanded editor screens or operational credentials.

## UI tokens

- Canvas `#0b0b0d`, surface `#15161a`, red `#d71920`, white `#fff`, muted `#a1a1aa`.
- Display: `Arial Black` fallback for bold compressed editorial headlines; body: system sans.
- Spacing: 8px scale, maximum content width 1240px.
- Components: masthead, section heading, feature card, content card, fight row, badge, primary/ghost buttons.
- Mobile first, visible keyboard focus, semantic landmarks, adequate contrast, reduced motion support.
