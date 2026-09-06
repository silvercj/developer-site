# Developer site

Static pages for every app, hosted as Cloudflare Workers static assets in the
same way as Borderline (`wrangler.jsonc`, `public/`, `npx wrangler deploy`).
No worker code, no cookies, no analytics on the site.

## Layout

```
public/
  index.html               umbrella landing page
  style.css                shared styles
  404.html
  _headers                 security headers
  oneless/index.html       app landing page
  oneless/privacy/         privacy notice
  oneless/support/         support page
```

Add a future app as `public/<app>/…` beside `oneless/`.

## Placeholders

Every unresolved value is a literal `PLACEHOLDER_…` token. The deploy workflow
refuses to publish while any remain. Resolve, in one pass:

| Token | Meaning |
|---|---|
| `PLACEHOLDER_DOMAIN` | the umbrella domain (used in the app and store metadata, not on the site itself) |
| `PLACEHOLDER_SELLER_NAME` | exact App Store seller / operator name |
| `PLACEHOLDER_COUNTRY` | operating country |
| `PLACEHOLDER_SUPPORT_EMAIL` | public support address |
| `PLACEHOLDER_DATE` | privacy notice date |
| `PLACEHOLDER_APP_STORE_URL` | after the app record exists |
| `ANALYTICS:NONE` / `ANALYTICS:POSTHOG` | after the analytics decision, either apply the commented POSTHOG block or delete it; its placeholders block deployment until then |

## Deploying

1. Cloudflare dashboard › Workers › create a Worker named `developer-site`
   (must match `wrangler.jsonc`), or let the first `wrangler deploy` create it.
2. Add repository secrets `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit) and
   `CLOUDFLARE_ACCOUNT_ID`.
3. Push to `main`, or run `npx wrangler deploy` locally after `npx wrangler login`.
4. Workers › developer-site › Settings › Domains: add the custom domain. Cloudflare
   creates the DNS record when the zone is on Cloudflare.

## DNS and email changes required

Nothing here is applied automatically. Each needs Chris's authorisation.

| Change | Why | Notes |
|---|---|---|
| Zone on Cloudflare for `PLACEHOLDER_DOMAIN` | hosting and email routing | move nameservers at the registrar |
| Custom domain on the Worker | serve the site at the real hostname | Cloudflare adds the record |
| Email Routing: enable for the zone | receive `PLACEHOLDER_SUPPORT_EMAIL` | Cloudflare adds MX and SPF records; **do not overwrite existing MX records** if the domain already receives mail elsewhere; pick a fresh domain or subdomain in that case |
| Routing rule: `PLACEHOLDER_SUPPORT_EMAIL` → destination inbox | forward support mail | destination must be verified by Cloudflare |
| Optional: iCloud+ custom domain or Google Workspace | reply *from* the branded address | forwarding alone replies from the personal inbox |

## Verifying

- `https://PLACEHOLDER_DOMAIN/oneless/privacy/` and `/oneless/support/` return 200 over HTTPS.
- A test message to the support address arrives in the destination inbox.
- The URLs in `OneLess/Store.swift` `AppLinks` and `fastlane/metadata/*/` match these pages exactly.
