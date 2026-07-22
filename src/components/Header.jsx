import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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

  // Always dismiss the drawer after any route change
  useLayoutEffect(() => {
    setMenuOpen(false);
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
            onClick={closeMenu}
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-overlay open"
            onClick={closeMenu}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            className="nav-mobile open"
            aria-label="Mobile navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <div className="nav-mobile-header">
              <span className="nav-mobile-title">Menu</span>
              <button type="button" className="nav-mobile-close" onClick={closeMenu} aria-label="Close menu">
                &times;
              </button>
            </div>

            <ul className="nav-mobile-links">
              {site.nav.map(({ to, label }, i) => (
                <motion.li
                  key={to}
                  initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.35, ease: EASE_OUT }}
                >
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={closeMenu}
                  >
                    {label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <div className="nav-mobile-footer">
              <Button
                to={site.cta.to}
                variant="forest"
                resin
                onClick={closeMenu}
              >
                {site.cta.label}
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
