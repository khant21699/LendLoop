const STYLES = {
  pending: "bg-pending-bg text-pending-fg",
  approved: "bg-approved-bg text-approved-fg",
  declined: "bg-declined-bg text-declined-fg",
  returned: "bg-returned-bg text-returned-fg",
  cancelled: "bg-returned-bg text-returned-fg",
  overdue: "bg-overdue-bg text-overdue-fg",
  // Tool availability reuses the approved / returned colors.
  available: "bg-approved-bg text-approved-fg",
  onloan: "bg-returned-bg text-returned-fg",
  trusted: "bg-trusted-bg text-trusted-fg",
} as const;

export type BadgeStatus = keyof typeof STYLES;

// An ink stamp: small mono caps with a hairline ring.
export function StatusBadge({
  status,
  label,
}: {
  status: BadgeStatus;
  label?: string;
}) {
  return (
    <span
      className={`inline-block shrink-0 rounded-sm px-2 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] ring-1 ring-inset ring-current/25 ${STYLES[status]}`}
    >
      {label ?? status}
    </span>
  );
}
