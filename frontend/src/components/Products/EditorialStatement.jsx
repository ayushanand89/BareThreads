import { Link } from "react-router";
import { motion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi2";
import EditorialBackdrop from "../Common/EditorialBackdrop";

const MotionSpan = motion.span;
const MotionDiv = motion.div;
const MotionP = motion.p;

const EASE = [0.22, 1, 0.36, 1];

const lines = ["Designed to move", "with the way", "you actually live."];

const EditorialStatement = () => {
  return (
    <section className="relative bg-noir overflow-hidden">
      {/* Bespoke generative backdrop */}
      <EditorialBackdrop />

      <div className="relative container mx-auto px-6 lg:px-12 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <MotionP
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-gold mb-5"
          >
            The BareThreads Philosophy
          </MotionP>

          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-medium text-cream leading-[1.08]">
            {lines.map((line, i) => (
              <MotionSpan
                key={line}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                className={`block ${
                  i === 2 ? "italic text-gold-gradient pb-[0.12em]" : ""
                }`}
              >
                {line}
              </MotionSpan>
            ))}
          </h2>

          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-7 flex flex-col items-center gap-5"
          >
            <div className="rule-gold w-24" />
            <p className="text-cream/70 max-w-xl leading-relaxed">
              Every piece is considered — from the weight of the fabric to the
              fall of a hem. Quiet luxury, made for the everyday and built to
              last well beyond the season.
            </p>
            <Link
              to="/collections/all"
              className="group inline-flex items-center gap-2 text-cream text-sm font-semibold uppercase tracking-[0.15em]"
            >
              <span className="link-underline pb-1">Discover the Edit</span>
              <HiOutlineArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5 text-gold" />
            </Link>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default EditorialStatement;
