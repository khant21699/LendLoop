# Lend

A platform for lending and borrowing. Built with [Next.js](https://nextjs.org) (App Router), Tailwind CSS v4 and [Clerk](https://clerk.com) for authentication.

## Getting Started

Install dependencies and set up your environment variables (see [Authentication](#authentication-clerk)), then run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Authentication (Clerk)

Authentication uses [`@clerk/nextjs`](https://clerk.com/docs/nextjs/getting-started/quickstart).

### Environment variables

Create a `.env.local` file in the project root (it is git-ignored):

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Get both keys from the [Clerk Dashboard](https://dashboard.clerk.com/) under **API keys**, or run `npx -y clerk@latest env pull` after `npx -y clerk@latest auth login` and `npx -y clerk@latest link` to write them for you. Never expose `CLERK_SECRET_KEY` in client code or commit it.

### How it is wired

| File | Role |
| --- | --- |
| `middleware.ts` | `clerkMiddleware()` runs on all non-static routes and API routes so auth state is available to the app. |
| `app/layout.tsx` | Wraps the app in `<ClerkProvider>`, applies the Clerk theme, and renders the header controls. |

The header shows Clerk's Sign In and Sign Up buttons in modal mode (`mode="modal"`) when signed out, and `<UserButton />` when signed in, using `<Show when="signed-out">` / `<Show when="signed-in">` inside `<Suspense>`.

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

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
