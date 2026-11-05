"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MainNav } from "@/components/main-nav";
import { NavIcon } from "@/components/nav-icons";
import { navRoutes } from "@/lib/routes";

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
        <MainNav />
        <div className="flex items-center gap-3 sm:gap-5">
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
              <UserButton
                appearance={{
                  elements: {
                    userButtonPopoverActionButton__manageAccount: "hidden!",
                  },
                }}
              >
                <UserButton.MenuItems>
                  {navRoutes("menu", "auth").map((route) => {
                    return (
                      <UserButton.Link
                        key={route.path}
                        label={route.label}
                        labelIcon={<NavIcon name={route.icon ?? "user"} />}
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
