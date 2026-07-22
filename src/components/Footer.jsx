import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, Stagger, StaggerItem } from './motion';
import { getSite, caneImageUrl } from '../data';
import TechIssueModal from './TechIssueModal';
import './Footer.css';

export default function Footer() {
  const site = getSite();
  const year = new Date().getFullYear();
  const hasSocial = site.social?.instagram || site.social?.facebook;
  const [techOpen, setTechOpen] = useState(false);

  return (
    <footer className="footer">
      <div className="container">
        <Stagger className="footer-grid" stagger={0.08}>
          <StaggerItem className="footer-brand-col">
            <div className="footer-brand">
              <img
                className="logo-mark"
                src={caneImageUrl('images/logo/calliscanes-logo.webp')}
                alt=""
                width={112}
                height={112}
                decoding="async"
              />
              <p>{site.tagline}</p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div>
              <h4>Quick Links</h4>
              <ul className="footer-links">
                {site.nav.filter((n) => n.to !== '/').map(({ to, label }) => (
                  <li key={to}><Link to={to}>{label}</Link></li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div>
              <h4>Contact</h4>
              <ul className="footer-links">
                {site.email && (
                  <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
                )}
                {site.phone && <li>{site.phone}</li>}
              </ul>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div>
              <h4>Social Media</h4>
              {hasSocial ? (
                <ul className="footer-links footer-social">
                  {site.social.instagram && (
                    <li>
                      <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </li>
                  )}
                  {site.social.facebook && (
                    <li>
                      <a
                        className="footer-social-icon"
                        href={site.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                      >
                        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                          <path
                            fill="currentColor"
                            d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.4V9.86c0-2.37 1.4-3.69 3.56-3.69 1.03 0 2.12.18 2.12.18v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.9h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93z"
                          />
                        </svg>
                      </a>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="footer-muted">Coming soon</p>
              )}
            </div>
          </StaggerItem>
        </Stagger>

        <Reveal variant="fade">
          <div className="footer-bottom">
            <span>&copy; {year} {site.siteName}. All rights reserved.</span>
            <button type="button" className="footer-tech-btn" onClick={() => setTechOpen(true)}>
              Report a tech issue
            </button>
          </div>
        </Reveal>
      </div>

      <TechIssueModal open={techOpen} onClose={() => setTechOpen(false)} />
    </footer>
  );
}
