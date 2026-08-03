import canes from '../data/canes.json';
import gallery from '../data/gallery.json';
import faq from '../data/faq.json';
import homepage from '../data/homepage.json';
import woodSpecies from '../data/woodSpecies.json';
import site from '../data/site.json';
import about from '../data/about.json';
import customOrders from '../data/customOrders.json';
import heightGuide from '../data/heightGuide.json';

/** Resolve a public asset path, respecting Vite base (e.g. /CallisCanes/ on GitHub Pages). */
export function caneImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = import.meta.env.BASE_URL || '/';
  const clean = String(path).replace(/^\.\//, '').replace(/^\//, '');
  return `${base}${clean}`;
}

export function getCoverImage(cane) {
  if (!cane?.images?.length) return null;
  return caneImageUrl(cane.images[0]);
}

export function formatPrice(price) {
  if (price === null || price === undefined || price === '') return 'Inquire';
  if (typeof price === 'number') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  }
  return String(price);
}

export function getAllCanes() {
  return canes;
}

export function getFeaturedCanes() {
  return canes.filter((c) => c.featured);
}

export function getCaneBySlug(slug) {
  return canes.find((c) => c.slug === slug) || null;
}

/** Known wood names, longest first so multi-word species match before short ones. */
const WOOD_TOKENS = [
  'Eastern Red Cedar',
  'Chinese Privet',
  'Bradford Pear',
  'Black Walnut',
  'Crepe Myrtle',
  'Spalted Hickory',
  'Spalted Pecan',
  'Spalted Oak',
  'Water Oak',
  'Black Gum',
  'Rosebud',
  'Plum',
  'Pecan',
].sort((a, b) => b.length - a.length);

function woodTokens(wood = '') {
  let rest = String(wood).toLowerCase();
  const found = [];
  for (const name of WOOD_TOKENS) {
    const key = name.toLowerCase();
    if (rest.includes(key)) {
      found.push(key);
      rest = rest.split(key).join(' ');
    }
  }
  return found;
}

export function parseHeightInches(height) {
  const match = String(height || '').match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

/** Unique wood species present on non-display canes, for collection filters. */
export function getCollectionWoodOptions() {
  const present = new Set();
  for (const cane of canes) {
    if (cane.status === 'Display') continue;
    for (const token of woodTokens(cane.wood)) {
      present.add(token);
    }
  }
  return WOOD_TOKENS
    .filter((name) => present.has(name.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

export function caneMatchesWood(cane, woodName) {
  if (!woodName) return true;
  return woodTokens(cane.wood).includes(String(woodName).toLowerCase());
}

/**
 * Suggest canes with overlapping wood species and/or similar height.
 * Excludes the current cane and Display-only pieces. Falls back to other
 * Available canes when there are not enough strong matches.
 */
export function getSuggestedCanes(cane, limit = 4) {
  if (!cane) return [];

  const tokens = new Set(woodTokens(cane.wood));
  const height = parseHeightInches(cane.height);

  const scored = canes
    .filter((c) => c.id !== cane.id && c.status !== 'Display')
    .map((c) => {
      const sharedWood = woodTokens(c.wood).filter((t) => tokens.has(t)).length;
      const otherHeight = parseHeightInches(c.height);
      let heightScore = 0;
      if (height != null && otherHeight != null) {
        const delta = Math.abs(height - otherHeight);
        if (delta <= 0.5) heightScore = 3;
        else if (delta <= 1) heightScore = 2;
        else if (delta <= 2) heightScore = 1;
      }
      const availableBoost = c.status === 'Sold' ? 0 : 1;
      return {
        cane: c,
        score: sharedWood * 4 + heightScore + availableBoost,
        matched: sharedWood > 0 || heightScore > 0,
      };
    })
    .sort((a, b) => b.score - a.score);

  const matched = scored.filter((s) => s.matched).map((s) => s.cane);
  if (matched.length >= limit) return matched.slice(0, limit);

  const used = new Set(matched.map((c) => c.id));
  const fillers = scored
    .filter((s) => !used.has(s.cane.id) && s.cane.status !== 'Sold')
    .map((s) => s.cane);

  return [...matched, ...fillers].slice(0, limit);
}

export function getGallery() {
  return gallery;
}

function galleryCategoriesFor(item) {
  if (Array.isArray(item.categories) && item.categories.length) {
    return item.categories.filter(Boolean);
  }
  return item.category ? [item.category] : [];
}

export function getGalleryCategories() {
  return [...new Set(gallery.flatMap(galleryCategoriesFor))];
}

export { galleryCategoriesFor };

export function getFaqs() {
  return faq;
}

export function getHomepage() {
  return homepage;
}

export function getWoodSpecies() {
  return woodSpecies;
}

export function getSite() {
  return site;
}

export function getAbout() {
  return about;
}

export function getCustomOrders() {
  return customOrders;
}

export function getHeightGuide() {
  return heightGuide;
}
