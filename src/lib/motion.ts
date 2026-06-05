import type { Transition, Variants } from "framer-motion";

export const easeOut = [0.25, 0.1, 0.25, 1] as const;

export const transitionFast: Transition = {
  duration: 0.2,
  ease: easeOut,
};

export const transitionBase: Transition = {
  duration: 0.28,
  ease: easeOut,
};

/** Subtle spring bounce for list items and fades. */
export const springBounceSoft: Transition = {
  type: "spring",
  stiffness: 360,
  damping: 28,
  mass: 0.85,
};

/** Pronounced spring bounce for panels and page transitions. */
export const springBounce: Transition = {
  type: "spring",
  stiffness: 480,
  damping: 24,
  mass: 0.8,
};

export const springBounceEnter: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 22,
  mass: 0.75,
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springBounceEnter,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: transitionFast,
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springBounceSoft,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springBounceSoft,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springBounce,
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.02,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springBounceSoft,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springBounce,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitionFast,
  },
};

export const drawerSlide: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: springBounce,
  },
  exit: {
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 32,
    },
  },
};

export const listItemExit: Variants = {
  visible: { opacity: 1, x: 0, height: "auto" },
  exit: {
    opacity: 0,
    x: 16,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: { duration: 0.18, ease: easeOut },
  },
};
