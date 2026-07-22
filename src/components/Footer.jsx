import { Link } from 'react-router-dom';
import { Reveal, Stagger, StaggerItem } from './motion';
import { getSite } from '../data';
import './Footer.css';

export default function Footer() {
  const site = getSite();
  const year = new Date().getFullYear();
  const hasSocial = site.social?.instagram || site.social?.facebook;

  return (
    <footer className="footer">
      <div className="container">
        <Stagger className="footer-grid" stagger={0.08}>
          <StaggerItem className="footer-brand-col">
            <div className="footer-brand">
              <img
                className="logo-mark"
                src="/images/logo/calliscanes-logo.webp"
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
                <ul className="footer-links">
                  {site.social.instagram && (
                    <li>
                      <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </li>
                  )}
                  {site.social.facebook && (
                    <li>
                      <a href={site.social.facebook} target="_blank" rel="noopener noreferrer">
                        Facebook
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
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
