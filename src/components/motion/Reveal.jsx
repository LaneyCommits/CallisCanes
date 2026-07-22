import { motion, useReducedMotion } from 'framer-motion';
import { revealTransition, EASE_OUT } from './easing';

const presets = {
  up: { hidden: { opacity: 0, y: 36, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1 } },
  down: { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
};

export default function Reveal({
  children,
  className,
  delay = 0,
  duration,
  variant = 'up',
  once = true,
  as = 'div',
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] ?? motion.div;
  const preset = presets[variant] ?? presets.up;

  if (reduceMotion) {
    const Tag = as === 'div' ? 'div' : as;
    return <Tag className={className} {...props}>{children}</Tag>;
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={preset}
      transition={{
        duration: duration ?? 0.65,
        delay,
        ease: EASE_OUT,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function RevealOnMount({
  children,
  className,
  delay = 0,
  variant = 'up',
  as = 'div',
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] ?? motion.div;
  const preset = presets[variant] ?? presets.up;

  if (reduceMotion) {
    const Tag = as === 'div' ? 'div' : as;
    return <Tag className={className} {...props}>{children}</Tag>;
  }

  return (
    <Component
      className={className}
      initial="hidden"
      animate="visible"
      variants={preset}
      transition={revealTransition(delay)}
      {...props}
    >
      {children}
    </Component>
  );
}
