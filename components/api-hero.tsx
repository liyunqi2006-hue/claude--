import Image from "next/image";
import { Cpu } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";

export default async function ApiHero() {
  const dict = await getDictionary();
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 sm:items-center">
      <div className="sm:pl-16">
        <Image
          src="/claude-logo.png"
          alt="Claude"
          width={56}
          height={56}
          priority
          className="mb-5 h-14 w-14 rounded-xl shadow-sm"
        />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{dict.apiHero.title}</h1>
        <p className="mt-3 text-lg font-medium text-brand">{dict.apiHero.tagline}</p>
        <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-300">
          {dict.apiHero.desc}
        </p>
      </div>

      <div className="flex justify-center sm:justify-end">
        <div className="w-full max-w-xs rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white shadow-lg shadow-orange-500/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Cpu size={20} />
          </div>
          <ul className="mt-6 space-y-2 text-sm">
            <li>{dict.apiHero.bullet1}</li>
            <li>{dict.apiHero.bullet2}</li>
            <li>{dict.apiHero.bullet3}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
