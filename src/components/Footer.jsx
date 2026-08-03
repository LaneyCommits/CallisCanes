import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getSite, caneImageUrl } from '../data';
import TechIssueModal from './TechIssueModal';
import './Footer.css';

function LeafIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M11.8 21c.2-3.8 1.5-6.8 3.9-9-2.4.2-4.3 1.3-5.6 3.2C9.6 12.4 8.4 9.8 8.6 6.2 5.8 9.2 4.9 12.6 5.9 16c1 .3 2.1.3 3.1-.1C8.4 18.4 9.6 20 11.8 21z"
      />
      <path
        fill="currentColor"
        d="M12.4 11.5c1.7-1.4 4-2 6.8-1.5-1.8 2.6-3.9 3.9-6.5 4.1.1-.9-.1-1.8-.3-2.6z"
      />
      <path
        fill="currentColor"
        d="M11.6 12.6c-1.8-1.1-3.1-2.9-3.6-5.3 2.4.5 3.9 1.9 4.5 4-.3.4-.7.8-.9 1.3z"
      />
    </svg>
  );
}

function EnvelopeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        d="M3.5 6.5h17v11h-17v-11z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.8 7.2 12 13.2l8.2-6"
      />
    </svg>
  );
}

function PinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 12 4.3a6.5 6.5 0 0 0-6.5 6.5C5.5 15.8 12 21 12 21z"
      />
      <circle cx="12" cy="10.8" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ChevronIcon({ open, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
      style={{ transform: open ? 'rotate(180deg)' : undefined }}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 9l6 6 6-6"
      />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      {/* “f” glyph only — circle comes from CSS */}
      <path
        fill="currentColor"
        d="M14.8 8.4h-1.65c-.52 0-.88.22-.88.8v1.05H14.8l-.28 2.15h-1.53V20h-2.35v-7.6H9.2v-2.15h1.44V8.95c0-1.9 1.16-2.95 2.95-2.95.54 0 1.28.05 1.6.1v2.3h-.39z"
      />
    </svg>
  );
}

export default function Footer() {
  const site = getSite();
  const year = new Date().getFullYear();
  const quickLinks = site.nav.filter((n) => n.to !== '/');
  const [techOpen, setTechOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState('brand');

  const togglePanel = (id) => {
    setOpenPanel((prev) => (prev === id ? null : id));
  };

  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div className="footer-panel">
          {/* Desktop layout */}
          <div className="footer-desktop">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="footer-brand-head">
                  <img
                    className="footer-logo"
                    src={caneImageUrl('images/logo/calliscanes-logo.webp')}
                    alt=""
                    width={72}
                    height={72}
                    decoding="async"
                  />
                  <div className="footer-brand-text">
                    <p className="footer-site-name">{site.siteName}</p>
                    <p className="footer-tagline">{site.tagline}</p>
                  </div>
                </div>
                {site.footerBlurb && <p className="footer-blurb">{site.footerBlurb}</p>}
              </div>

              <div className="footer-col">
                <h4 className="footer-heading">Quick Links</h4>
                <ul className="footer-links">
                  {quickLinks.map(({ to, label }) => (
                    <li key={to}>
                      <LeafIcon className="footer-leaf" />
                      <Link to={to}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-col">
                <h4 className="footer-heading">Contact</h4>
                <ul className="footer-contact">
                  {site.email && (
                    <li>
                      <EnvelopeIcon className="footer-contact-icon" />
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                    </li>
                  )}
                  {site.locationLine && (
                    <li>
                      <PinIcon className="footer-contact-icon" />
                      <span>{site.locationLine}</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="footer-col">
                <h4 className="footer-heading">Social Media</h4>
                {site.social?.facebook ? (
                  <a
                    className="footer-social-icon"
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                ) : (
                  <p className="footer-muted">Coming soon</p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile accordion */}
          <div className="footer-mobile">
            <div className={`footer-acc ${openPanel === 'brand' ? 'is-open' : ''}`}>
              <button
                type="button"
                className="footer-acc-trigger footer-acc-brand"
                aria-expanded={openPanel === 'brand'}
                onClick={() => togglePanel('brand')}
              >
                <span className="footer-brand-head">
                  <img
                    className="footer-logo"
                    src={caneImageUrl('images/logo/calliscanes-logo.webp')}
                    alt=""
                    width={56}
                    height={56}
                    decoding="async"
                  />
                  <span className="footer-brand-text">
                    <span className="footer-site-name">{site.siteName}</span>
                    <span className="footer-tagline">{site.tagline}</span>
                  </span>
                </span>
                <ChevronIcon open={openPanel === 'brand'} className="footer-chevron" />
              </button>
              <div className="footer-acc-panel" hidden={openPanel !== 'brand'}>
                {site.footerBlurb && <p className="footer-blurb">{site.footerBlurb}</p>}
              </div>
            </div>

            <div className={`footer-acc ${openPanel === 'links' ? 'is-open' : ''}`}>
              <button
                type="button"
                className="footer-acc-trigger"
                aria-expanded={openPanel === 'links'}
                onClick={() => togglePanel('links')}
              >
                <span className="footer-acc-label">
                  <LeafIcon className="footer-acc-icon" />
                  Quick Links
                </span>
                <ChevronIcon open={openPanel === 'links'} className="footer-chevron" />
              </button>
              <div className="footer-acc-panel" hidden={openPanel !== 'links'}>
                <ul className="footer-links">
                  {quickLinks.map(({ to, label }) => (
                    <li key={to}>
                      <LeafIcon className="footer-leaf" />
                      <Link to={to}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`footer-acc ${openPanel === 'contact' ? 'is-open' : ''}`}>
              <button
                type="button"
                className="footer-acc-trigger"
                aria-expanded={openPanel === 'contact'}
                onClick={() => togglePanel('contact')}
              >
                <span className="footer-acc-label">
                  <EnvelopeIcon className="footer-acc-icon" />
                  Contact
                </span>
                <ChevronIcon open={openPanel === 'contact'} className="footer-chevron" />
              </button>
              <div className="footer-acc-panel" hidden={openPanel !== 'contact'}>
                <ul className="footer-contact">
                  {site.email && (
                    <li>
                      <EnvelopeIcon className="footer-contact-icon" />
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                    </li>
                  )}
                  {site.locationLine && (
                    <li>
                      <PinIcon className="footer-contact-icon" />
                      <span>{site.locationLine}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className={`footer-acc ${openPanel === 'social' ? 'is-open' : ''}`}>
              <button
                type="button"
                className="footer-acc-trigger"
                aria-expanded={openPanel === 'social'}
                onClick={() => togglePanel('social')}
              >
                <span className="footer-acc-label">
                  <span className="footer-acc-fb" aria-hidden="true">
                    <FacebookIcon />
                  </span>
                  Social Media
                </span>
                <ChevronIcon open={openPanel === 'social'} className="footer-chevron" />
              </button>
              <div className="footer-acc-panel" hidden={openPanel !== 'social'}>
                {site.social?.facebook ? (
                  <a
                    className="footer-social-icon"
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                ) : (
                  <p className="footer-muted">Coming soon</p>
                )}
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-divider" aria-hidden="true">
              <span className="footer-divider-line" />
              <LeafIcon className="footer-divider-leaf" />
              <span className="footer-divider-line" />
            </div>
            <p className="footer-copy">&copy; {year} {site.siteName}. All rights reserved.</p>
            <button type="button" className="footer-tech-btn" onClick={() => setTechOpen(true)}>
              Report a tech issue
            </button>
          </div>
        </div>
      </div>

      <TechIssueModal open={techOpen} onClose={() => setTechOpen(false)} />
    </footer>
  );
}
