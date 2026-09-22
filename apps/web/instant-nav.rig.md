# Instant navigation rig: Jacky Dev web

- BUILD: local `EXPOSE_TESTING_API=1 pnpm build` followed by `pnpm start:instant`; CI uses the Vercel preview artifact built by `vercel build`.
- EXPOSE: local builds use `EXPOSE_TESTING_API=1`; Vercel preview builds use `VERCEL_ENV=preview`. Production builds expose no testing API.
- RUN: `pnpm test:instant`; local base URL is `http://127.0.0.1:3201`, while CI supplies the deployed preview URL through `BASE_URL`.
- TEST USER: anonymous public visitor; no login or stored session is required. The feature tour is disabled through local storage before navigation.
- DRIFT: published Sanity posts, Sanity environment variables, the `zh-TW` locale, Vercel preview protection, and feature-tour local storage can differ between local and CI runs. The test requires at least one published post.
- LOOP: local production build → start on port 3201 → Playwright instant test → server shutdown. CI deploys the preview artifact, verifies its commit SHA, then runs the same test. Agents cannot supply missing Vercel or Sanity secrets.
- LIVENESS: `/api/healthz` reports `NEXT_PUBLIC_DEPLOYMENT_SHA`; CI compares it with `GITHUB_SHA` before testing. A fresh local build needs no SHA probe.
- WALLS: managed Windows sandboxes may deny deletion of stale `.next` files; run the production build with normal workspace permissions. Port 3201 must be free before a local run.
