import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { HiChevronDown, HiCheck } from "react-icons/hi2";

const options = [
  { value: "", label: "Default" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDsc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
];

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = searchParams.get("sortBy") || "";
  const currentLabel =
    options.find((o) => o.value === current)?.label || "Default";

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (value) => {
    if (value) searchParams.set("sortBy", value);
    else searchParams.delete("sortBy");
    setSearchParams(searchParams);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative shrink-0 z-20">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 bg-white border border-ink/15 rounded-lg pl-4 pr-3 py-2.5
          text-sm text-ink min-w-[12rem] justify-between
          transition-all duration-200 hover:border-ink focus:outline-none focus:ring-1 focus:ring-ink/20"
      >
        <span className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone">
            Sort
          </span>
          <span className="font-medium">{currentLabel}</span>
        </span>
        <HiChevronDown
          className={`text-stone transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white border border-ink/10 rounded-xl
            shadow-[var(--shadow-soft)] overflow-hidden origin-top-right animate-fade-in"
          style={{ animationDuration: "0.18s" }}
        >
          {options.map((o) => {
            const active = current === o.value;
            return (
              <button
                key={o.value}
                onClick={() => select(o.value)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left
                  transition-colors duration-150 ${
                    active
                      ? "bg-accent-soft text-ink font-medium"
                      : "text-charcoal hover:bg-cream"
                  }`}
              >
                {o.label}
                {active && <HiCheck className="text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortOptions;
