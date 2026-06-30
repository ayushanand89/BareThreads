// A bespoke generative backdrop — drifting gold orbs, woven thread lines,
// film grain and a vignette. Replaces a stock photo with brand-made art.
const EditorialBackdrop = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-noir">
      {/* Drifting glow orbs */}
      <div
        className="absolute -top-32 -left-24 w-[42rem] h-[42rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(198,161,91,0.20), transparent 70%)",
          animation: "orb-a 24s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/4 -right-40 w-[38rem] h-[38rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168,112,60,0.18), transparent 70%)",
          animation: "orb-b 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-40 left-1/3 w-[34rem] h-[34rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(227,207,159,0.12), transparent 70%)",
          animation: "orb-c 32s ease-in-out infinite",
        }}
      />

      {/* Woven thread lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 600"
        fill="none"
      >
        <g
          stroke="#c6a15b"
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeDasharray="6 10"
          style={{ animation: "thread-flow 40s linear infinite" }}
        >
          <path d="M-50 120 C 300 40, 900 200, 1250 90" />
          <path d="M-50 240 C 350 160, 850 320, 1250 220" />
          <path d="M-50 360 C 300 300, 900 440, 1250 360" />
          <path d="M-50 480 C 350 420, 850 540, 1250 470" />
        </g>
        <g stroke="#e3cf9f" strokeOpacity="0.1" strokeWidth="0.75">
          <path d="M200 -50 C 260 200, 160 400, 240 650" />
          <path d="M600 -50 C 660 200, 560 400, 640 650" />
          <path d="M1000 -50 C 1060 200, 960 400, 1040 650" />
        </g>
      </svg>

      {/* Film grain */}
      <div className="noise absolute inset-0 opacity-70" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.55))]" />
    </div>
  );
};

export default EditorialBackdrop;
