import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './easing';

export function Stagger({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  once = true,
  when = 'inView',
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  if (when === 'mount') {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px', amount: 0.15 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, y = 28, index }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants = {
    hidden: { opacity: 0, y, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: EASE_OUT },
    },
  };

  if (index != null) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, delay: index * 0.09, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
}
