import { ClipboardList, ShieldCheck, MailCheck } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";

const ICONS = [ClipboardList, ShieldCheck, MailCheck] as const;

export default async function HowItWorks() {
  const dict = await getDictionary();
  const steps = [
    dict.howItWorks.steps.submit,
    dict.howItWorks.steps.pay,
    dict.howItWorks.steps.deliver,
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">{dict.howItWorks.title}</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">{dict.howItWorks.subtitle}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={step.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
                <Icon size={20} />
              </div>
              <div className="mt-4 text-sm font-medium text-neutral-400">
                {dict.howItWorks.step} {i + 1}
              </div>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
