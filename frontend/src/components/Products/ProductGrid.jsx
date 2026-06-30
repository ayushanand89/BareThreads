import { useRef } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { ProductGridSkeleton } from "../Common/Skeletons";
import StarRating from "../Common/StarRating";
import { hiRes } from "../../utils/imageUrl";

const MotionDiv = motion.div;

/* ---- Single card with mouse-tracking 3D tilt ---- */
const ProductCard = ({ product, index }) => {
  const cardRef = useRef(null);

  const primary = hiRes(product.images?.[0]?.url, 700);
  const secondary = hiRes(product.images?.[1]?.url, 700);
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${
      -y * 8
    }deg) translateZ(0)`;
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    // Clear the transform entirely so the card drops its GPU composite layer
    // and images render crisply at full resolution again.
    el.style.transform = "";
  };

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: (index % 4) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
    <Link
      to={`/product/${product._id}`}
      className="group block"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative w-full aspect-[3/4] overflow-hidden clip-card rounded-xl bg-sand mb-3.5
          transition-[transform,box-shadow] duration-300 ease-out
          group-hover:shadow-[var(--shadow-lift)]"
      >
        <img
          src={primary}
          alt={product.images?.[0]?.altText || product.name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-110 ${
            secondary ? "group-hover:opacity-0" : ""
          }`}
          draggable="false"
        />
        {secondary && (
          <img
            src={secondary}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover scale-105 opacity-0 transition-all duration-[900ms] ease-out group-hover:opacity-100 group-hover:scale-110"
            draggable="false"
          />
        )}

        {/* darken gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Sale badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg z-10">
            -{discountPct}%
          </span>
        )}

        {/* Quick-shop pill rising from bottom */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-6 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex items-center justify-center gap-2 bg-cream/95 backdrop-blur-sm text-ink text-xs font-semibold uppercase tracking-wider py-3 rounded-lg shadow-lg">
            View Product
            <HiOutlineArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>

      <h3 className="text-sm text-ink font-medium leading-snug line-clamp-1 group-hover:text-accent transition-colors">
        {product.name}
      </h3>
      {product.numReviews > 0 && (
        <div className="mt-1">
          <StarRating value={product.rating} size="sm" count={product.numReviews} />
        </div>
      )}
      <div className="mt-1 flex items-center gap-2">
        {hasDiscount ? (
          <>
            <span className="text-sm font-semibold text-ink">
              ${product.discountPrice}
            </span>
            <span className="text-xs text-stone line-through">
              ${product.price}
            </span>
          </>
        ) : (
          <span className="text-sm font-medium text-charcoal">
            ${product.price}
          </span>
        )}
      </div>
    </Link>
    </MotionDiv>
  );
};

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-danger font-medium">Couldn't load products</p>
        <p className="text-stone text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-ink font-heading text-lg">No products found</p>
        <p className="text-stone text-sm mt-1">
          Try adjusting your filters or search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
