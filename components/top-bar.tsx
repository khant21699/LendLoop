"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function UserIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </svg>
  );
}

export function TopBar() {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border px-4 sm:px-6">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        LendLoop
      </Link>
      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />
        <Suspense>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-text hover:text-link font-medium text-sm sm:text-base cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-primary hover:bg-primary-hover text-primary-foreground transition-colors rounded-full font-medium text-sm sm:text-base h-10 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  userButtonPopoverActionButton__manageAccount: "hidden!",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Profile"
                  labelIcon={<UserIcon />}
                  href="/profile"
                />
                <UserButton.Link
                  label="Settings"
                  labelIcon={<GearIcon />}
                  href="/settings"
                />
              </UserButton.MenuItems>
            </UserButton>
          </Show>
        </Suspense>
      </div>
    </header>
  );
}
