import { getAllCanes } from '../data';
import { CaneGrid } from '../components/CaneCard';
import { Reveal } from '../components/motion';

export default function CollectionPage() {
  const canes = getAllCanes();

  return (
    <section className="section depth-section">
      <div className="container">
        <Reveal>
          <div className="page-intro">
            <h1 className="section-title">Collection</h1>
            <p className="section-subtitle">
              This is where all the currently available canes live.
            </p>
          </div>
        </Reveal>

        {canes.length === 0 ? (
          <p className="empty-state">No canes yet. Add entries to src/data/canes.json.</p>
        ) : (
          <CaneGrid canes={canes} />
        )}
      </div>
    </section>
  );
}
