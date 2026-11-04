// Single source of truth for the app's pages. The middleware reads `access`
// to decide what needs a sign-in, and the top bar reads `nav` to build the
// navigation, so a new page is added in exactly one place.
//
// This only gates *pages*. Data is protected separately by requireUser /
// requireAdmin inside the Convex functions.

export type RouteConfig = {
  path: string;
  label: string;
  // "public": anyone. "auth": signed-in users only (middleware redirects others).
  access: "public" | "auth";
  // Where it appears in the top bar: a header link or the user menu. Omit to hide.
  nav?: "header" | "menu";
  icon?: "user" | "tool" | "gear"; // used by menu items
};

export const routes: RouteConfig[] = [
  { path: "/", label: "Home", access: "public" },
  { path: "/tools", label: "Browse", access: "auth", nav: "header" },
  {
    path: "/profile",
    label: "Profile",
    access: "auth",
    nav: "menu",
    icon: "user",
  },
  {
    path: "/listings",
    label: "My listings",
    access: "auth",
    nav: "menu",
    icon: "tool",
  },
  {
    path: "/requests",
    label: "Requests",
    access: "auth",
    nav: "menu",
    icon: "tool",
  },
  {
    path: "/settings",
    label: "Settings",
    access: "auth",
    nav: "menu",
    icon: "gear",
  },
];

// Matches the path itself and anything under it, but not look-alikes
// ("/tools" matches "/tools" and "/tools/1", not "/toolshed").
export const protectedRoutePatterns = routes
  .filter((route) => route.access === "auth")
  .map((route) => `${route.path}(/.*)?`);

export const navRoutes = (
  nav: "header" | "menu",
  access: RouteConfig["access"],
) => routes.filter((route) => route.nav === nav && route.access === access);
