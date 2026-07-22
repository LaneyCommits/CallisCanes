import { useState } from 'react';
import { getHomepage, getFeaturedCanes, getGallery, caneImageUrl } from '../data';
import HomeHero from '../components/HeroCarousel';
import { CaneGrid } from '../components/CaneCard';
import Button from '../components/Button';
import { Reveal, Stagger, StaggerItem } from '../components/motion';

function isVideoItem(item) {
  return item?.type === 'video' || Boolean(item?.video);
}

export default function HomePage() {
  const home = getHomepage();
  const featured = getFeaturedCanes();
  const galleryPreview = getGallery().slice(0, 4);
  const [playingId, setPlayingId] = useState(null);

  return (
    <>
      <HomeHero hero={home.hero} />

      <section className="section depth-section">
        <div className="container">
          <Stagger className="feature-grid" stagger={0.08}>
            {home.features.map((f) => (
              <StaggerItem key={f.title}>
                <div className="feature-card depth-card">
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section featured-canes-section depth-section">
        <div className="container">
          <Reveal as="h2" className="section-title" variant="up">
            {home.featuredSection.title}
          </Reveal>
          <Reveal as="p" className="section-subtitle" delay={0.08} variant="fade">
            {home.featuredSection.subtitle}
          </Reveal>
          {featured.length > 0 ? (
            <>
              <CaneGrid canes={featured} />
              <Reveal delay={0.1}>
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <Button to="/collection" variant="secondary">
                    View Full Collection
                  </Button>
                </div>
              </Reveal>
            </>
          ) : (
            <p className="empty-state">Featured pieces will appear here once added to canes.json.</p>
          )}
        </div>
      </section>

      <section className="section depth-section">
        <div className="container">
          <div className="about-preview">
            <Reveal>
              <div className="about-preview-media">
                {home.aboutPreview.image ? (
                  <img src={caneImageUrl(home.aboutPreview.image)} alt="" loading="lazy" />
                ) : null}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="about-preview-copy">
                <h2 className="section-title">{home.aboutPreview.title}</h2>
                <p>{home.aboutPreview.body}</p>
                <Button to={home.aboutPreview.cta.to} variant="primary" resin>
                  {home.aboutPreview.cta.label}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section depth-section">
        <div className="container">
          <Reveal as="h2" className="section-title">
            {home.galleryPreview.title}
          </Reveal>
          <Reveal as="p" className="section-subtitle" delay={0.08}>
            {home.galleryPreview.subtitle}
          </Reveal>
          <div className="gallery-preview-grid">
            {galleryPreview.map((item) => {
              const video = isVideoItem(item);
              const playing = video && playingId === item.id;

              if (video) {
                return (
                  <div
                    key={item.id}
                    className={`gallery-preview-tile gallery-preview-tile--video${playing ? ' is-playing' : ''}`}
                  >
                    {playing ? (
                      <video
                        className="gallery-preview-video"
                        src={caneImageUrl(item.video)}
                        poster={caneImageUrl(item.image) || undefined}
                        controls
                        playsInline
                        autoPlay
                        onEnded={() => setPlayingId(null)}
                      />
                    ) : (
                      <button
                        type="button"
                        className="gallery-preview-play-btn"
                        onClick={() => setPlayingId(item.id)}
                        aria-label={`Play ${item.title || 'video'}`}
                      >
                        {item.image ? (
                          <img src={caneImageUrl(item.image)} alt={item.title} loading="lazy" />
                        ) : null}
                        <span className="gallery-play gallery-play--sm" aria-hidden="true">
                          <span className="gallery-play-icon" />
                        </span>
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div key={item.id} className="gallery-preview-tile">
                  {item.image ? (
                    <img src={caneImageUrl(item.image)} alt={item.title} loading="lazy" />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button to={home.galleryPreview.cta.to} variant="secondary">
              {home.galleryPreview.cta.label}
            </Button>
          </div>
        </div>
      </section>

      <section className="section depth-section">
        <div className="container">
          <Reveal>
            <div className="cta-banner">
              <h2 className="section-title">{home.ctaBanner.title}</h2>
              <p>{home.ctaBanner.body}</p>
              <Button to={home.ctaBanner.cta.to} variant="forest" size="lg" resin>
                {home.ctaBanner.cta.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
