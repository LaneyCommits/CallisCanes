import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCustomOrders, getCaneBySlug, getWoodSpecies } from '../data';
import Button from '../components/Button';
import ContactFields, {
  CONTACT_DEFAULTS,
  validateContact,
  contactPayload,
} from '../components/ContactFields';
import { Reveal } from '../components/motion';
import { submitFormspree, FORMSPREE } from '../utils/formspree';

const empty = {
  name: '',
  ...CONTACT_DEFAULTS,
  height: '',
  preferredWood: '',
  handleStyle: '',
  engraving: '',
  notes: '',
};

export default function CustomOrdersPage() {
  const content = getCustomOrders();
  const woods = getWoodSpecies();
  const [searchParams] = useSearchParams();
  const caneSlug = searchParams.get('cane');
  const reference = caneSlug ? getCaneBySlug(caneSlug) : null;

  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (reference) {
      setForm((prev) => ({
        ...prev,
        preferredWood: reference.wood || prev.preferredWood,
        notes: prev.notes || `Inspired by "${reference.name}". `,
      }));
    }
  }, [reference]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const contactError = validateContact(form);
    if (contactError) {
      setStatus({ type: 'error', message: contactError });
      setSubmitting(false);
      return;
    }

    try {
      const {
        name, height, preferredWood, handleStyle, engraving, notes, ...contact
      } = form;
      await submitFormspree(FORMSPREE.customOrder, {
        name,
        height,
        preferredWood,
        handleStyle,
        engraving,
        notes,
        ...contactPayload(contact),
        _subject: 'Custom order request',
        referenceCane: reference?.name || '',
      });
      setStatus({ type: 'success', message: 'Request received — we will be in touch soon.' });
      setForm(empty);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section depth-section">
      <div className="container">
        <Reveal>
          <div className="page-intro">
            <h1 className="section-title">{content.title}</h1>
            <p className="section-subtitle">{content.intro}</p>
          </div>
        </Reveal>

        {reference && (
          <div className="reference-banner depth-card">
            Referencing: <strong>{reference.name}</strong>
            {reference.wood ? ` (${reference.wood})` : ''}
          </div>
        )}

        <Reveal>
          <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            Custom order request
          </h2>
        </Reveal>

        {status?.type === 'success' ? (
          <div className="form-success form-card depth-card">
            <h3>Request Received</h3>
            <p>{status.message}</p>
          </div>
        ) : (
          <form className="form-card depth-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
            </div>
            <ContactFields form={form} onChange={handleChange} />
            <div className="form-group">
              <label htmlFor="height">Height</label>
              <input id="height" name="height" value={form.height} onChange={handleChange} placeholder='e.g. 36"' />
            </div>
            <div className="form-group">
              <label htmlFor="preferredWood">Preferred wood</label>
              <select id="preferredWood" name="preferredWood" value={form.preferredWood} onChange={handleChange}>
                <option value="">Select...</option>
                {woods.map((w) => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
                <option value="Other / Not sure">Other / Not sure</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="handleStyle">Handle style</label>
              <input id="handleStyle" name="handleStyle" value={form.handleStyle} onChange={handleChange} placeholder="e.g. Derby, knob, natural branch" />
            </div>
            <div className="form-group">
              <label htmlFor="engraving">Engraving</label>
              <input id="engraving" name="engraving" value={form.engraving} onChange={handleChange} placeholder="Optional text or motif" />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} required placeholder="Tell us about your vision..." />
            </div>
            {status?.type === 'error' && <p className="error-state">{status.message}</p>}
            <Button type="submit" variant="primary" size="lg" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Custom Order Request'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
