import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useRef } from "react";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { IoClose } from "react-icons/io5";
import { Reveal } from "../components/Common/Reveal";
import { useParams, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  // Active filter chips (excludes sort/min-price plumbing)
  const chips = [];
  for (const [key, value] of searchParams.entries()) {
    if (key === "sortBy" || key === "minPrice") continue;
    if (key === "maxPrice") {
      if (Number(value) < 100) chips.push({ key, value, label: `Under $${value}` });
      continue;
    }
    value.split(",").forEach((v) =>
      v ? chips.push({ key, value: v, label: v }) : null
    );
  }

  const removeChip = (key, value) => {
    const params = new URLSearchParams(searchParams);
    const current = params.get(key);
    if (current) {
      const remaining = current.split(",").filter((v) => v !== value);
      if (remaining.length) params.set(key, remaining.join(","));
      else params.delete(key);
    }
    if (key === "maxPrice") params.delete("minPrice");
    setSearchParams(params);
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    const sort = searchParams.get("sortBy");
    if (sort) params.set("sortBy", sort);
    setSearchParams(params);
  };

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => setIsSidebarOpen((o) => !o);

  // Lock body scroll when the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <Reveal>
          <p className="eyebrow mb-1.5">Shop The Edit</p>
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-ink">
            All Collections
          </h2>
          {!loading && Array.isArray(products) && (
            <p className="text-stone text-sm mt-2">
              {products.length} {products.length === 1 ? "item" : "items"}
            </p>
          )}
        </Reveal>

        <div className="flex items-center gap-3">
          {/* Mobile filter trigger */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden inline-flex items-center gap-2 border border-ink/15 bg-white
              px-4 py-2.5 rounded-lg text-sm font-medium text-ink hover:bg-sand transition-colors"
          >
            <FaFilter className="text-accent text-xs" /> Filters
          </button>
          <SortOptions />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar: mobile drawer + desktop sticky column */}
        <aside
          ref={sidebarRef}
          className={`
            fixed lg:sticky top-0 lg:top-28 left-0 z-50 lg:z-auto
            h-full lg:h-auto w-[18rem] shrink-0 lg:self-start
            bg-white lg:bg-transparent
            shadow-2xl lg:shadow-none
            overflow-y-auto lg:max-h-[calc(100vh-8rem)] hide-scrollbar
            transition-transform duration-300 ease-in-out
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          {/* Mobile drawer header */}
          <div className="flex lg:hidden items-center justify-between p-5 border-b border-ink/10 sticky top-0 bg-white z-10">
            <span className="font-heading font-semibold uppercase tracking-wide text-ink">
              Filters
            </span>
            <button onClick={toggleSidebar} aria-label="Close filters">
              <IoMdClose className="h-6 w-6 text-charcoal hover:text-ink" />
            </button>
          </div>

          <FilterSidebar onApply={() => setIsSidebarOpen(false)} />
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {chips.map((chip) => (
                <button
                  key={`${chip.key}-${chip.value}`}
                  onClick={() => removeChip(chip.key, chip.value)}
                  className="group inline-flex items-center gap-1.5 bg-white border border-ink/15 rounded-full pl-3 pr-2 py-1.5 text-xs font-medium text-charcoal hover:border-ink transition-colors"
                >
                  {chip.label}
                  <IoClose className="h-3.5 w-3.5 text-stone group-hover:text-ink transition-colors" />
                </button>
              ))}
              <button
                onClick={clearAll}
                className="text-xs font-medium text-accent hover:text-accent-dark underline underline-offset-2 ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
