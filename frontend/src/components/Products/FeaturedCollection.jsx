import { Link } from "react-router";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { Reveal } from "../Common/Reveal";
import { ParallaxImage } from "../Common/Parallax";
import featured from "../../assets/featured.webp";

const FeaturedCollection = () => {
  return (
    <section className="py-20 px-4 lg:px-6">
      <Reveal className="container mx-auto flex flex-col-reverse lg:flex-row items-stretch bg-white border border-ink/8 rounded-3xl overflow-hidden clip-3xl shadow-[var(--shadow-soft)]">
        {/* Left Content */}
        <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center text-center lg:text-left">
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
            <span className="rule-gold w-10" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">
              Comfort & Style
            </p>
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-semibold text-ink leading-tight mb-5">
            Apparel made for your everyday life
          </h2>
          <p className="text-stone text-base lg:text-lg mb-8 max-w-md mx-auto lg:mx-0">
            Discover high-quality, comfortable clothing that effortlessly blends
            fashion and function — designed to make you look and feel great every
            day.
          </p>
          <div>
            <Link to="/collections/all" className="btn-primary group/btn">
              Shop Now
              <HiOutlineArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Image — parallax drift */}
        <ParallaxImage
          src={featured}
          alt="Featured Collection"
          className="lg:w-1/2 w-full min-h-[320px]"
          strength={50}
        />
      </Reveal>
    </section>
  );
};

export default FeaturedCollection;
