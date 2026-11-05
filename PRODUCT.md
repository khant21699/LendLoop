# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Neighbors who own tools they rarely use and neighbors who need a tool for a day or a weekend. A lender lists what they're willing to lend, approves or declines requests, and marks the tool returned. A borrower finds a tool, asks for a date range, and tracks the request. Admins moderate listings and mark trusted lenders.

LendLoop is a fictional company built as a take-home assignment. The real audience is the hiring team reviewing it; a single neighborhood is the fictional use case.

## Product Purpose

A neighborhood tool-lending board: list a tool, request to borrow it for a date range, get approved, return it. Notifications and overdue reminders run through n8n automations. Success is a request going from "I need a drill" to an approved loan in a few taps, with nothing lost or double-booked.

## Positioning

Lending between neighbors with the bookkeeping handled: availability, overlap checks, approvals, and reminders happen automatically, so lending a tool doesn't mean chasing anyone.

## Operating Context

- Public visitors see only a read-only list of available tools (name and category), with no owner details.
- Signed-in users can list, request, approve, decline and mark returned; admins can also remove any listing, view all loans, and mark a "Trusted Lender".
- Roles are enforced in Convex functions, not only in the UI.
- Automation: n8n sends request notifications and a daily overdue reminder, and reports results back to Convex. Recent automation activity may appear on a loan (for example "Reminder sent 2 days ago").
- Stack: Next.js App Router, TypeScript, Tailwind v4, Clerk, Convex, n8n.

## Capabilities and Constraints

- Statuses: pending, approved, declined, returned. Overdue is derived (approved, not returned, past end date), not stored. "Trusted lender" is a badge on users.
- Tool categories are a fixed list: Power tools, Hand tools, Garden, Kitchen, Camping, Cleaning, Other.
- Dates are whole days (UTC), with inclusive ranges.
- Data minimization: other people are shown by name only. No owner details reach the public page.
- Open decision: how borrowers and lenders contact each other to arrange pickup is not designed yet.

## Brand Commitments

- Name: LendLoop. Tagline: "Borrow what you need. Lend what you don't."
- Voice: playful. Light humor and personality in labels, empty states and confirmations, without getting in the way of the task.
- Theme (binding, from the assignment brief): light and dark modes via `next-themes` (class strategy, system default) with a visible toggle. Semantic color tokens (such as `bg-surface`), not hard-coded colors. Light: background #F8FAFC, surface #FFFFFF, text #0F172A, muted #475569, border #E2E8F0, link #4338CA, accent #F97316. Dark: background #0B1120, surface #111827, text #F1F5F9, muted #94A3B8, border #334155, link #A5B4FC, accent #FB923C. Primary button #4F46E5 with white text, hover #4338CA, in both modes. Status badge colors are specified per mode. Accent is for small highlights only, never with white text.

## Evidence on Hand

No real users, testimonials, metrics or photos exist. Any tools in the database are test data. Do not invent social proof, neighborhood names or statistics.

## Product Principles

1. The server is the authority. Roles and ownership are enforced in backend functions, and the UI only reflects them.
2. Show only what's needed. Each view and each automation payload carries the minimum fields for its job.
3. State is always clear. Every request and loan shows exactly where it stands, and failures are visible, never silent.
4. Lending should feel easy and a little fun. Personality lives in the copy, and the flows stay quick and plain.
5. Explainable by design. Prefer simple, readable solutions that can be walked through end to end.

## Accessibility & Inclusion

Target WCAG 2.2 AA in both themes: sufficient contrast for text and status badges, full keyboard operation, visible focus, labelled form fields, and respect for reduced-motion preferences.
