# CallisCanes

Handcrafted walking canes — static **React + Vite** site.

**Live:** [calliscanes.com](https://calliscanes.com/)

Content is **JSON-driven**. Catalog, gallery, FAQ, homepage copy, and site settings live under `src/data/` — you usually don’t need to edit React components to change content.

## Quick start

```bash
npm install
cp .env.example .env   # add Formspree form URLs
npm run dev            # http://127.0.0.1:5173/
```

## Forms (Formspree)

Set these in `.env` (local) and `.env.production` (Pages build):

| Variable | Used for |
|----------|----------|
| `VITE_FORMSPREE_CONTACT` | Contact page |
| `VITE_FORMSPREE_CUSTOM_ORDER` | Custom order request |
| `VITE_FORMSPREE_PURCHASE` | Purchase / inquire on a cane |
| `VITE_FORMSPREE_TECH_ISSUES` | “Report a tech issue” modal |

## Content files

| File | Purpose |
|------|---------|
| `src/data/canes.json` | Collection / product catalog |
| `src/data/gallery.json` | Gallery media |
| `src/data/homepage.json` | Home sections |
| `src/data/about.json` | About page |
| `src/data/faq.json` | FAQ |
| `src/data/customOrders.json` | Custom orders page copy |
| `src/data/site.json` | Nav, email, social links, CTA |
| `src/data/woodSpecies.json` | Wood options for forms |

Social links (e.g. Facebook) are in `site.json` → `social`.

## Deploy (GitHub Pages)

Production build is committed in **`docs/`**. Pages settings:

1. **Settings → Pages → Build and deployment**
2. Source: **Deploy from a branch**
3. Branch: **`main`** / folder **`/docs`** (not `/(root)`)
4. Custom domain: **`calliscanes.com`** (repo includes `public/CNAME` / `docs/CNAME`)

After content or code changes:

```bash
npm run build:pages
git add docs src public
git commit -m "Update site"
git push
```

### Custom domain notes

- Production uses `VITE_BASE=/` in `.env.production` (required for `calliscanes.com`).
- Use `/CallisCanes/` only if hosting at `https://USER.github.io/CallisCanes/` without a custom domain.
- For **Enforce HTTPS** on GitHub Pages, DNS must resolve to GitHub (A/AAAA + `www` CNAME). Cloudflare proxy should be **DNS only** (grey cloud), not orange-cloud proxied.

## Add a cane

1. Drop photos into `ccimg/Canes/<name>/` and/or `ccimg/featured/<name>/` (HEIC ok).
2. Convert and register:
   ```bash
   npm run setup-img
   npm run import-canes -- ./ccimg --replace
   ```
3. Tweak `src/data/canes.json` as needed:
   - `status`: `Available` | `Reserved` | `Sold` | `Display`
   - `quantity`: `1` for a one-of-a-kind sale piece, `0` for display
   - `price`: number (e.g. `150`) or blank for “Inquire”
   - `featured`: `true` for homepage
4. Rebuild Pages and push (`public/images/canes/` + `canes.json` + `docs/`).

### Inquiry vs display

| Goal | `status` | `quantity` | `featured` | Shoppers see |
|------|----------|------------|------------|--------------|
| For sale | `Available` | `1` | optional | Price + inquire |
| Showpiece only | `Display` | `0` | usually `true` | Not for sale + custom CTA |
| Sold out | `Sold` | `0` | false | Sold badge |

## Stack

- React 18, Vite 6, React Router, Framer Motion
- Forms via Formspree
- Deployed from `main` → `/docs` on GitHub Pages
