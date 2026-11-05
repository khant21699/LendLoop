"use client";

import { useSyncExternalStore } from "react";
import { useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/page-header";

const THEMES = [
  { value: "system", label: "Match my device" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { openUserProfile } = useClerk();
  // The saved theme is unknown on the server; wait for the client so the
  // selected button doesn't flash or mismatch during hydration.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title="Settings">
        Make the board look the way you like it.
      </PageHeader>

      <section className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight">Appearance</h2>
        <div
          role="group"
          aria-label="Theme"
          className="mt-4 inline-flex border border-border bg-surface"
        >
          {THEMES.map((option) => {
            const selected = mounted && theme === option.value;
            return (
              <button
                key={option.value}
                aria-pressed={selected}
                onClick={() => setTheme(option.value)}
                className={`h-10 cursor-pointer border-r border-border px-4 text-sm font-medium last:border-r-0 ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "hover:text-link"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Account</h2>
        <p className="mt-2 max-w-prose text-muted">
          Change your name, email, password or connected accounts.
        </p>
        <button
          onClick={() => openUserProfile()}
          className="btn btn-outline mt-4"
        >
          Manage account
        </button>
      </section>
    </main>
  );
}
