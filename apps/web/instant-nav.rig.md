# Instant navigation rig: Jacky Dev web

- BUILD: local `EXPOSE_TESTING_API=1 pnpm build` followed by `pnpm start:instant`. The Preview CI job runs `vercel build` and deploys the result without running the browser test.
- EXPOSE: local builds use `EXPOSE_TESTING_API=1`; Vercel preview builds use `VERCEL_ENV=preview`. Production builds expose no testing API.
- RUN: `pnpm test:instant` manually; the local base URL is `http://127.0.0.1:3201`. Set `BASE_URL` to test a deployed preview manually.
- TEST USER: anonymous public visitor; no login or stored session is required. The feature tour is disabled through local storage before navigation.
- DRIFT: published Sanity posts, Sanity environment variables, the `zh-TW` locale, Vercel preview protection, and feature-tour local storage can differ between local and CI runs. The test requires at least one published post.
- LOOP: local production build → start on port 3201 → Playwright instant test → server shutdown. Preview CI only builds and deploys. Agents cannot supply missing Vercel or Sanity secrets.
- PROTECTION: To run the test manually against a protected Vercel preview, provide the project's Protection Bypass for Automation value in `VERCEL_AUTOMATION_BYPASS_SECRET`; the test establishes a browser cookie before navigation.
- WALLS: managed Windows sandboxes may deny deletion of stale `.next` files; run the production build with normal workspace permissions. Port 3201 must be free before a local run.
