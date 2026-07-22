import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCaneBySlug, formatPrice } from '../data';
import Button from '../components/Button';
import ProductMediaGallery from '../components/ProductMediaGallery';
import { submitFormspree, FORMSPREE } from '../utils/formspree';
import '../components/CaneMedia.css';
import '../components/CaneCard.css';

export default function CaneDetailPage() {
  const { slug } = useParams();
  const cane = getCaneBySlug(slug);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    if (!inquiryOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setInquiryOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [inquiryOpen]);

  if (!cane) {
    return (
      <section className="section">
        <div className="container">
          <p className="empty-state">Cane not found.</p>
          <p style={{ textAlign: 'center' }}>
            <Link to="/collection">Back to Collection</Link>
          </p>
        </div>
      </section>
    );
  }

  const isDisplay = cane.status === 'Display';
  const isSold = cane.status === 'Sold';
  const canPurchase = !isDisplay && !isSold;

  return (
    <section className="section cane-detail-section">
      <div className="container">
        <Link to="/collection" className="cane-detail-back">
          &larr; Back to Collection
        </Link>

        <div className="cane-detail-layout">
          <div className="cane-detail-media-col">
            <ProductMediaGallery images={cane.images} productName={cane.name} />
          </div>

          <div className="cane-detail-info">
            <span className="cane-detail-wood">{cane.wood || 'Wood TBD'}</span>
            <h1>{cane.name}</h1>
            <div className="cane-detail-highlights">
              <span className="cane-detail-price">
                {isDisplay ? 'Not for sale' : formatPrice(cane.price)}
              </span>
              <span className={`status-badge status-badge--${(cane.status || 'Available').toLowerCase()}`}>
                {isDisplay ? 'Showpiece' : (cane.status || 'Available')}
              </span>
            </div>
            {cane.description && <p className="cane-detail-lead">{cane.description}</p>}

            <dl className="cane-detail-meta">
              {cane.wood && (
                <>
                  <dt>Wood Species</dt>
                  <dd>{cane.wood}</dd>
                </>
              )}
              {cane.height && (
                <>
                  <dt>Height</dt>
                  <dd>{cane.height}</dd>
                </>
              )}
              {cane.finish && (
                <>
                  <dt>Finish</dt>
                  <dd>{cane.finish}</dd>
                </>
              )}
              <dt>Price</dt>
              <dd>{isDisplay ? 'Not for sale' : formatPrice(cane.price)}</dd>
              <dt>Availability</dt>
              <dd>
                {isDisplay
                  ? 'Display only'
                  : isSold
                    ? 'Sold'
                    : cane.quantity === 1
                      ? '1 available — inquire to purchase'
                      : (cane.status || 'Available')}
              </dd>
            </dl>

            {canPurchase && (
              <Button
                type="button"
                variant="primary"
                size="lg"
                resin
                onClick={() => setInquiryOpen(true)}
              >
                Inquire to Purchase
              </Button>
            )}
            {isDisplay && (
              <Button to={`/custom-orders?cane=${cane.slug}`} variant="forest" size="lg" resin>
                Request a Custom Tribute
              </Button>
            )}
          </div>
        </div>
      </div>

      {inquiryOpen && canPurchase && (
        <div
          className="inquiry-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
        >
          <button
            type="button"
            className="inquiry-modal-backdrop"
            aria-label="Close inquiry form"
            onClick={() => setInquiryOpen(false)}
          />
          <div className="inquiry-modal-panel">
            <button
              type="button"
              className="inquiry-modal-close"
              aria-label="Close"
              onClick={() => setInquiryOpen(false)}
            >
              &times;
            </button>
            <PurchaseRequestForm cane={cane} onClose={() => setInquiryOpen(false)} />
          </div>
        </div>
      )}
    </section>
  );
}

function PurchaseRequestForm({ cane, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in purchasing "${cane.name}".`,
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await submitFormspree(FORMSPREE.purchase, {
        ...form,
        _subject: `Purchase request: ${cane.name}`,
        cane: cane.name,
        slug: cane.slug,
      });
      setStatus({ type: 'success', message: 'Thank you — we will follow up soon.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (status?.type === 'success') {
    return (
      <div className="form-success cane-inquiry">
        <h3 id="inquiry-modal-title">Request Received</h3>
        <p>{status.message}</p>
        <Button type="button" variant="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <form className="cane-inquiry" onSubmit={handleSubmit}>
      <h2 id="inquiry-modal-title">Purchase Inquiry</h2>
      <p className="cane-inquiry-lead">
        Only one of these is available. Send a note to inquire — we will confirm price and next steps.
      </p>
      <div className="form-group">
        <label htmlFor="purchase-name">Name</label>
        <input id="purchase-name" name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
      </div>
      <div className="form-group">
        <label htmlFor="purchase-email">Email</label>
        <input id="purchase-email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
      </div>
      <div className="form-group">
        <label htmlFor="purchase-phone">Phone (optional)</label>
        <input id="purchase-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" />
      </div>
      <div className="form-group">
        <label htmlFor="purchase-message">Message</label>
        <textarea id="purchase-message" name="message" value={form.message} onChange={handleChange} required />
      </div>
      {status?.type === 'error' && <p className="error-state">{status.message}</p>}
      <Button type="submit" variant="primary" size="lg" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Purchase Request'}
      </Button>
      <p className="cane-inquiry-alt">
        Prefer a full custom build?{' '}
        <Link to={`/custom-orders?cane=${cane.slug}`} onClick={onClose}>
          Request a custom order
        </Link>
      </p>
    </form>
  );
}
