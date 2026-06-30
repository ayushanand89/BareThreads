import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const MotionImg = motion.img;
const MotionDiv = motion.div;

// An image that drifts vertically as the section scrolls through the viewport.
export const ParallaxImage = ({
  src,
  alt = "",
  className = "",
  strength = 80,
  scale = 1.15,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <MotionImg
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="w-full h-full object-cover will-change-transform"
        draggable="false"
      />
    </div>
  );
};

// Generic layer that moves at a fraction of scroll speed.
export const ParallaxLayer = ({ children, strength = 60, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  return (
    <div ref={ref} className={className}>
      <MotionDiv style={{ y }}>{children}</MotionDiv>
    </div>
  );
};
