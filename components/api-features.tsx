import { Boxes, Gauge, Clock, LifeBuoy, Server, Wallet } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";

const ICONS = [Boxes, Server, Gauge, Wallet, Clock, LifeBuoy] as const;

export default async function ApiFeatures() {
  const dict = await getDictionary();
  const features = [
    dict.apiFeatures.features.models,
    dict.apiFeatures.features.compatible,
    dict.apiFeatures.features.transparent,
    dict.apiFeatures.features.noMinimum,
    dict.apiFeatures.features.stable,
    dict.apiFeatures.features.support,
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">{dict.apiFeatures.title}</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
