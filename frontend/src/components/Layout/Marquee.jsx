const items = [
  "Free Worldwide Shipping",
  "45-Day Easy Returns",
  "Ethically Crafted",
  "Premium Fabrics",
  "Secure Checkout",
  "New Drops Weekly",
];

const Marquee = () => {
  return (
    <div className="bg-ink text-cream py-4 overflow-hidden border-y border-cream/10">
      <div className="flex whitespace-nowrap marquee-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
            {items.map((t) => (
              <span key={t} className="flex items-center">
                <span className="px-8 text-sm uppercase tracking-[0.2em] font-medium text-cream/90">
                  {t}
                </span>
                <span className="text-gold text-lg">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
