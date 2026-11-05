# Permission tests

Run against the dev deployment by calling the Convex functions directly with
fake identities (`npx convex run <fn> '<args>' --identity '{"subject":"test_a",...}'`),
so the UI is bypassed and only the server-side checks are exercised. Test users,
tools and loans were created with `test_` subjects and deleted afterwards.

Result: **44 of 44 checks behave as expected** (43 in the scripted run, plus the
signed-out `loans:requestLoan` case re-run by hand with a real tool id, because the
scripted run passed an id from the wrong table and Convex's argument validator
rejected it before the auth check).

Actors: A (tool owner), B (borrower), ADM (admin).

| Area | Check | Expected | Result |
| --- | --- | --- | --- |
| Signed out | `tools:create`, `loans:requestLoan`, `users:store`, `admin:listUsers` | "Not authenticated" | pass |
| Tools | Empty name; category outside the fixed list | rejected by server validation | pass |
| Tools | B updates or removes A's tool | "Not allowed" | pass |
| Tools | Admin edits A's tool | "Not allowed" (admins moderate by removal only) | pass |
| Requests | A borrows own tool | "You can't borrow your own tool" | pass |
| Requests | Past start date, end before start, `2026-02-30` | rejected | pass |
| Requests | Request overlapping an approved loan | "already booked" | pass |
| Approval | B approves or declines a loan on A's tool | "Not allowed" | pass |
| Approval | Admin approves (not the owner) | "Not allowed" | pass |
| Approval | A approves a second, overlapping pending request | "Overlaps an approved loan" | pass |
| Approval | Approve an already approved loan | "Only pending requests..." | pass |
| Cancel | Owner (not the borrower) or a signed-out caller cancels a request | "Not allowed" / "Not authenticated" | pass |
| Cancel | Borrower cancels own pending request | succeeds, status becomes `cancelled`, dates free again | pass |
| Cancel | Borrower cancels an approved, declined or already cancelled request | "Only pending requests can be cancelled" | pass |
| Return | Borrower marks own loan returned | "Not allowed" | pass |
| Return | Mark a pending loan returned | "Only approved loans..." | pass |
| Return | Owner marks approved loan returned | succeeds | pass |
| Removal | Remove a tool with a pending or approved loan | blocked | pass |
| Removal | Admin removes a tool with no open loans | succeeds | pass |
| Visibility | `loans:listMine` / `listIncoming` | only the caller's own loans | pass |
| Visibility | `tools:listPublic` | only `name` and `category` | pass |
| Admin | Regular user calls `admin:listUsers`, `listAllLoans`, `listAllTools`, `setTrustedLender` | "Admin only" | pass |
| Admin | Admin marks a lender trusted | succeeds | pass |
| Roles | Any function that can set `role` | none exists; only the Convex dashboard changes it | verified by code search |
