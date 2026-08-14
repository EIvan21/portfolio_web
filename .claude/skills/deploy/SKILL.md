---
name: deploy
description: Build and deploy the portfolio to Hostinger (edherivan.com). Use when the user wants to publish/deploy the site, push changes live, or update production.
---

# Deploy the portfolio to Hostinger

Deploys the Create React App static build to `edherivan.com` (Hostinger shared
hosting) using the Hostinger MCP. Follow these steps in order.

## Preconditions

- **Always verify locally first.** Before building/deploying, make sure the user
  has reviewed the change at `http://localhost:3000` (start `npm start` if it is
  not running) and has confirmed it looks right. Do not deploy an unreviewed
  change — ask for confirmation first.
- The Hostinger MCP (`hostinger-hosting`) must be connected. If its tools are not
  available, tell the user to run:
  `claude mcp add hostinger-hosting --scope user --env HOSTINGER_API_TOKEN=<token> -- npx.cmd --package=hostinger-api-mcp@latest hostinger-hosting-mcp`
  (token from hPanel → API), then restart Claude Code.

## Steps

1. **Build.** Run `npm run build`. Note the `main.<hash>.js` filename printed in
   the output — you will verify it later.

2. **Package as tar.gz** (NOT zip — zip fails with a 500):
   ```bash
   cd build && tar -czf ../portfolio-build.tar.gz * && cd ..
   ```

3. **Deploy** with the Hostinger MCP:
   `hosting_deployStaticWebsite(domain="edherivan.com", archivePath="<abs path>/portfolio-build.tar.gz", removeArchive=false)`
   Expect `deploy.status = "success"`. If it returns a 500, confirm the archive
   is `.tar.gz`, not `.zip`.

4. **Clear cache:**
   `hosting_clearWebsiteCacheV1(domain="edherivan.com", username="u487664195")`

5. **Verify.** List `static/js`:
   `hosting_listWebsiteFilesAndDirectoriesV1(domain="edherivan.com", username="u487664195", directory="static/js")`
   Confirm the live `main.<hash>.js` matches the hash from step 1. Report the
   result to the user and remind them to hard-refresh (Ctrl+F5) or use incognito.

6. **Stop the local dev server.** Once development and deploy are done, shut down
   the running `npm start` dev server (free port 3000) — don't leave it running.

## Reference

- Hosting username: `u487664195`
- Root: `/home/u487664195/domains/edherivan.com/public_html`
- Contact form (EmailJS) IDs live in `src/components/Contact.jsx`.
