"use client";

import { Show, SignInButton } from "@clerk/nextjs";

export function HeroCta() {
  return (
    <Show when="signed-out">
      <SignInButton mode="modal">
        <button className="mt-8 h-12 rounded-full bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary-hover cursor-pointer">
          Sign in to lend or borrow
        </button>
      </SignInButton>
    </Show>
  );
}
