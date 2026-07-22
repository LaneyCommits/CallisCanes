import Button from './Button';
import { RevealOnMount } from './motion';
import './HeroCarousel.css';

export default function HomeHero({ hero }) {
  if (!hero) return null;

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

      <div className="home-hero-visual" aria-hidden={!hero.image}>
        {hero.image ? (
          <img src={hero.image} alt="" className="home-hero-image-main" />
        ) : (
          <div className="home-hero-visual--fallback" />
        )}
        <div className="home-hero-visual-fade" aria-hidden="true" />
      </div>
    </section>
  );
}
