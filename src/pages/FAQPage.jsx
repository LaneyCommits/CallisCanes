import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getFaqs } from '../data';
import { Stagger, StaggerItem } from '../components/motion';
import { EASE_OUT } from '../components/motion/easing';

function FaqItem({ faq, isOpen, onToggle }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`faq-item depth-card ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {faq.question}
        <motion.span
          aria-hidden="true"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-answer"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            style={{ overflow: 'hidden' }}
          >
            <p>{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const faqs = getFaqs();
  const [openId, setOpenId] = useState(null);

  return (
    <section className="section depth-section">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="page-intro">
          <h1 className="section-title">FAQ</h1>
          <p className="section-subtitle">
            Shipping, payment, engraving, timelines, wood species, returns, and care.
          </p>
        </div>

        {faqs.length === 0 ? (
          <p className="empty-state">FAQs will appear here once added to faq.json.</p>
        ) : (
          <Stagger stagger={0.06}>
            {faqs.map((faq) => (
              <StaggerItem key={faq.id}>
                <FaqItem
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
