const STYLES = {
  pending: "bg-pending-bg text-pending-fg",
  approved: "bg-approved-bg text-approved-fg",
  declined: "bg-declined-bg text-declined-fg",
  returned: "bg-returned-bg text-returned-fg",
  overdue: "bg-overdue-bg text-overdue-fg",
} as const;

export type BadgeStatus = keyof typeof STYLES;

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
