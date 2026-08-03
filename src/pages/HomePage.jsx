import { useState } from 'react';
import { getHomepage, getFeaturedCanes, getGallery, caneImageUrl } from '../data';
import HomeHero from '../components/HeroCarousel';
import { CaneGrid } from '../components/CaneCard';
import Button from '../components/Button';
import { Reveal, Stagger, StaggerItem } from '../components/motion';

function isVideoItem(item) {
  return item?.type === 'video' || Boolean(item?.video);
}

function ReviewLeaf({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M11.8 21c.2-3.8 1.5-6.8 3.9-9-2.4.2-4.3 1.3-5.6 3.2C9.6 12.4 8.4 9.8 8.6 6.2 5.8 9.2 4.9 12.6 5.9 16c1 .3 2.1.3 3.1-.1C8.4 18.4 9.6 20 11.8 21z"
      />
      <path
        fill="currentColor"
        d="M12.4 11.5c1.7-1.4 4-2 6.8-1.5-1.8 2.6-3.9 3.9-6.5 4.1.1-.9-.1-1.8-.3-2.6z"
      />
      <path
        fill="currentColor"
        d="M11.6 12.6c-1.8-1.1-3.1-2.9-3.6-5.3 2.4.5 3.9 1.9 4.5 4-.3.4-.7.8-.9 1.3z"
      />
    </svg>
  );
}

function ReviewStar() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 3.6l2.2 4.6 5.1.7-3.7 3.6.9 5.1L12 15.6 7.5 17.6l.9-5.1L4.7 8.9l5.1-.7L12 3.6z"
      />
    </svg>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="review-card">
      {review.image && (
        <div className="review-card-media">
          <img
            src={caneImageUrl(review.image)}
            alt={review.imageAlt || ''}
            loading="lazy"
            style={review.imagePosition ? { objectPosition: review.imagePosition } : undefined}
          />
        </div>
      )}
      <div className="review-card-body">
        <span className="review-card-quote-mark" aria-hidden="true">“</span>
        <blockquote className="review-card-quote">
          <p>{review.quote}</p>
        </blockquote>
        <div className="review-card-author">
          <span className="review-card-star" aria-hidden="true">
            <ReviewStar />
          </span>
          <cite>{review.author}</cite>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const home = getHomepage();
  const featured = getFeaturedCanes();
  const galleryPreview = getGallery().slice(0, 4);
  const reviews = home.reviews?.items || [];
  const [playingId, setPlayingId] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  const goReview = (dir) => {
    if (!reviews.length) return;
    setReviewIndex((i) => (i + dir + reviews.length) % reviews.length);
  };

  return (
    <div className="home-page">
      <HomeHero hero={home.hero} />

      <section className="section depth-section section-band section-band--alt">
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

      <section className="section featured-canes-section depth-section section-band section-band--featured">
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
                <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
                  <Button to="/collection" variant="secondary">
                    See the Whole Collection
                  </Button>
                </div>
              </Reveal>
            </>
          ) : (
            <p className="empty-state">Featured pieces will appear here once added to canes.json.</p>
          )}
        </div>
      </section>

      <section className="section depth-section section-band">
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

      <section className="section depth-section section-band section-band--alt">
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

      {reviews.length > 0 && (
        <section className="section depth-section review-section section-band">
          <div className="container">
            <Reveal>
              <header className="review-header">
                <ReviewLeaf className="review-header-leaf" />
                <p className="review-eyebrow">{home.reviews.eyebrow || 'Kind words from folks'}</p>
                <h2 className="review-title">
                  <ReviewLeaf className="review-title-leaf review-title-leaf--left" />
                  <span>{home.reviews.title || 'What Our Customers Say'}</span>
                  <ReviewLeaf className="review-title-leaf review-title-leaf--right" />
                </h2>
                <div className="review-header-rule" aria-hidden="true">
                  <span className="review-header-rule-line" />
                  <span className="review-header-dots">
                    <span /><span /><span />
                  </span>
                  <span className="review-header-rule-line" />
                </div>
              </header>
            </Reveal>

            {/* Desktop / tablet: all cards in a grid */}
            <Stagger className="review-grid" stagger={0.1}>
              {reviews.map((review) => (
                <StaggerItem key={review.author}>
                  <ReviewCard review={review} />
                </StaggerItem>
              ))}
            </Stagger>

            {/* Mobile: single-card carousel */}
            <div className="review-carousel" aria-roledescription="carousel" aria-label="Customer reviews">
              <button
                type="button"
                className="review-carousel-btn review-carousel-btn--prev"
                aria-label="Previous review"
                onClick={() => goReview(-1)}
              >
                <span aria-hidden="true">←</span>
              </button>

              <div className="review-carousel-stage">
                <ReviewCard review={reviews[reviewIndex]} />
              </div>

              <button
                type="button"
                className="review-carousel-btn review-carousel-btn--next"
                aria-label="Next review"
                onClick={() => goReview(1)}
              >
                <span aria-hidden="true">→</span>
              </button>

              <div className="review-carousel-dots" role="tablist" aria-label="Review slides">
                {reviews.map((review, i) => (
                  <button
                    key={review.author}
                    type="button"
                    role="tab"
                    aria-selected={i === reviewIndex}
                    aria-label={`Show review from ${review.author}`}
                    className={`review-carousel-dot${i === reviewIndex ? ' is-active' : ''}`}
                    onClick={() => setReviewIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section depth-section section-band section-band--alt">
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
    </div>
  );
}
