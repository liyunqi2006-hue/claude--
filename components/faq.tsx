"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

export default function FAQ() {
  const { dict } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">{dict.faq.title}</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">{dict.faq.subtitle}</p>
      </div>
      <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
        {dict.faq.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.q}
              className="px-6 py-4"
              onMouseEnter={() => setOpenIndex(index)}
              onMouseLeave={() => setOpenIndex((current) => (current === index ? null : current))}
            >
              <div className="flex cursor-default items-center justify-between text-sm font-medium">
                {item.q}
                <span className={`ml-4 text-neutral-400 transition ${isOpen ? "rotate-45" : ""}`}>+</span>
              </div>
              {isOpen && (
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
