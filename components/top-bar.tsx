"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { navRoutes, RouteConfig } from "@/lib/routes";

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

function ToolIcon() {
  return (
    <svg {...iconProps}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />
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

const ICONS: Record<
  NonNullable<RouteConfig["icon"]>,
  () => React.JSX.Element
> = {
  user: UserIcon,
  tool: ToolIcon,
  gear: GearIcon,
};

const headerLinkClass =
  "text-sm font-medium text-text underline-offset-8 hover:text-link hover:underline";

function LogoMark() {
  // Two interlocking loops.
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="14" height="14" rx="2" />
      <rect
        x="10"
        y="5"
        width="14"
        height="14"
        rx="2"
        className="text-primary"
      />
    </svg>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold tracking-tight"
        >
          <LogoMark />
          LendLoop
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          {navRoutes("header", "public").map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={headerLinkClass}
            >
              {route.label}
            </Link>
          ))}
          <ThemeToggle />
          <Suspense>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className={`${headerLinkClass} cursor-pointer`}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary">Sign Up</button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              {navRoutes("header", "auth").map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={headerLinkClass}
                >
                  {route.label}
                </Link>
              ))}
              <UserButton
                appearance={{
                  elements: {
                    userButtonPopoverActionButton__manageAccount: "hidden!",
                  },
                }}
              >
                <UserButton.MenuItems>
                  {navRoutes("menu", "auth").map((route) => {
                    const Icon = ICONS[route.icon ?? "user"];
                    return (
                      <UserButton.Link
                        key={route.path}
                        label={route.label}
                        labelIcon={<Icon />}
                        href={route.path}
                      />
                    );
                  })}
                </UserButton.MenuItems>
              </UserButton>
            </Show>
          </Suspense>
        </div>
      </div>
    </header>
  );
}
