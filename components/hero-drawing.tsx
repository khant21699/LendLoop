// A hammer, drawn as a drafting sheet would: orthographic, with dimension
// lines and one callout. Decorative, so hidden from assistive tech.
export function HeroDrawing() {
  return (
    <svg
      viewBox="0 0 420 330"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="draw-in w-full max-w-sm text-link"
    >
      {/* head */}
      <path
        pathLength={1}
        d="M80 60h160a10 10 0 0 1 10 10v36a10 10 0 0 1-10 10H80z"
      />
      {/* claw */}
      <path pathLength={1} d="M80 60c-34 4-56 24-66 46 24 4 44 4 66 0" />
      {/* striking face line */}
      <path pathLength={1} d="M226 60v56" />
      {/* handle */}
      <path pathLength={1} d="M150 116v170q0 16 20 16t20-16V116" />
      {/* grain */}
      <path
        pathLength={1}
        d="M164 140v110M176 160v100"
        strokeWidth={1}
        opacity={0.6}
      />
      {/* width dimension */}
      <path pathLength={1} d="M80 36h170M80 28v16M250 28v16" strokeWidth={1} />
      {/* height dimension */}
      <path
        pathLength={1}
        d="M380 60v242M372 60h16M372 302h16"
        strokeWidth={1}
      />
      {/* callout */}
      <path pathLength={1} d="M250 88l40 40h46" strokeWidth={1} />
      <g
        fill="currentColor"
        stroke="none"
        fontFamily="var(--font-geist-mono)"
        fontSize="11"
      >
        <text x="140" y="24" textAnchor="middle">
          a weekend
        </text>
        <text x="306" y="150">
          borrow me
        </text>
        <text x="352" y="188" transform="rotate(90 352 188)">
          still perfectly good
        </text>
      </g>
    </svg>
  );
}
