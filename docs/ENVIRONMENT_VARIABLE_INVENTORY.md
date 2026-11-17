# DigiPrintPlus environment inventory

This inventory records purpose and ownership only. Secret values belong in
Netlify and must never be copied into this repository.

## Netlify: DigiPrintPlus Website

| Variable | Purpose | Classification |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public Sanity project identifier | Public configuration |
| `NEXT_PUBLIC_SANITY_DATASET` | Public content dataset name | Public configuration |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Pinned Sanity API contract | Public configuration |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Canonical admin Studio link | Public configuration |
| `NEXT_PUBLIC_SITE_URL` | Canonical public website URL | Public configuration |
| `SANITY_API_TOKEN` | Creates quote requests in Sanity | Server-only secret; Contributor token |
| `SANITY_PRIVATE_DATASET` | Routes quote requests to the private development dataset | Server configuration |
| `SANITY_WEBHOOK_SECRET` | Verifies signed Sanity webhook requests | Server-only secret |
| `SANITY_REVALIDATE_SECRET` | Protects on-demand cache revalidation | Server-only secret |
| `NETLIFY_BUILD_HOOK_URL` | Starts a production rebuild after content changes | Server-only secret |
| `RESEND_API_KEY` | Sends quote notification email | Server-only secret |
| `QUOTE_NOTIFY_FROM` | Verified sender for quote notifications | Server configuration |
| `QUOTE_NOTIFY_TO` | Internal recipient for quote notifications | Server configuration |
| `NODE_VERSION` | Pins the Netlify Node runtime | Build configuration |
| `PNPM_VERSION` | Pins the workspace package manager | Build configuration |
| `NETLIFY_USE_PNPM` | Selects pnpm during Netlify install | Build configuration |

Optional analytics variables such as `NEXT_PUBLIC_GA4_ID` and
`NEXT_PUBLIC_GTM_ID` are public identifiers, not credentials.

## Netlify: DigiPrintPlus Admin Studio

| Variable | Purpose | Classification |
| --- | --- | --- |
| `SANITY_STUDIO_PROJECT_ID` | Public Sanity project identifier | Public configuration |
| `SANITY_STUDIO_DATASET` | Dataset edited by the production Studio | Public configuration |
| `SANITY_STUDIO_PRODUCTION_URL` | Public website used by editor preview links | Public configuration |
| `NODE_VERSION` | Pins the Netlify Node runtime | Build configuration |
| `PNPM_VERSION` | Pins the workspace package manager | Build configuration |

The Studio must not contain API tokens, webhook secrets, email credentials, or
any value presented as a `SANITY_STUDIO_*` secret. Studio variables are compiled
into browser JavaScript and are therefore public.

## Sanity API tokens

| Token label | Role | Purpose |
| --- | --- | --- |
| `Sanity AI` | Editor | Enables the Sanity AI feature requested by the owner |
| `DigiPrintPlus Netlify Website` | Contributor | Server-side quote creation from the Netlify website |

No general-purpose admin, editor, migration, product, or unnamed legacy token
is retained. Create short-lived task-specific tokens only when a future import
or migration requires one, then revoke them after verification.

## Named integration

The sole Netlify build hook is named `DigiPrintPlus Sanity to Website Rebuild`.
The sole Sanity content webhook is named `Netlify signed rebuild`.
