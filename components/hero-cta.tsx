"use client";

import { Show, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function HeroCta() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="btn btn-primary h-12 px-6 text-base">
            Sign in to lend or borrow
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <Link href="/tools" className="btn btn-primary h-12 px-6 text-base">
          Browse tools
        </Link>
        <Link href="/listings" className="btn btn-outline h-12 px-6 text-base">
          List a tool
        </Link>
      </Show>
    </div>
  );
}
