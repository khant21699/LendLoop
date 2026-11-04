# Lend

A platform for lending and borrowing. Built with [Next.js](https://nextjs.org) (App Router), Tailwind CSS v4, [Clerk](https://clerk.com) for authentication and [Convex](https://convex.dev) for the backend.

## Getting Started

Install dependencies and set up your environment variables (see [Authentication](#authentication-clerk) and [Backend (Convex)](#backend-convex)), then run Convex and the Next.js dev server in two terminals:

```bash
npm install
npx convex dev   # terminal 1: syncs convex/ to your dev deployment
npm run dev      # terminal 2: Next.js
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Authentication (Clerk)

Authentication uses [`@clerk/nextjs`](https://clerk.com/docs/nextjs/getting-started/quickstart).

### Environment variables

Create a `.env.local` file in the project root (it is git-ignored):

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_FRONTEND_API_URL=https://<your-instance>.clerk.accounts.dev
```

Get the keys from the [Clerk Dashboard](https://dashboard.clerk.com/) under **API keys**, or run `npx -y clerk@latest env pull` after `npx -y clerk@latest auth login` and `npx -y clerk@latest link` to write them for you. `CLERK_FRONTEND_API_URL` is your Clerk **Frontend API URL** (Dashboard, **API keys**, **Show API URLs**, or the **Integrations**, **Convex** page). Never expose `CLERK_SECRET_KEY` in client code or commit it.

### How it is wired

| File | Role |
| --- | --- |
| `middleware.ts` | `clerkMiddleware()` runs on all non-static routes and API routes so auth state is available to the app. |
| `app/layout.tsx` | Wraps the app in `<ClerkProvider>` (with the Clerk theme) and `<ConvexClientProvider>`, and renders `<TopBar />`. |
| `components/top-bar.tsx` | Header with Sign In / Sign Up (modal) when signed out and the user menu when signed in. |

The header shows Clerk's Sign In and Sign Up buttons in modal mode (`mode="modal"`) when signed out, and `<UserButton />` when signed in, using `<Show when="signed-out">` / `<Show when="signed-in">` inside `<Suspense>`.

The `<UserButton />` menu has **Profile** (`/profile`) and **Settings** (`/settings`) links added with `<UserButton.MenuItems>`, and Clerk's default "Manage account" item is hidden. `TopBar` is a client component (`"use client"`) because Clerk finds `UserButton.MenuItems` by checking its children's types, which fails across the server/client boundary. The hide class uses Tailwind's important modifier (`hidden!`) because Clerk's unlayered CSS otherwise beats Tailwind v4's layered utilities.

### Theming

The app palette is defined as Tailwind theme tokens in `app/globals.css` (`--color-primary`, `--color-accent`, `--color-background`, and so on). `<ClerkProvider appearance={...}>` in `app/layout.tsx` maps Clerk's `variables` to those same CSS variables, so the Clerk modal follows the palette. Change the colors in `globals.css` and both the app and the Clerk UI update.

### Protecting routes

`clerkMiddleware()` does not protect any route by default. To require sign-in for a route, use `createRouteMatcher` in `middleware.ts`:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

In Server Components and route handlers, read the user with `await auth()` from `@clerk/nextjs/server`.

### Sign-in methods

Enable or disable email, phone, username and social providers in the Clerk Dashboard under **User & authentication**. Before going to production, create a production instance and add its keys to your host's environment variables. See the [Clerk deployment guide](https://clerk.com/docs/guides/development/deployment/production).

## Backend (Convex)

[Convex](https://convex.dev) provides the database and server functions, and verifies Clerk sign-ins.

### Setup

1. Run `npx convex dev` and log in. It creates a dev deployment, writes `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` to `.env.local`, and keeps `convex/` in sync while it runs.
2. Tell Convex which Clerk instance to trust. This is set on the Convex deployment, not in `.env.local`:

   ```bash
   npx convex env set CLERK_FRONTEND_API_URL https://<your-instance>.clerk.accounts.dev
   npx convex env list   # confirm it is set
   ```

3. Restart `npm run dev` after `.env.local` changes. Next.js only reads it at startup.

### How it is wired

| File | Role |
| --- | --- |
| `convex/auth.config.ts` | Trusts JWTs issued by your Clerk instance (`CLERK_FRONTEND_API_URL`, `applicationID: "convex"`). |
| `components/convex-client-provider.tsx` | Creates the `ConvexReactClient` and wraps the app in `ConvexProviderWithClerk`, passing Clerk's `useAuth`, so Convex receives the Clerk token. |
| `convex/debug.ts` | Temporary `whoami` query that returns `ctx.auth.getUserIdentity()`. Remove it once real functions exist. |
| `app/profile/page.tsx` | Shows the `whoami` result: your identity if backend auth works, or "Not authenticated". |

### Troubleshooting

- **"No address provided to ConvexReactClient"**: `NEXT_PUBLIC_CONVEX_URL` is missing or the dev server wasn't restarted after it was added.
- **"No auth provider found matching the given token"**: `CLERK_FRONTEND_API_URL` isn't set on the Convex deployment. Use the URL with `https://` and no trailing slash.
- **`convex dev` fails to bundle with a Yarn Plug'n'Play error**: a stray `~/.pnp.cjs` in a parent folder is being picked up. Move it aside.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
