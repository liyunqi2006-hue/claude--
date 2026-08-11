"use client";

import Image from "next/image";
import { Zap } from "lucide-react";
import { PRICE_TABLE } from "@/lib/pricing";
import { useI18n } from "@/lib/i18n/context";
import { useSubscriptionSelection } from "@/components/subscription-context";

export default function Hero() {
  const { plan, duration } = useSubscriptionSelection();
  const { dict } = useI18n();
  const price = PRICE_TABLE[plan][duration];

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 sm:items-center">
      <div className="sm:pl-16">
        <div className="flex items-center gap-5">
          <Image
            src="/claude-logo.png"
            alt="Claude"
            width={80}
            height={80}
            priority
            className="h-20 w-20 rounded-xl shadow-sm"
          />
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{dict.hero.title}</h1>
            <p className="mt-2 text-lg font-medium text-brand">{dict.hero.tagline}</p>
          </div>
        </div>
        <p className="mt-6 max-w-md text-neutral-600 dark:text-neutral-300">
          {dict.hero.desc}
        </p>
      </div>

      <div className="flex justify-center sm:justify-end">
        <div className="w-full max-w-xs rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white shadow-lg shadow-orange-500/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Zap size={20} fill="currentColor" />
          </div>
          <p className="mt-6 text-sm text-white/80">{dict.hero.currentPlan}</p>
          <p className="mt-1 text-2xl font-bold">
            {dict.enums.duration[duration]} {dict.enums.plan[plan]}
          </p>
          <p className="mt-4 text-3xl font-bold">${price.total.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
}
