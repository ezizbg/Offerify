/**
 * SVG spinner with SMIL animateTransform.
 * Completely immune to CSS prefers-reduced-motion rules,
 * disabled button state, and !important cascade conflicts.
 */
export default function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Faint track circle */}
      <circle
        cx="7"
        cy="7"
        r="5.5"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="2"
      />
      {/* Rotating bright arc */}
      <path
        d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 7 7"
          to="360 7 7"
          dur="0.65s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
