export function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Star/Pin Icon */}
      <circle cx="16" cy="14" r="10" fill="#00E5A0" opacity="0.15" />
      <path
        d="M16 4l2.5 5.5L24 10.5l-4 4 1 5.5L16 17.5l-5 2.5 1-5.5-4-4 5.5-1L16 4z"
        fill="#00E5A0"
      />
      <path
        d="M16 20v8"
        stroke="#00E5A0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* "map" in white */}
      <text
        x="34"
        y="22"
        fontFamily="Space Grotesk, system-ui, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="#EEF1F5"
      >
        map
      </text>
      {/* "Scor" in green */}
      <text
        x="78"
        y="22"
        fontFamily="Space Grotesk, system-ui, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="#00E5A0"
      >
        Scor
      </text>
    </svg>
  );
}
