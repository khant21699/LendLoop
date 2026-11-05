// The title block that closes every drawing sheet.
const CELLS = [
  { label: "Project", value: "LendLoop" },
  { label: "Drawn by", value: "Your neighbors" },
  { label: "Scale", value: "1:1, borrow responsibly" },
  { label: "Rev.", value: "A" },
];

export function SheetFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <dl className="mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4">
        {CELLS.map((cell) => (
          <div
            key={cell.label}
            className="border-b border-border px-4 py-3 sm:border-b-0 sm:border-r last:border-r-0 sm:px-6"
          >
            <dt className="data">{cell.label}</dt>
            <dd className="mt-1 text-sm font-medium">{cell.value}</dd>
          </div>
        ))}
      </dl>
    </footer>
  );
}
