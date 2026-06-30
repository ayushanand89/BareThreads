import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  fetchProductsByFilters,
  setFilters,
} from "../../redux/slices/productSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchToggle = () => setIsOpen((o) => !o);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${encodeURIComponent(searchTerm)}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={handleSearchToggle}
        aria-label="Search"
        className="text-charcoal hover:text-ink transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <HiMagnifyingGlass className="h-6 w-6" />
      </button>

      {/* Full-width search overlay — portaled to <body> so it isn't trapped
          inside the header's backdrop-filter containing block */}
      {createPortal(
        <div
          className={`fixed inset-x-0 top-0 z-[60] bg-cream/95 backdrop-blur-xl border-b border-ink/10 shadow-[var(--shadow-soft)] transition-all duration-300 ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
        <form
          onSubmit={handleSearch}
          className="container mx-auto flex items-center gap-3 px-4 lg:px-6 h-20 md:h-24"
        >
          <HiMagnifyingGlass className="h-5 w-5 text-stone shrink-0" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus={isOpen}
            className="flex-1 min-w-0 bg-transparent text-base md:text-lg text-ink placeholder:text-stone/60 focus:outline-none"
          />
          <button
            type="submit"
            className="hidden sm:inline-flex btn-primary py-2 px-5 text-sm"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleSearchToggle}
            aria-label="Close search"
            className="shrink-0 text-charcoal hover:text-ink transition-transform hover:rotate-90 duration-300"
          >
            <HiMiniXMark className="h-7 w-7" />
          </button>
        </form>
        </div>,
        document.body
      )}
    </>
  );
};

export default SearchBar;
