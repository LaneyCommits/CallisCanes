export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.4, 0, 0.2, 1];

export const spring = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
};

export const revealTransition = (delay = 0) => ({
  duration: 0.65,
  delay,
  ease: EASE_OUT,
});
