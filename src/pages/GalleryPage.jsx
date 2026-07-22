import { useState, useEffect } from 'react';
import { getGallery, getGalleryCategories, caneImageUrl } from '../data';
import { Reveal } from '../components/motion';

function isVideo(item) {
  return item?.type === 'video' || Boolean(item?.video);
}

export default function GalleryPage() {
  const items = getGallery();
  const categories = getGalleryCategories();
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = filter === 'All'
    ? items
    : items.filter((i) => i.category === filter);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  return (
    <section className="section depth-section">
      <div className="container">
        <Reveal>
          <div className="page-intro">
            <h1 className="section-title">Gallery</h1>
            <p className="section-subtitle">
              Workshop photos, finished canes, customer pieces, featured builds, and close-up craftsmanship.
            </p>
          </div>
        </Reveal>

        <div className="gallery-filters" role="tablist" aria-label="Gallery categories">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              className={`filter-btn${filter === cat ? ' active' : ''}`}
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No gallery images yet. Add entries to src/data/gallery.json.</p>
        ) : (
          <div className="gallery-masonry">
            {filtered.map((item) => {
              const video = isVideo(item);
              const thumb = caneImageUrl(item.image);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`gallery-masonry-item${video ? ' gallery-masonry-item--video' : ''}`}
                  onClick={() => setLightbox(item)}
                  aria-label={video ? `${item.title || 'Play video'}` : (item.title || 'View image')}
                >
                  {thumb ? (
                    <img src={thumb} alt={item.title} loading="lazy" />
                  ) : (
                    <div className="gallery-masonry-placeholder" />
                  )}
                  {video ? (
                    <span className="gallery-play" aria-hidden="true">
                      <span className="gallery-play-icon" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.title}>
          <div className="lightbox-inner">
            <button type="button" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
              &times;
            </button>
            {isVideo(lightbox) && lightbox.video ? (
              <video
                className="lightbox-video"
                src={caneImageUrl(lightbox.video)}
                poster={caneImageUrl(lightbox.image) || undefined}
                controls
                playsInline
                autoPlay
              />
            ) : lightbox.image ? (
              <img src={caneImageUrl(lightbox.image)} alt={lightbox.title} />
            ) : (
              <div className="gallery-masonry-placeholder" style={{ minWidth: 280, minHeight: 320 }} />
            )}
            {(lightbox.title || lightbox.caption) && (
              <p className="lightbox-caption">
                {lightbox.title}
                {lightbox.caption ? ` — ${lightbox.caption}` : ''}
              </p>
            )}
          </div>
          <button type="button" className="lightbox-backdrop" aria-label="Close" onClick={() => setLightbox(null)} />
        </div>
      )}
    </section>
  );
}
