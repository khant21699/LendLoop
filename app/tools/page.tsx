"use client";

import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";
import { ToolBrowser } from "@/components/tool-browser";

export default function ToolsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title="Browse tools">
        Everything your neighbors are willing to lend. Pick one, pick dates, ask
        nicely.
      </PageHeader>
      <AuthGate message="Sign in to browse tools and request to borrow.">
        <ToolBrowser />
      </AuthGate>
    </main>
  );
}
