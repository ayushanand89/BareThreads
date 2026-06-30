import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const dirOffset = {
  up: { y: 42 },
  down: { y: -42 },
  left: { x: 42 },
  right: { x: -42 },
  none: {},
};

// Scroll-triggered reveal
export const Reveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.75,
  className = "",
  once = true,
  amount = 0.2,
  as = "div",
}) => {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...dirOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
};

// Stagger container — children using <StaggerItem> animate in sequence
export const StaggerGroup = ({
  children,
  className = "",
  stagger = 0.09,
  once = true,
  amount = 0.2,
  delayChildren = 0.05,
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once, amount }}
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: stagger, delayChildren } },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "", direction = "up" }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, ...dirOffset[direction] },
      show: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.65, ease: EASE },
      },
    }}
  >
    {children}
  </motion.div>
);

export { EASE };
