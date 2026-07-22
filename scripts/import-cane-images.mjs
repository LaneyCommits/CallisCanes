#!/usr/bin/env node
/**
 * Import cane photo folders into the static site (HEIC → WebP).
 *
 * Usage:
 *   npm run import-canes -- ./ccimg --replace
 *   npm run import-canes -- ./incoming
 *
 * Layout:
 *   drop/featured/<name>/…  → featured showpiece (status: Display, not for sale)
 *   drop/Canes/<name>/…     → Available (quantity 1, inquiry to purchase)
 *   drop/<name>/…           → Available
 *
 * --replace  Rebuild canes.json from these folders only
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CANES_JSON = path.join(ROOT, 'src/data/canes.json');
const OUT_ROOT = path.join(ROOT, 'public/images/canes');
const PYTHON = path.join(ROOT, '.venv-img/bin/python');
const CONVERT = path.join(ROOT, 'scripts/heic_to_webp.py');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif', '.tif', '.tiff']);

const cliArgs = process.argv.slice(2);
const REPLACE = cliArgs.includes('--replace');
const dropArg = cliArgs.find((a) => !a.startsWith('--'));
const dropDir = path.resolve(ROOT, dropArg || 'incoming');

const SLUG_MAP = {
  masonictributecane: 'masonic-tribute-cane',
  senoreleganteblackwalnut: 'senor-elegante',
  blackycmcane: 'blacky-cm-cane',
  bonesblackwalnut: 'bones',
  bptungoil: 'bp-tung-oil',
  bradleyoaksbradfordpearhandlespaltedoakshaft: 'bradley-oaks',
  cratemertshilallegh: 'crate-mert-shillelagh',
  macetheblackwalnut: 'mace',
  namelessblackwalnut: 'nameless',
  'onepieceplum-shillelagh': 'one-piece-plum-shillelagh',
  pecanscales: 'pecan-scales',
  squidwardblackwalnut: 'squidward',
  swaggerstick: 'swagger-stick',
  thumpercmshilellegh: 'thumper',
  twistythepimpstick: 'twisty',
};

const NAME_OVERRIDES = {
  'masonic-tribute-cane': 'Masonic Tribute Cane',
  'senor-elegante': 'Señor Elegante',
  bison: 'Bison',
  'blacky-cm-cane': 'Blacky CM Cane',
  bones: 'Bones',
  bonker: 'Bonker',
  'bp-tung-oil': 'BP Tung Oil',
  'bradley-oaks': 'Bradley Oaks',
  'crate-mert-shillelagh': 'Crate Mert Shillelagh',
  mace: 'Mace',
  nameless: 'Nameless',
  'one-piece-plum-shillelagh': 'One-Piece Plum Shillelagh',
  'pecan-scales': 'Pecan Scales',
  pelican: 'Pelican',
  squidward: 'Squidward',
  'swagger-stick': 'Swagger Stick',
  thumper: 'Thumper',
  twisty: 'Twisty',
};

const WOOD_GUESSES = {
  'senor-elegante': 'Black Walnut',
  bones: 'Black Walnut',
  'bradley-oaks': 'Spalted Oak / Bradford Pear',
  mace: 'Black Walnut',
  nameless: 'Black Walnut',
  'one-piece-plum-shillelagh': 'Plum',
  'pecan-scales': 'Pecan',
  squidward: 'Black Walnut',
};

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'cane';
}

function resolveSlug(folderName) {
  const raw = slugify(folderName);
  return SLUG_MAP[raw] || raw;
}

function titleFromSlug(slug) {
  if (NAME_OVERRIDES[slug]) return NAME_OVERRIDES[slug];
  return slug.split('-').filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function listImages(dir) {
  return fs.readdirSync(dir)
    .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .map((f) => path.join(dir, f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
}

function targetNames(count) {
  const preferred = ['cover.webp', 'side.webp', 'handle.webp'];
  return Array.from({ length: count }, (_, i) => (
    i < preferred.length ? preferred[i] : `detail-${i - preferred.length + 1}.webp`
  ));
}

function ensurePython() {
  if (!fs.existsSync(PYTHON)) {
    console.error('Missing .venv-img. Run:');
    console.error('  python3 -m venv .venv-img && .venv-img/bin/pip install pillow pillow-heif');
    process.exit(1);
  }
}

function convertToWebp(src, dest) {
  const result = spawnSync(PYTHON, [CONVERT, src, dest, '1600'], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `Failed converting ${src}`).trim());
  }
}

function discoverFolders(root) {
  const found = [];
  const seenDirs = new Set();

  const add = (folderPath, opts = {}) => {
    const resolved = fs.realpathSync(folderPath);
    if (seenDirs.has(resolved)) return;
    seenDirs.add(resolved);
    const images = listImages(folderPath);
    if (!images.length) return;
    found.push({
      folderPath,
      folderName: path.basename(folderPath),
      images,
      featured: Boolean(opts.featured),
      display: Boolean(opts.display),
    });
  };

  const scannedParents = new Set();
  for (const [subdir, opts] of [
    ['featured', { featured: true, display: true }],
    ['Canes', {}],
    ['canes', {}],
  ]) {
    const dir = path.join(root, subdir);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) continue;
    const resolvedParent = fs.realpathSync(dir);
    if (scannedParents.has(resolvedParent)) continue;
    scannedParents.add(resolvedParent);
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.isDirectory()) add(path.join(dir, ent.name), opts);
    }
  }

  for (const ent of fs.readdirSync(root, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    if (['featured', 'Canes', 'canes'].includes(ent.name)) continue;
    add(path.join(root, ent.name));
  }

  return found;
}

function importFolder(folder, id) {
  const slug = resolveSlug(folder.folderName);
  const outDir = path.join(OUT_ROOT, slug);
  fs.mkdirSync(outDir, { recursive: true });
  const names = targetNames(folder.images.length);
  const written = [];

  console.log(`\n${folder.featured ? '★' : '•'} ${slug} (${folder.images.length} photos)`);
  for (let i = 0; i < folder.images.length; i += 1) {
    const dest = path.join(outDir, names[i]);
    convertToWebp(folder.images[i], dest);
    written.push(`/images/canes/${slug}/${names[i]}`);
    console.log(`   → ${names[i]}`);
  }

  return {
    id,
    slug,
    name: titleFromSlug(slug),
    wood: WOOD_GUESSES[slug] || '',
    price: '',
    status: folder.display ? 'Display' : 'Available',
    height: '',
    finish: '',
    description: folder.display
      ? 'Featured showpiece — on display, not for sale. Inquire about a custom tribute piece inspired by this cane.'
      : '',
    featured: Boolean(folder.featured || folder.display),
    quantity: folder.display ? 0 : 1,
    images: written,
  };
}

function main() {
  ensurePython();

  if (!fs.existsSync(dropDir)) {
    console.error(`Drop folder not found: ${dropDir}`);
    process.exit(1);
  }

  const folders = discoverFolders(dropDir);
  if (!folders.length) {
    console.log(`No cane folders with images found in ${dropDir}`);
    process.exit(0);
  }

  // Deduplicate by resolved slug (last wins for metadata flags)
  const unique = new Map();
  for (const folder of folders) {
    const slug = resolveSlug(folder.folderName);
    const prev = unique.get(slug);
    unique.set(slug, prev ? { ...folder, featured: prev.featured || folder.featured, display: prev.display || folder.display } : folder);
  }
  const list = [...unique.values()];
  console.log(`Found ${list.length} cane folders in ${dropDir}`);

  const existing = REPLACE ? [] : JSON.parse(fs.readFileSync(CANES_JSON, 'utf8'));
  const bySlug = new Map(existing.map((c) => [c.slug, c]));
  let nextId = existing.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1;

  for (const folder of list) {
    const slug = resolveSlug(folder.folderName);
    const imported = importFolder(folder, bySlug.has(slug) ? bySlug.get(slug).id : nextId);

    if (bySlug.has(slug) && !REPLACE) {
      const cur = bySlug.get(slug);
      cur.images = imported.images;
      cur.name = cur.name || imported.name;
      cur.wood = cur.wood || imported.wood;
      if (folder.display) {
        cur.status = 'Display';
        cur.featured = true;
        cur.quantity = 0;
        if (!cur.description) cur.description = imported.description;
      } else if (cur.quantity === undefined || cur.quantity === null) {
        cur.quantity = 1;
      }
      console.log(`   (updated existing entry id ${cur.id})`);
    } else {
      bySlug.set(slug, imported);
      if (!REPLACE) nextId += 1;
    }
  }

  const canes = REPLACE
    ? list.map((folder, i) => ({ ...bySlug.get(resolveSlug(folder.folderName)), id: i + 1 }))
    : [...bySlug.values()].sort((a, b) => a.id - b.id);

  fs.writeFileSync(CANES_JSON, `${JSON.stringify(canes, null, 2)}\n`);
  console.log(`\nWrote ${CANES_JSON} — ${canes.length} canes`);
}

main();
