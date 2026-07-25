import { useState, useEffect } from 'react';
import Button from './Button';
import { RevealOnMount } from './motion';
import { caneImageUrl } from '../data';
import './HeroCarousel.css';

const DESKTOP_VIDEO_MQ = '(min-width: 768px)';

export default function HomeHero({ hero }) {
  const heroImage = caneImageUrl(hero?.image);
  const heroMobileImage = caneImageUrl(hero?.mobileImage) || heroImage;
  const heroVideo = caneImageUrl(hero?.video);
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    if (!heroVideo || typeof window === 'undefined') return undefined;
    const mq = window.matchMedia(DESKTOP_VIDEO_MQ);
    const sync = () => setUseVideo(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [heroVideo]);

  if (!hero) return null;

  const stillImage = useVideo ? heroImage : heroMobileImage;

  return (
    <section className="home-hero" aria-label="Hero">
      <div className="home-hero-copy">
        <RevealOnMount as="h1" delay={0.1} variant="left">
          {hero.headline}
        </RevealOnMount>
        <RevealOnMount as="p" delay={0.22} variant="up">
          {hero.subheading}
        </RevealOnMount>
        <RevealOnMount delay={0.34} variant="up">
          <div className="home-hero-actions">
            <Button to={hero.primaryCta.to} variant="forest" size="lg" resin>
              {hero.primaryCta.label}
            </Button>
            <Button to={hero.secondaryCta.to} variant="secondary" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </RevealOnMount>
      </div>

      <div className="home-hero-visual" aria-hidden={!(heroVideo || stillImage)}>
        {useVideo && heroVideo ? (
          <video
            className="home-hero-image-main"
            src={heroVideo}
            poster={heroImage || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : stillImage ? (
          <img src={stillImage} alt="" className="home-hero-image-main home-hero-image-main--mobile" />
        ) : (
          <div className="home-hero-visual--fallback" />
        )}
        <div className="home-hero-visual-fade" aria-hidden="true" />
      </div>
    </section>
  );
}
