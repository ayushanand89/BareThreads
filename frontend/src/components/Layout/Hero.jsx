import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi2";
import MagneticButton from "../Common/MagneticButton";
import heroImg from "../../assets/barethreads-hero.webp";

const EASE = [0.22, 1, 0.36, 1];

const MotionP = motion.p;
const MotionSpan = motion.span;
const MotionDiv = motion.div;

const Hero = () => {
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        const top = sectionRef.current.getBoundingClientRect().top;
        setOffset(Math.max(-120, -top * 0.18));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden h-[88vh] min-h-[560px] max-h-[920px]"
    >
      {/* Parallax + Ken Burns image layer */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      >
        <img
          src={heroImg}
          alt="BareThreads"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
      </div>

      {/* Depth layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent_0%,rgba(22,20,19,0.4)_100%)]" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl text-cream">
            <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="eyebrow text-accent-soft mb-5"
            >
              New Season · 2026
            </MotionP>

            <h1 className="text-hero font-display font-semibold mb-6">
              {["Vacation", "Ready"].map((word, i) => (
                <span
                  key={word}
                  className="block overflow-hidden pb-[0.3em] -mb-[0.24em]"
                >
                  <MotionSpan
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.15 + i * 0.12,
                      ease: EASE,
                    }}
                    className={`inline-block pr-[0.08em] ${
                      i === 1 ? "italic text-accent-soft" : ""
                    }`}
                  >
                    {word}
                  </MotionSpan>
                </span>
              ))}
            </h1>

            <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="text-base md:text-lg text-cream/85 mb-9 max-w-md"
            >
              Explore our vacation-ready edit — elevated essentials with fast,
              reliable worldwide shipping.
            </MotionP>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton>
                <Link
                  to="/collections/all"
                  className="btn-primary bg-cream text-ink hover:bg-white group"
                >
                  Shop the Collection
                  <HiOutlineArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/collections/all?gender=Women"
                  className="btn-outline border-cream/50 text-cream hover:bg-cream hover:text-ink"
                >
                  Women's New In
                </Link>
              </MagneticButton>
            </MotionDiv>
          </div>
        </div>
      </div>

      {/* Floating glass trust badge */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        className="hidden lg:flex absolute bottom-12 right-12"
      >
        <div className="bg-cream/10 backdrop-blur-md border border-cream/20 rounded-2xl px-6 py-4 text-cream shadow-2xl animate-float">
          <p className="font-display text-3xl font-semibold">10k+</p>
          <p className="text-xs uppercase tracking-widest text-cream/70">
            Happy Customers
          </p>
        </div>
      </MotionDiv>

      {/* Scroll cue */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-cream/60"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <MotionSpan
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-cream/60 origin-top"
        />
      </MotionDiv>
    </section>
  );
};

export default Hero;
