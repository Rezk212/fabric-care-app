import { dictionaries, type Locale } from "@naqa/shared";
import Link from "next/link";

function Drum() {
  return (
    <svg viewBox="0 0 280 280" className="h-auto w-full max-w-sm" aria-hidden>
      <circle cx="140" cy="140" r="128" fill="#fff" opacity=".08" />
      <circle cx="140" cy="140" r="104" fill="none" stroke="#fff" strokeWidth="10" opacity=".9" />
      <circle cx="140" cy="140" r="84" fill="#fff" opacity=".12" />
      <path d="M76 150c14-24 28 16 42 0s28 16 42 0 28 16 42 0" stroke="#F2A93B" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M92 118c12-18 24 10 36 0s24 10 36 0" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".7" />
      <circle cx="222" cy="58" r="14" fill="#fff" opacity=".28" />
      <circle cx="246" cy="96" r="7" fill="#fff" opacity=".36" />
      <circle cx="48" cy="70" r="9" fill="#fff" opacity=".25" />
      <circle cx="34" cy="206" r="12" fill="#F2A93B" opacity=".85" />
    </svg>
  );
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l: Locale = locale === "en" ? "en" : "ar";
  const t = dictionaries[l];
  const other: Locale = l === "ar" ? "en" : "ar";
  const steps = [t.home.garment, t.home.label, t.home.machine];

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-[var(--hero-from)] to-[var(--hero-to)] text-white">
        <div className="mx-auto flex max-w-5xl flex-col px-6 pb-16 pt-6 md:pb-24">
          <header className="flex items-center justify-between">
            <span className="text-xl font-bold">{t.appName}</span>
            <Link
              href={`/${other}`}
              className="rounded-full border border-white/35 bg-white/15 px-5 py-2 text-sm font-medium hover:bg-white/25"
            >
              {other === "ar" ? "العربية" : "English"}
            </Link>
          </header>

          <div className="grid items-center gap-10 pt-14 md:grid-cols-2">
            <div className="flex flex-col gap-6">
              <h1 className="text-balance text-4xl font-bold leading-tight md:text-6xl">{t.welcome.title}</h1>
              <p className="max-w-prose text-lg text-white/85">{t.welcome.body}</p>
            </div>
            <div className="flex justify-center">
              <Drum />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="mb-6 text-2xl font-semibold">{t.home.title}</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={i} className="rounded-3xl bg-surface p-6 shadow-[0_10px_28px_rgba(14,26,51,0.10)]">
              <span className="font-semibold">{s}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
