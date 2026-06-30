import { useState } from "react";
import { HiStar } from "react-icons/hi2";

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

/**
 * StarRating
 *  - Display mode (default): shows a fractional star fill for averages (e.g. 4.7).
 *  - Interactive mode: pass `onChange` to let the user pick a whole-star rating.
 */
const StarRating = ({
  value = 0,
  onChange,
  size = "md",
  count,
  showValue = false,
  className = "",
}) => {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const cls = sizeMap[size] || sizeMap.md;

  if (interactive) {
    const active = hover || value;
    return (
      <div
        className={`inline-flex items-center gap-1 ${className}`}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHover(s)}
            aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
            className="cursor-pointer transition-transform duration-150 hover:scale-125 active:scale-95"
          >
            <HiStar
              className={`${cls} transition-colors ${
                s <= active ? "text-amber-400" : "text-ink/15"
              }`}
            />
          </button>
        ))}
      </div>
    );
  }

  // Display mode with fractional fill
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative inline-flex">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <HiStar key={s} className={`${cls} text-ink/15`} />
          ))}
        </div>
        <div
          className="absolute inset-0 flex gap-0.5 overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <HiStar key={s} className={`${cls} text-amber-400 shrink-0`} />
          ))}
        </div>
      </div>
      {showValue && value > 0 && (
        <span className="text-sm font-medium text-ink">{value.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-stone">
          {count > 0 ? `(${count})` : "No reviews"}
        </span>
      )}
    </div>
  );
};

export default StarRating;
