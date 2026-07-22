import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { submitFormspree, FORMSPREE } from '../utils/formspree';
import './TechIssueModal.css';

const empty = { name: '', email: '', message: '' };

export default function TechIssueModal({ open, onClose }) {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    setStatus(null);
    setForm(empty);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await submitFormspree(FORMSPREE.techIssues, {
        ...form,
        page: typeof window !== 'undefined' ? window.location.href : '',
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

  return createPortal(
    <div className="tech-modal" role="dialog" aria-modal="true" aria-labelledby="tech-issue-title">
      <button type="button" className="tech-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className="tech-modal-panel depth-card">
        <button type="button" className="tech-modal-close" onClick={onClose} aria-label="Close">
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
          <form className="tech-modal-form" onSubmit={handleSubmit}>
            <h2 id="tech-issue-title">Report a tech issue</h2>
            <p className="tech-modal-lead">
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
    </div>,
    document.body,
  );
}
