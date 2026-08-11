import { Code2, KeyRound, Wallet } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";

const CODE_SAMPLE = `curl https://api.example.com/v1/messages \\\n  -H "x-api-key: $YOUR_KEY" \\\n  -H "content-type: application/json" \\\n  -d '{"model":"claude-sonnet-5",\n      "messages":[...]}'`;

const ICONS = [Wallet, KeyRound, Code2] as const;

export default async function ApiHowItWorks() {
  const dict = await getDictionary();
  const steps = [
    dict.apiHowItWorks.steps.recharge,
    dict.apiHowItWorks.steps.getKey,
    dict.apiHowItWorks.steps.call,
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">{dict.apiHowItWorks.title}</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">{dict.apiHowItWorks.subtitle}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = ICONS[i];
          const code = i === 2 ? CODE_SAMPLE : null;
          return (
            <div
              key={step.title}
              className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
                <Icon size={20} />
              </div>
              <div className="mt-4 text-sm font-medium text-neutral-400">
                {dict.apiHowItWorks.step} {i + 1}
              </div>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{step.desc}</p>
              {code && (
                <pre className="mt-4 min-w-0 overflow-x-hidden whitespace-pre-wrap break-all rounded-lg bg-neutral-100 p-3 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {code}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
