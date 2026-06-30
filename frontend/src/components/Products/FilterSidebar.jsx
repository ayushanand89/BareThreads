import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";

const Section = ({ title, children }) => (
  <div className="py-5 border-b border-ink/8 last:border-0">
    <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-stone mb-3">
      {title}
    </h4>
    {children}
  </div>
);

const FilterSidebar = ({ onApply }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 100]);
  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ];
  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "Fashionista",
    "ChicStyle",
  ];
  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters((prev) => ({
      ...prev,
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice ? parseInt(params.minPrice) : 0,
      maxPrice: params.maxPrice ? parseInt(params.maxPrice) : 100,
    }));
    setPriceRange([0, params.maxPrice ? parseInt(params.maxPrice) : 100]);
  }, [searchParams]);

  // Count of active filters (for the header badge)
  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.gender ? 1 : 0) +
    (filters.color ? 1 : 0) +
    filters.size.length +
    filters.material.length +
    filters.brand.length +
    (filters.maxPrice < 100 ? 1 : 0);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const clearAll = () => {
    const reset = {
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 100,
    };
    setFilters(reset);
    setPriceRange([0, 100]);
    setSearchParams(new URLSearchParams());
    navigate(location.pathname);
  };

  return (
    <div className="px-5 lg:px-0 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-5 pb-4 border-b border-ink/10">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-base font-semibold uppercase tracking-wide text-ink">
            Filter
          </h3>
          {activeCount > 0 && (
            <span className="bg-ink text-cream text-[10px] font-semibold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-accent hover:text-accent-dark underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <Section title="Category">
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                value={category}
                onChange={handleFilterChange}
                checked={filters.category === category}
                className="h-4 w-4"
              />
              <span className="text-sm text-charcoal group-hover:text-ink transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Gender */}
      <Section title="Gender">
        <div className="space-y-2">
          {genders.map((gender) => (
            <label
              key={gender}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="gender"
                value={gender}
                onChange={handleFilterChange}
                checked={filters.gender === gender}
                className="h-4 w-4"
              />
              <span className="text-sm text-charcoal group-hover:text-ink transition-colors">
                {gender}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Color */}
      <Section title="Color">
        <div className="flex flex-wrap gap-2.5">
          {colors.map((color) => (
            <button
              key={color}
              name="color"
              value={color}
              onClick={handleFilterChange}
              aria-label={color}
              title={color}
              className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md ${
                filters.color === color
                  ? "ring-2 ring-offset-2 ring-ink scale-110"
                  : "ring-1 ring-ink/15"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            ></button>
          ))}
        </div>
      </Section>

      {/* Size */}
      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const active = filters.size.includes(size);
            return (
              <label
                key={size}
                className={`px-3.5 py-1.5 rounded-md border text-sm font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                  active
                    ? "bg-ink text-cream border-ink"
                    : "bg-white text-charcoal border-ink/15 hover:border-ink"
                }`}
              >
                <input
                  type="checkbox"
                  name="size"
                  value={size}
                  onChange={handleFilterChange}
                  checked={active}
                  className="sr-only"
                />
                {size}
              </label>
            );
          })}
        </div>
      </Section>

      {/* Material */}
      <Section title="Material">
        <div className="space-y-2">
          {materials.map((material) => (
            <label
              key={material}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                name="material"
                value={material}
                onChange={handleFilterChange}
                checked={filters.material.includes(material)}
                className="h-4 w-4"
              />
              <span className="text-sm text-charcoal group-hover:text-ink transition-colors">
                {material}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Brand */}
      <Section title="Brand">
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                name="brand"
                value={brand}
                onChange={handleFilterChange}
                checked={filters.brand.includes(brand)}
                className="h-4 w-4"
              />
              <span className="text-sm text-charcoal group-hover:text-ink transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section title="Price Range">
        <input
          type="range"
          name="priceRange"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-sm mt-2.5">
          <span className="text-stone">$0</span>
          <span className="font-semibold text-ink">${priceRange[1]}</span>
        </div>
      </Section>

      {/* Mobile apply button */}
      {onApply && (
        <button onClick={onApply} className="btn-primary w-full mt-6 lg:hidden">
          Show Results
        </button>
      )}
    </div>
  );
};

export default FilterSidebar;
