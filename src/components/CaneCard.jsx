import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { formatPrice, getCoverImage } from '../data';
import { EASE_OUT } from './motion/easing';
import './CaneCard.css';

function StatusBadge({ status }) {
  const key = (status || 'Available').toLowerCase();
  const label = status === 'Display' ? 'Showpiece' : (status || 'Available');
  return (
    <span className={`status-badge status-badge--${key}`}>
      {label}
    </span>
  );
}

export default function CaneCard({ cane }) {
  const reduceMotion = useReducedMotion();
  const cover = getCoverImage(cane);
  const CardTag = reduceMotion ? 'article' : motion.article;
  const isDisplay = cane.status === 'Display';
  const qty = cane.quantity;

  return (
    <CardTag
      className="cane-card"
      {...(!reduceMotion && {
        whileHover: { y: -4 },
        transition: { type: 'spring', stiffness: 380, damping: 28 },
      })}
    >
      <Link to={`/collection/${cane.slug}`} className="cane-card-link">
        <div className="cane-card-media">
          {cover ? (
            <img src={cover} alt="" loading="lazy" className="cane-card-img" />
          ) : (
            <div className="cane-card-placeholder" aria-hidden="true" />
          )}
          <StatusBadge status={cane.status} />
        </div>
        <div className="cane-card-body">
          <h3 className="cane-card-title">{cane.name}</h3>
          <p className="cane-card-wood">{cane.wood || 'Wood TBD'}</p>
          <div className="cane-card-meta">
            <span className="cane-card-price">
              {isDisplay ? 'Not for sale' : formatPrice(cane.price)}
            </span>
            <span className="cane-card-cta">
              {isDisplay
                ? 'View'
                : qty === 1
                  ? '1 available'
                  : 'View Details'}
            </span>
          </div>
        </div>
      </Link>
    </CardTag>
  );
}

export function CaneGrid({ canes }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="cane-grid">
      {canes.map((cane, index) => {
        if (reduceMotion) {
          return <CaneCard key={cane.id} cane={cane} />;
        }
        return (
          <motion.div
            key={cane.id}
            className="cane-grid-item"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: EASE_OUT }}
          >
            <CaneCard cane={cane} />
          </motion.div>
        );
      })}
    </div>
  );
}
