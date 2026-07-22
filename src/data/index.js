import canes from '../data/canes.json';
import gallery from '../data/gallery.json';
import faq from '../data/faq.json';
import homepage from '../data/homepage.json';
import woodSpecies from '../data/woodSpecies.json';
import site from '../data/site.json';
import about from '../data/about.json';
import customOrders from '../data/customOrders.json';

/** Resolve a cane image path from JSON (public or imported asset path string). */
export function caneImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return `/${path.replace(/^\.\//, '')}`;
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

export function getGallery() {
  return gallery;
}

export function getGalleryCategories() {
  return [...new Set(gallery.map((g) => g.category).filter(Boolean))];
}

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
