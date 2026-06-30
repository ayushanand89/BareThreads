import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router";
import { axiosInstance } from "../../utils/axios";
import { hiRes } from "../../utils/imageUrl";
import StarRating from "../Common/StarRating";
import { Reveal } from "../Common/Reveal";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axiosInstance.get(`/products/new-arrivals`);
        setNewArrivals(response.data.data);
      } catch (error) {
        console.error("Failed to load new arrivals:", error);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  //Update Scroll Buttons
  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth; //boolean value

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  return (
    <section className="py-20 px-4 lg:px-6">
      <div className="container mx-auto text-center mb-12 relative">
        <Reveal>
          <p className="eyebrow mb-2">Fresh Off The Runway</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink mb-4">
            Explore New Arrivals
          </h2>
          <p className="text-stone max-w-xl mx-auto">
            Discover the latest styles, freshly added to keep your wardrobe
            ahead of the trends.
          </p>
        </Reveal>

        {/* Scroll Buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`p-2.5 rounded-full border transition-colors ${
              canScrollLeft
                ? "bg-white text-ink border-ink/20 hover:bg-ink hover:text-cream"
                : "bg-sand text-stone/50 border-transparent cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`p-2.5 rounded-full border transition-colors ${
              canScrollRight
                ? "bg-white text-ink border-ink/20 hover:bg-ink hover:text-cream"
                : "bg-sand text-stone/50 border-transparent cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-xl" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative hide-scrollbar ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {Array.isArray(newArrivals) && newArrivals?.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="group min-w-[100%] sm:min-w-[50%] lg:min-w-[32%] relative overflow-hidden rounded-2xl clip-2xl
              transition-all duration-500 ease-out hover:shadow-[var(--shadow-lift)]"
            onClick={(e) => {
              if (isDragging) e.preventDefault();
            }}
          >
            <img
              src={hiRes(product.images[0]?.url, 900)}
              alt={product.images[0]?.altText || product.name}
              className="w-full h-[500px] object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
              draggable="false"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-cream translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
              <h4 className="font-heading font-semibold text-lg">
                {product.name}
              </h4>
              {product.numReviews > 0 && (
                <div className="mt-1">
                  <StarRating value={product.rating} size="sm" />
                </div>
              )}
              <p className="mt-1 text-cream/80">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
