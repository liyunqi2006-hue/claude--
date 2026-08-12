"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

export default function FAQ() {
  const { dict } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-neutral-50 dark:bg-neutral-950 py-20">
      <div className="mx-auto w-full max-w-3xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-neutral-900 dark:text-white">
            {dict.faq.title}
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            {dict.faq.subtitle}
          </p>
        </div>
        <div className="space-y-4">
          {dict.faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.q}
                className={`cursor-pointer rounded-2xl border-2 bg-white px-6 py-5 transition-all duration-300 dark:bg-neutral-900 ${
                  isOpen
                    ? "border-[#2a5298] shadow-lg"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                }`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between text-base font-semibold text-neutral-900 dark:text-white">
                  {item.q}
                  <span
                    className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-lg transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 bg-[#2a5298] text-white"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                    }`}
                  >
                    +
                  </span>
                </div>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
