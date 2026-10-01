import { dictionaries, type Locale } from "@naqa/shared";
import Link from "next/link";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l: Locale = locale === "en" ? "en" : "ar";
  const t = dictionaries[l];
  const other: Locale = l === "ar" ? "en" : "ar";

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <span className="text-xl font-bold">{t.appName}</span>
        <Link
          href={`/${other}`}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-surface-muted"
        >
          {other === "ar" ? "العربية" : "English"}
        </Link>
      </header>

      <section className="grid flex-1 items-center gap-12 py-16 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h1 className="text-balance text-4xl font-bold leading-tight md:text-6xl">{t.welcome.title}</h1>
          <p className="max-w-prose text-lg text-ink-muted">{t.welcome.body}</p>
        </div>

        <div aria-hidden className="relative mx-auto h-72 w-72 md:h-96 md:w-96">
          <div className="absolute start-4 top-8 h-56 w-44 -rotate-6 rounded-3xl bg-primary shadow-xl md:h-72 md:w-56" />
          <div className="absolute start-24 top-16 h-48 w-40 rotate-3 rounded-3xl bg-accent shadow-xl md:start-32 md:h-64 md:w-48" />
          <div className="absolute start-14 top-40 h-40 w-36 -rotate-1 rounded-3xl bg-surface-muted shadow-xl md:start-20 md:top-52 md:h-52 md:w-44" />
        </div>
      </section>
    </main>
  );
}
