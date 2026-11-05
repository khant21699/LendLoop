import { HeroCta } from "@/components/home/hero-cta";
import { HeroDrawing } from "@/components/home/hero-drawing";
import { PublicToolList } from "@/components/home/public-tool-list";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h1 className="font-display text-[clamp(3.25rem,9vw,5.5rem)] font-bold leading-[0.95] tracking-tight">
            LendLoop
          </h1>
          <p className="mt-5 text-2xl font-medium">
            Borrow what you need. Lend what you don&apos;t.
          </p>
          <p className="mt-3 max-w-prose text-muted">
            Somewhere on your street, a perfectly good drill is napping. Wake it
            up.
          </p>
          <HeroCta />
        </div>
        <div className="flex justify-center lg:justify-end">
          <HeroDrawing />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">
          Available tools
        </h2>
        <PublicToolList />
      </section>
    </main>
  );
}
