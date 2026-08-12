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
    <section className="bg-neutral-50 dark:bg-neutral-950 py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-neutral-900 dark:text-white">
            {dict.howItWorks.title}
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            {dict.howItWorks.subtitle}
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={step.title}
                className="group relative rounded-3xl border-2 border-neutral-200 bg-white p-8 transition-all duration-500 hover:border-[#2a5298] hover:shadow-2xl hover:-translate-y-2 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="absolute -top-4 left-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2a5298] to-[#7e22ce] text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <span className="text-xl font-bold">{i + 1}</span>
                </div>
                <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 text-[#2a5298] transition-all duration-500 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#2a5298] group-hover:to-[#7e22ce] group-hover:text-white dark:from-blue-950 dark:to-purple-950">
                  <Icon size={28} strokeWidth={2} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
