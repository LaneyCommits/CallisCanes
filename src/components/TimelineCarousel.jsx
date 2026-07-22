import { useState, useCallback } from 'react';
import './TimelineCarousel.css';

export default function TimelineCarousel({ steps }) {
  const total = steps?.length || 0;
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next) => {
    if (total <= 0) return;
    setIndex(((next % total) + total) % total);
  }, [total]);

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  if (!total) return null;

  return (
    <div className="timeline-carousel" aria-roledescription="carousel" aria-label="How custom orders work">
      <div className="timeline-carousel-frame">
        <button
          type="button"
          className="timeline-carousel-nav timeline-carousel-nav--prev"
          onClick={prev}
          aria-label="Previous step"
        >
          ‹
        </button>

        <div className="timeline-carousel-viewport">
          <div
            className="timeline-carousel-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="timeline-carousel-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`Step ${i + 1} of ${total}`}
                aria-hidden={i !== index}
              >
                <div className="timeline-step depth-card">
                  <span className="timeline-step-num">{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="timeline-carousel-nav timeline-carousel-nav--next"
          onClick={next}
          aria-label="Next step"
        >
          ›
        </button>
      </div>

      <div className="timeline-carousel-dots" role="tablist" aria-label="Timeline steps">
        {steps.map((step, i) => (
          <button
            key={step.title}
            type="button"
            role="tab"
            className={`timeline-carousel-dot${i === index ? ' active' : ''}`}
            aria-selected={i === index}
            aria-label={`Go to step ${i + 1}: ${step.title}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
