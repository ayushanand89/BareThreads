import { motion, useScroll, useSpring } from "framer-motion";

const MotionDiv = motion.div;

// Thin accent bar at the very top that tracks page scroll progress.
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  return (
    <MotionDiv
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-dark to-accent origin-left z-[100]"
    />
  );
};

export default ScrollProgress;
