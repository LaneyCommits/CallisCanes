import { getAbout, caneImageUrl } from '../data';
import { Reveal } from '../components/motion';

export default function AboutPage() {
  const about = getAbout();

  return (
    <section className="section depth-section">
      <div className="container" style={{ maxWidth: 760 }}>
        <Reveal>
          <div className="page-intro">
            <h1 className="section-title">{about.title}</h1>
            {about.intro && (
              <p className="section-subtitle">{about.intro}</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="prose-block depth-card about-story">
            {(about.paragraphs || []).map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        </Reveal>

        {about.photos?.length > 0 && (
          <div className="gallery-preview-grid" style={{ marginTop: '2.5rem' }}>
            {about.photos.map((src, i) => (
              <div key={src || i} className="gallery-preview-tile">
                {src ? <img src={caneImageUrl(src)} alt="" loading="lazy" /> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
