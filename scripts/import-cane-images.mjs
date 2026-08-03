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
  masonictributecane: "masonic-tribute-cane",
  senoreleganteblackwalnut: "senor-elegante",
  blackycmcane: "blacky-cm-cane",
  bonesblackwalnut: "bones",
  bptungoil: "bp-tung-oil",
  bradleyoaksbradfordpearhandlespaltedoakshaft: "bradley-oaks",
  cratemertshilallegh: "crate-mert-shillelagh",
  macetheblackwalnut: "mace",
  namelessblackwalnut: "root-detector",
  "onepieceplum-shillelagh": "one-piece-plum-shillelagh",
  pecanscales: "pecan-scales",
  squidwardblackwalnut: "squidward",
  swaggerstick: "swagger-stick",
  thumpercmshilellegh: "thumper",
  twistythepimpstick: "twisty",
  "the-statesman": "senor-elegante",
  "walking-tall": "bison",
  "midnight-train": "blacky-cm-cane",
  "old-boney": "bones",
  persuader: "bonker",
  "magnolia-walker": "bp-tung-oil",
  "grove-governor": "bradley-oaks",
  "kudzu-crutch": "crate-mert-shillelagh",
  "cajun-cudgel": "mace",
  "plum-plunker": "one-piece-plum-shillelagh",
  "pecan-plodder": "pecan-scales",
  "bayou-breeze": "pelican",
  "cool-hand-luke": "squidward",
  "the-colonel": "swagger-stick",
  "bubba-stick": "thumper",
  "red-dirt-rambler": "twisty",
  "root-detector": "root-detector",
  "cypress-shadow": "raven",
  "big-john-19": "alligator-alley-19",
  "rufus-18": "zydeco-strider-18",
};

const NAME_OVERRIDES = {
  "masonic-tribute-cane": "Masonic Tribute Cane",
  "senor-elegante": "The Statesman",
  bison: "Walking Tall",
  "blacky-cm-cane": "Midnight Train",
  bones: "Old Boney",
  bonker: "Persuader",
  "bp-tung-oil": "Magnolia Walker",
  "bradley-oaks": "Grove Governor",
  "crate-mert-shillelagh": "Kudzu Crutch",
  mace: "Cajun Cudgel",
  "one-piece-plum-shillelagh": "Plum Plunker",
  "pecan-scales": "Pecan Plodder",
  pelican: "Bayou Breeze",
  squidward: "Cool Hand Luke",
  "swagger-stick": "The Colonel",
  thumper: "Bubba Stick",
  twisty: "Red Dirt Rambler",
  "root-detector": "Root Detector",
  raven: "Cypress Shadow",
  "beau-01": "Beau",
  "hank-02": "Hank",
  "cottonwood-03": "Cottonwood",
  "pine-knot-04": "Pine Knot",
  "bourbon-reserve-05": "Bourbon Reserve",
  "white-lightning-06": "White Lightning",
  "sweet-tea-07": "Sweet Tea",
  "delta-bramble-08": "Delta Bramble",
  "front-porch-09": "Front Porch",
  "good-ol-boy-10": "Good Ol' Boy",
  "kudzu-crawler-11": "Kudzu Crawler",
  "mosquito-swatter-12": "Mosquito Swatter",
  "mud-bogger-13": "Mud Bogger",
  "hog-heaven-14": "Hog Heaven",
  "gator-tamer-15": "Gator Tamer",
  "swamp-stomper-16": "Swamp Stomper",
  "bayou-bruiser-17": "Bayou Bruiser",
  "zydeco-strider-18": "Rufus",
  "alligator-alley-19": "Big John",
  "smokey-20": "Smokey",
  "bandit-21": "Bandit",
  "snake-inspector-22": "Snake Inspector",
  "boss-man-23": "Boss Man",
  "foghorn-24": "Foghorn",
  "jed-clampett-25": "Jed Clampett",
  "rusty-but-trusty-26": "Rusty but Trusty",
  "porch-patrol-27": "Porch Patrol",
};

const WOOD_GUESSES = {
  "senor-elegante": "Black Walnut",
  bones: "Black Walnut",
  "bradley-oaks": "Spalted Oak / Bradford Pear",
  mace: "Black Walnut",
  "one-piece-plum-shillelagh": "Plum",
  "pecan-scales": "Pecan",
  squidward: "Black Walnut",
  "cottonwood-03": "Water Oak / Eastern Red Cedar",
  "root-detector": "Black Walnut",
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

  const skipRoot = new Set([
    'featured', 'Canes', 'canes',
    'about', 'About', 'gallery', 'logo',
  ]);
  for (const ent of fs.readdirSync(root, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    if (skipRoot.has(ent.name)) continue;
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
