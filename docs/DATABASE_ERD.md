# Database ERD

The executable model is `prisma/schema.prisma`. `id` is the stable primary key, slugs are unique for public URLs, relationships use foreign keys, and lifecycle tables have timestamps. Fighter records derive from approved `FightResult` rows; imported records require source attribution and an explicit verified flag.

```mermaid
erDiagram
  User ||--o{ AuditLog : creates
  Gym ||--o{ Fighter : trains
  Event ||--o{ Fight : contains
  Event ||--o{ EventRegistration : receives
  Fighter ||--o{ EventRegistration : submits
  Fighter ||--o{ Fight : red_corner
  Fighter ||--o{ Fight : blue_corner
  Fight ||--o| FightResult : resolves
  Fighter ||--o{ FighterSocialLink : has
  ArticleCategory ||--o{ Article : classifies
  Article }o--o{ Fighter : mentions
  Article }o--o{ Event : covers
  MediaAsset }o--o{ Event : depicts
  MediaAsset }o--o{ Fighter : depicts
  Sponsor ||--o{ EventSponsor : supports
  Event ||--o{ EventSponsor : has
  SocialMediaAccount ||--o{ SocialMediaPost : publishes
  SocialMediaIntegration ||--o{ SocialMediaAccount : connects
```

Private application records are separated from `Fighter`; approval never automatically publishes registration fields. The schema includes indexes on status/date and foreign keys. Audit data records editor actions but must never store passwords or tokens.
