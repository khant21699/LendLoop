import { useEffect, useState } from "react";

// Returns `value` only after it has stopped changing for `delay` ms, so a
// request isn't fired on every keystroke.
export function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
