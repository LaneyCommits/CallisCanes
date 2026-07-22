import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './easing';

export default function PageTransition({ children }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
