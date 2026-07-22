# CallisCanes

Static React + Vite site for a handcrafted walking cane business.

**Content is JSON-driven** — adding a cane never requires editing React components.

## Quick start

```bash
npm install
cp .env.example .env   # add Formspree IDs
npm run dev
```

## GitHub Pages (important)

Keep **Branch = `main`**, but set the folder to **`/docs`** (not `/(root)`).

In **Settings → Pages → Build and deployment**:

1. Source: **Deploy from a branch**
2. Branch: **`main`** / **`/docs`**
3. Save, wait 1–2 minutes, hard-refresh

Custom domain **calliscanes.com**: production uses `VITE_BASE=/` (see `.env.production`). DNS must point at GitHub Pages (not Cloudflare orange-cloud proxy) for Enforce HTTPS.

The `docs/` folder is the production build. Redeploy after content changes:

```bash
npm run build:pages
git add docs && git commit -m "Update Pages build" && git push
```

Alternatively use **`gh-pages`** branch or **GitHub Actions** (see `.github/workflows/deploy-pages.yml`).

## Add a cane

1. Drop photos into `incoming/<Cane Name>/` (or use `ccimg/Canes/<name>/` + `ccimg/featured/<name>/`)
2. Convert HEIC → WebP and update JSON:
   ```bash
   python3 -m venv .venv-img && .venv-img/bin/pip install pillow pillow-heif
   npm run import-canes -- ./ccimg --replace
   ```
3. Edit `src/data/canes.json`:
   - `status`: `Available` | `Reserved` | `Sold` | `Display` (showpiece, not for sale)
   - `quantity`: `1` for one-of-a-kind available pieces, `0` for display
   - `price`: number or leave blank for “Inquire”
   - `featured`: `true` to show on the homepage
4. Commit & push (`public/images/canes/` WebPs + `canes.json`)

### Inquiry vs display

| Goal | `status` | `quantity` | `featured` | What shoppers see |
|------|----------|------------|------------|-------------------|
| One cane for sale (3–4 photos) | `Available` | `1` | optional | “1 available” + inquire form |
| Tribute / show only | `Display` | `0` | `true` | “Not for sale” + custom tribute CTA |
| Sold out | `Sold` | `0` | false | Sold badge, no form |
