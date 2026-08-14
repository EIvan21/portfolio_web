# Portfolio — edherivan.com

Personal single-page portfolio (Create React App, React 18). Deployed as static
files to Hostinger shared hosting. Domain: **edherivan.com**.

## Run locally

```bash
npm install      # first time only
npm start        # http://localhost:3000, hot reload
```

## Structure

- `src/components/` — sections: Navbar, Hero, Skills, Experience, Education, Projects, Contact
- `src/hooks/useScrollReveal.js` — scroll-reveal animation hook
- `src/styles/variables.css` — CSS custom properties (theme, dark mode)
- Contact form uses **EmailJS** (client-side). IDs are hardcoded in
  `src/components/Contact.jsx` (SERVICE / TEMPLATE / PUBLIC KEY). These are
  meant to be public; real protection is the Allowed Origins allowlist in the
  EmailJS dashboard (should include `edherivan.com`).

## Deploy

Use the **`/deploy`** skill, or follow these steps manually:

1. `npm run build`
2. Package the **contents** of `build/` as tar.gz:
   `cd build && tar -czf ../portfolio-build.tar.gz *`
3. Deploy via the Hostinger MCP:
   `hosting_deployStaticWebsite(domain="edherivan.com", archivePath="…/portfolio-build.tar.gz")`
4. Clear cache: `hosting_clearWebsiteCacheV1(domain="edherivan.com", username="u487664195")`
5. Verify: list `static/js` on the site and confirm the new `main.<hash>.js`
   matches the hash printed by the build.

### Gotchas

- **Deploy fails with a 500 on `.zip` archives** (upload succeeds, extraction
  500s). Always use **`.tar.gz`**.
- Hostinger MCP must be configured: `claude mcp add hostinger-hosting --scope user`
  with a `HOSTINGER_API_TOKEN` from hPanel → API. Token = full account access;
  keep it in user scope, never commit it.
- Hosting username: `u487664195`. Root: `/home/u487664195/domains/edherivan.com/public_html`.
- No `.htaccess` needed — single page, hash anchors, no client-side router.
