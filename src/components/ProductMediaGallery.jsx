import { useState, useRef } from 'react';
import { caneImageUrl } from '../data';
import './ProductMediaGallery.css';

export default function ProductMediaGallery({ images = [], productName, enableZoom = true }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const scrollerRef = useRef(null);
  const urls = (images || []).map(caneImageUrl).filter(Boolean);

  if (!urls.length) {
    return (
      <div className="product-gallery product-gallery--empty">
        <div className="product-gallery-main product-gallery-main--empty" aria-label={`${productName} media`}>
          <span>Photos coming soon</span>
        </div>
      </div>
    );
  }

  const current = urls[Math.min(activeIndex, urls.length - 1)];

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
  };

  return (
    <div className="product-gallery">
      <div
        className="product-gallery-scroller"
        ref={scrollerRef}
        onScroll={onScroll}
        aria-label={`${productName} photos`}
      >
        {urls.map((src, i) => (
          <div className="product-gallery-slide" key={`${src}-${i}`}>
            <button
              type="button"
              className="product-gallery-zoom-btn"
              onClick={() => enableZoom && setZoomed(true)}
              aria-label={enableZoom ? `Zoom image ${i + 1}` : undefined}
            >
              <img
                src={src}
                alt={`${productName} photo ${i + 1}`}
                className="product-gallery-image"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </button>
          </div>
        ))}
      </div>

      {urls.length > 1 && (
        <div className="product-gallery-dots" role="tablist" aria-label="Gallery slides">
          {urls.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              className={`product-gallery-dot${i === activeIndex ? ' active' : ''}`}
              onClick={() => {
                setActiveIndex(i);
                scrollerRef.current?.scrollTo({ left: i * scrollerRef.current.clientWidth, behavior: 'smooth' });
              }}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      )}

      {urls.length > 1 && (
        <div className="product-gallery-thumbs" role="tablist">
          {urls.map((src, i) => (
            <button
              key={`thumb-${i}`}
              type="button"
              className={`product-gallery-thumb${i === activeIndex ? ' active' : ''}`}
              onClick={() => {
                setActiveIndex(i);
                scrollerRef.current?.scrollTo({ left: i * scrollerRef.current.clientWidth, behavior: 'smooth' });
              }}
              aria-label={`Show photo ${i + 1}`}
              aria-selected={i === activeIndex}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Zoomed image">
          <div className="lightbox-inner">
            <button type="button" className="lightbox-close" onClick={() => setZoomed(false)} aria-label="Close">
              &times;
            </button>
            <img src={current} alt={productName} />
          </div>
          <button type="button" className="lightbox-backdrop" aria-label="Close" onClick={() => setZoomed(false)} />
        </div>
      )}
    </div>
  );
}
