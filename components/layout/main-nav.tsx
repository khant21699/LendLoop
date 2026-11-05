"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavIcon } from "@/components/ui/icon/nav-icons";
import { navRoutes, RouteConfig } from "@/lib/routes";

// The signed-in links from the route config, plus whether the viewer is an
// admin (read from Convex; the admin functions enforce it again) and how
// many requests are waiting on them.
function useNav() {
  const me = useQuery(api.users.me);
  const pending = useQuery(api.loans.pendingCount) ?? 0;
  const routes: RouteConfig[] = [
    ...navRoutes("header", "auth"),
    ...(me?.role === "admin" ? navRoutes("header", "admin") : []),
  ];
  return { routes, pending };
}

function isActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function Count({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <span
      className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-sm bg-primary px-1 font-mono text-[0.6875rem] font-medium text-primary-foreground"
      aria-label={`${n} waiting`}
    >
      {n}
    </span>
  );
}

// Desktop: links in the header bar.
export function MainNav() {
  const pathname = usePathname();
  const { routes, pending } = useNav();

  return (
    <Show when="signed-in">
      <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
        {routes.map((route) => {
          const active = isActive(pathname, route.path);
          return (
            <Link
              key={route.path}
              href={route.path}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center text-sm font-medium underline-offset-8 hover:text-link hover:underline ${
                active ? "text-link underline" : "text-text"
              }`}
            >
              {route.label}
              {route.path === "/requests" && <Count n={pending} />}
            </Link>
          );
        })}
      </nav>
    </Show>
  );
}

// Phones: a fixed bar at the bottom, where thumbs are.
export function MobileTabBar() {
  const pathname = usePathname();
  const { routes, pending } = useNav();

  return (
    <Show when="signed-in">
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 grid border-t border-border bg-surface md:hidden"
        style={{ gridTemplateColumns: `repeat(${routes.length}, 1fr)` }}
      >
        {routes.map((route) => {
          const active = isActive(pathname, route.path);
          return (
            <Link
              key={route.path}
              href={route.path}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-medium ${
                active ? "text-link" : "text-muted"
              }`}
            >
              <span className="relative">
                <NavIcon name={route.icon ?? "tool"} />
                {route.path === "/requests" && pending > 0 && (
                  <span className="absolute -right-2 -top-1.5 rounded-sm bg-primary px-1 font-mono text-[0.625rem] text-primary-foreground">
                    {pending}
                  </span>
                )}
              </span>
              {route.label}
            </Link>
          );
        })}
      </nav>
      {/* Keeps the footer clear of the fixed bar. */}
      <div className="h-14 md:hidden" aria-hidden="true" />
    </Show>
  );
}
