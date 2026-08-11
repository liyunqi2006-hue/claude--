import Link from "next/link";
import { Cpu, ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";

export default async function ApiPromoBanner() {
  const dict = await getDictionary();
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
            <Cpu size={22} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{dict.apiPromo.title}</h3>
            <p className="mt-1 max-w-xl text-sm text-neutral-600 dark:text-neutral-300">
              {dict.apiPromo.desc}
            </p>
          </div>
        </div>
        <Link
          href="/api-platform"
          className="flex shrink-0 items-center gap-1 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          {dict.apiPromo.cta} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
