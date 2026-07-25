import { useState, useEffect } from 'react';
import { getAllCanes, getHeightGuide } from '../data';
import { CaneGrid } from '../components/CaneCard';
import Button from '../components/Button';
import { Reveal } from '../components/motion';
import '../components/CaneMedia.css';

export default function CollectionPage() {
  const canes = getAllCanes();
  const guide = getHeightGuide();
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    if (!guideOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setGuideOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [guideOpen]);

  return (
    <section className="section depth-section">
      <div className="container">
        <Reveal>
          <div className="page-intro">
            <h1 className="section-title">Collection</h1>
            <p className="section-subtitle">
              These are our available canes.
            </p>
            <p className="height-guide-prompt">
              Not sure what size cane you need?
            </p>
            <div className="height-guide-actions">
              <Button type="button" variant="secondary" onClick={() => setGuideOpen(true)}>
                View Height Guide
              </Button>
            </div>
          </div>
        </Reveal>

        {canes.length === 0 ? (
          <p className="empty-state">No canes yet. Add entries to src/data/canes.json.</p>
        ) : (
          <CaneGrid canes={canes} />
        )}
      </div>

      {guideOpen && (
        <div
          className="inquiry-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="height-guide-title"
        >
          <button
            type="button"
            className="inquiry-modal-backdrop"
            aria-label="Close height guide"
            onClick={() => setGuideOpen(false)}
          />
          <div className="inquiry-modal-panel height-guide-panel">
            <button
              type="button"
              className="inquiry-modal-close"
              aria-label="Close"
              onClick={() => setGuideOpen(false)}
            >
              &times;
            </button>
            <h2 id="height-guide-title" className="height-guide-title">
              {guide.title}
            </h2>
            <p className="height-guide-intro">{guide.intro}</p>
            <div className="height-guide-table-wrap">
              <table className="height-guide-table">
                <thead>
                  <tr>
                    <th scope="col">Your height</th>
                    <th scope="col">Cane length</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.rows.map((row) => (
                    <tr key={row.personHeight}>
                      <td>{row.personHeight}</td>
                      <td>{row.caneLength}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {guide.note && <p className="height-guide-note">{guide.note}</p>}
            <Button type="button" variant="primary" onClick={() => setGuideOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
