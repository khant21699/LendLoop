import { Category } from "@/convex/lib/categories";

// One stroke weight, one 24px grid: the part symbols on the sheet.
const PATHS: Record<Category, string> = {
  "Power tools": "M3 8h12v5H3z M15 9.5h5 M15 11.5h5 M7 13v7h3.5v-7",
  "Hand tools": "M4.5 19.5l8-8 M10 7l3-3 7 7-3 3z",
  Garden:
    "M12 21v-8 M12 13c0-4-3-6-7-6 0 4 3 6 7 6z M12 15c0-3 2-5 6-5 0 3-2 5-6 5z",
  Kitchen:
    "M5 11h14v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z M3 11h18 M12 11V8 M10 8h4",
  Camping: "M3 20L12 4l9 16z M9 20l3-7 3 7",
  Cleaning: "M5 8h14l-1.5 12h-11z M5 8c0-2 3-3 7-3s7 1 7 3 M8 5c0-2 8-2 8 0",
  Other: "M4 8l8-4 8 4v8l-8 4-8-4z M4 8l8 4 8-4 M12 12v8",
};

export function CategoryIcon({
  category,
  size = 24,
}: {
  category: Category;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[category]} />
    </svg>
  );
}
