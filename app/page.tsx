import { HeroCta } from "@/components/hero-cta";
import { PublicToolList } from "@/components/public-tool-list";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6">
      <section className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          LendLoop
        </h1>
        <p className="mt-4 text-lg text-muted">
          Borrow what you need. Lend what you don&apos;t.
        </p>
        <HeroCta />
      </section>

      <section className="mt-16">
        <h2 className="mb-4 text-xl font-semibold">Available tools</h2>
        <PublicToolList />
      </section>
    </main>
  );
}
