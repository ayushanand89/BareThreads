import { Link } from "react-router";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { Reveal, StaggerGroup, StaggerItem } from "../Common/Reveal";
import mensCollectionImage from "../../assets/mens-collection.webp";
import womensCollectionImage from "../../assets/womens-collection.webp";

const collections = [
  {
    img: womensCollectionImage,
    alt: "Women's Collection",
    title: "Women's Collection",
    sub: "Elevated essentials, reimagined",
    to: "/collections/all?gender=Women",
  },
  {
    img: mensCollectionImage,
    alt: "Men's Collection",
    title: "Men's Collection",
    sub: "Refined staples for every day",
    to: "/collections/all?gender=Men",
  },
];

const GenderCollectionSection = () => {
  return (
    <section className="py-20 px-4 lg:px-6">
      <div className="container mx-auto">
        <Reveal className="text-center mb-12">
          <div className="rule-gold w-12 mx-auto mb-4" />
          <p className="eyebrow mb-2">Curated For You</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink">
            Shop by Collection
          </h2>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-container">
          {collections.map((c) => (
            <StaggerItem
              key={c.title}
              className="group relative overflow-hidden rounded-2xl clip-2xl
                transition-all duration-500 ease-out
                hover:shadow-[var(--shadow-lift)] hover:-translate-y-1"
            >
              <Link
                to={c.to}
                className="block relative overflow-hidden rounded-2xl clip-2xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.alt}
                    className="w-full h-[420px] md:h-[620px] object-cover
                      transition-transform duration-[1100ms] ease-out group-hover:scale-110"
                  />
                </div>

                {/* depth gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />

                {/* content slides up on hover */}
                <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
                  <p className="text-cream/70 text-sm mb-1 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {c.sub}
                  </p>
                  <h3 className="font-display text-3xl lg:text-4xl font-semibold text-cream mb-3">
                    {c.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-cream text-sm font-semibold uppercase tracking-wide">
                    <span className="border-b border-cream/60 pb-0.5 group-hover:border-cream transition-colors">
                      Shop Now
                    </span>
                    <HiOutlineArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
