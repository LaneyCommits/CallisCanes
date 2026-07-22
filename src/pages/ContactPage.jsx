import { useState } from 'react';
import { getSite } from '../data';
import Button from '../components/Button';
import { Reveal } from '../components/motion';
import { submitFormspree, FORMSPREE } from '../utils/formspree';

export default function ContactPage() {
  const site = getSite();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await submitFormspree(FORMSPREE.contact, {
        ...form,
        _subject: form.subject || 'Contact form',
      });
      setStatus({ type: 'success', message: 'Message sent — thank you for reaching out.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section depth-section">
      <div className="container">
        <div className="contact-layout">
          <Reveal>
            <div className="contact-info">
              <h1 className="section-title">Contact</h1>
              {site.email && (
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
              )}
              {site.phone && (
                <p><strong>Phone:</strong> {site.phone}</p>
              )}
              {(site.social?.instagram || site.social?.facebook) && (
                <div style={{ marginTop: '1.25rem' }}>
                  <strong>Social</strong>
                  <ul className="footer-links" style={{ marginTop: '0.5rem' }}>
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
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {status?.type === 'success' ? (
              <div className="form-success form-card depth-card">
                <h3>Thank You</h3>
                <p>{status.message}</p>
              </div>
            ) : (
              <form className="form-card depth-card" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input id="subject" name="subject" value={form.subject} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" value={form.message} onChange={handleChange} required />
                </div>
                {status?.type === 'error' && <p className="error-state">{status.message}</p>}
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
