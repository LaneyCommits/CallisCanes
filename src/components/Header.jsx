import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Button from './Button';
import { getSite, caneImageUrl } from '../data';
import { EASE_OUT } from './motion/easing';
import './Header.css';

export default function Header() {
  const site = getSite();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close after the route changes — never unmount the link mid-tap on mobile
  useLayoutEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
  }, [location.pathname, location.search, location.key]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const HeaderTag = reduceMotion ? 'header' : motion.header;

  return (
    <>
      <HeaderTag
        className={['header', scrolled ? 'scrolled' : '', menuOpen ? 'menu-open' : ''].filter(Boolean).join(' ')}
        {...(!reduceMotion && {
          initial: { y: -80, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: 0.55, ease: EASE_OUT },
        })}
      >
        <div className="container header-inner">
          <NavLink
            to="/"
            end
            className="logo"
            aria-label={`${site.siteName} home`}
          >
            <img
              className="logo-mark"
              src={caneImageUrl('images/logo/calliscanes-logo.webp')}
              alt=""
              width={56}
              height={56}
              decoding="async"
            />
          </NavLink>

          <nav className="nav-desktop" aria-label="Main navigation">
            {site.nav.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <Button to={site.cta.to} variant="forest" size="sm" className="header-cta" resin>
              {site.cta.label}
            </Button>

            <button
              type="button"
              className={`menu-toggle ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </HeaderTag>

      <button
        type="button"
        className={`nav-overlay${menuOpen ? ' is-open' : ''}`}
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <nav
        id="mobile-nav"
        className={`nav-mobile${menuOpen ? ' is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="nav-mobile-header">
          <span className="nav-mobile-title">Menu</span>
          <button type="button" className="nav-mobile-close" onClick={closeMenu} aria-label="Close menu">
            &times;
          </button>
        </div>

        <ul className="nav-mobile-links">
          {site.nav.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-mobile-footer">
          <Button to={site.cta.to} variant="forest" resin>
            {site.cta.label}
          </Button>
        </div>
      </nav>
    </>
  );
}
