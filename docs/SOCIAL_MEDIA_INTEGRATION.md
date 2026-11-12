# Social media integration

Phase 1 uses the official Instagram profile link and admin-curated post/Reel URLs. `src/lib/social.ts` accepts only HTTPS Instagram post/Reel URLs and provides an embed URL. The UI always offers a link fallback. Embedding depends on Instagram availability and visitor browser settings. No scraping or unofficial API is used.

Phase 2/3 connector contract: `getProfile`, `getMedia`, `validateConnection`, optional `getInsights`, optional `publishContent`. Each provider adapter declares capabilities, so Instagram, TikTok, YouTube, and Facebook can differ. Store access tokens encrypted outside public tables; track expiry, refresh state, and consent. Use only official APIs after account credentials, app review, and permissions are obtained. Consult current [Meta documentation](https://developers.facebook.com/docs/instagram-platform/) at implementation time.

Social sharing uses native share where available and URL fallback. Open Graph metadata is defined per public detail page. Never infer that a curated URL grants media reuse rights; link or use permitted embeds.
