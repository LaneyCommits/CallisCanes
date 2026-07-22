import { useState, useEffect } from 'react';
import Button from './Button';
import { submitFormspree, FORMSPREE } from '../utils/formspree';

const empty = { name: '', email: '', page: '', message: '' };

export default function TechIssueModal({ open, onClose }) {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    setForm((prev) => ({
      ...prev,
      page: prev.page || (typeof window !== 'undefined' ? window.location.href : ''),
    }));
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await submitFormspree(FORMSPREE.techIssues, {
        ...form,
        _subject: 'Tech issue report',
      });
      setStatus({ type: 'success', message: 'Thanks — your report was sent.' });
      setForm(empty);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="tech-issue-title">
      <button type="button" className="inquiry-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className="inquiry-modal-panel">
        <button type="button" className="inquiry-modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {status?.type === 'success' ? (
          <div className="form-success">
            <h3 id="tech-issue-title">Report sent</h3>
            <p>{status.message}</p>
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <form className="cane-inquiry" onSubmit={handleSubmit}>
            <h2 id="tech-issue-title">Report a tech issue</h2>
            <p className="cane-inquiry-lead">
              Something broken on the site? Tell us what happened and where.
            </p>
            <div className="form-group">
              <label htmlFor="tech-name">Name</label>
              <input
                id="tech-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="tech-email">Email</label>
              <input
                id="tech-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="tech-page">Page URL</label>
              <input
                id="tech-page"
                name="page"
                value={form.page}
                onChange={handleChange}
                placeholder="https://"
              />
            </div>
            <div className="form-group">
              <label htmlFor="tech-message">What went wrong?</label>
              <textarea
                id="tech-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
            {status?.type === 'error' && <p className="error-state">{status.message}</p>}
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send report'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
