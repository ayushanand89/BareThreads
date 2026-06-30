import { Link } from "react-router";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { ParallaxImage } from "../Common/Parallax";
import { Reveal } from "../Common/Reveal";
import imgA from "../../assets/womens-collection.webp";
import imgB from "../../assets/shop_men.png";
import imgC from "../../assets/register.webp";

const Lookbook = () => {
  return (
    <section className="py-24 lg:py-32 px-4 lg:px-6 overflow-hidden">
      <div className="container mx-auto">
        {/* Heading */}
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="eyebrow mb-2">Lookbook · Vol. 01</p>
            <h2 className="font-display text-4xl md:text-6xl font-semibold text-ink leading-none">
              The Resort Edit
            </h2>
          </div>
          <Link
            to="/collections/all"
            className="group inline-flex items-center gap-2 text-ink text-sm font-semibold uppercase tracking-[0.15em] self-start md:self-auto"
          >
            <span className="link-underline pb-1">View All</span>
            <HiOutlineArrowRight className="text-accent transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </Reveal>

        {/* Editorial collage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Tall hero image */}
          <div className="md:col-span-7">
            <Link to="/collections/all?gender=Women" className="group block">
              <div className="relative rounded-2xl overflow-hidden clip-2xl">
                <ParallaxImage
                  src={imgA}
                  alt="Women's resort looks"
                  className="h-[460px] md:h-[680px] rounded-2xl"
                  strength={70}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-gold text-xs uppercase tracking-[0.2em] mb-2">
                    Featured
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl text-cream font-semibold mb-1">
                    Sun-Soaked Silhouettes
                  </h3>
                  <span className="inline-flex items-center gap-2 text-cream text-sm font-medium uppercase tracking-wide opacity-90 group-hover:gap-3 transition-all">
                    Shop Women <HiOutlineArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Stacked right column, offset down for editorial rhythm */}
          <div className="md:col-span-5 md:mt-16 space-y-6">
            <Reveal direction="left" delay={0.1}>
              <div className="bg-white border border-ink/8 rounded-2xl p-8 shadow-[var(--shadow-card)]">
                <p className="font-display text-5xl text-accent mb-2">01</p>
                <h3 className="font-heading font-semibold text-ink uppercase tracking-wide mb-2">
                  Considered Craft
                </h3>
                <p className="text-stone text-sm leading-relaxed">
                  Natural fabrics, refined cuts, and a palette built to layer
                  effortlessly through the season.
                </p>
              </div>
            </Reveal>

            <Link to="/collections/all?gender=Men" className="group block">
              <div className="relative rounded-2xl overflow-hidden clip-2xl">
                <ParallaxImage
                  src={imgB}
                  alt="Men's resort looks"
                  className="h-[300px] md:h-[360px] rounded-2xl"
                  strength={50}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-display text-2xl text-cream font-semibold">
                    City to Shore
                  </h3>
                  <span className="inline-flex items-center gap-2 text-cream text-xs font-medium uppercase tracking-wide group-hover:gap-3 transition-all">
                    Shop Men <HiOutlineArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Wide bottom strip */}
        <Reveal className="mt-6">
          <Link to="/collections/all" className="group block">
            <div className="relative rounded-2xl overflow-hidden">
              <ParallaxImage
                src={imgC}
                alt="The full collection"
                className="h-[280px] md:h-[400px] rounded-2xl"
                strength={60}
              />
              <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-gold text-xs uppercase tracking-[0.25em] mb-3">
                  Now Available
                </p>
                <h3 className="font-display text-3xl md:text-5xl text-cream font-semibold mb-4">
                  Explore the Full Collection
                </h3>
                <span className="btn-primary bg-cream text-ink group-hover:bg-white">
                  Shop Everything
                  <HiOutlineArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default Lookbook;
