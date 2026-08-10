import Link from "next/link";
import { Zap } from "lucide-react";
import { usdToCny } from "@/lib/exchange";

export interface CreditTier {
  id: string;
  name: string;
  creditAmount: number;
  priceUSD: number;
}

export default function ApiCreditTiers({ tiers }: { tiers: CreditTier[] }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">选择充值档位</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          按额度充值，一次到账，用多少扣多少。
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => {
          const markupPercent = Math.round(
            ((tier.priceUSD - tier.creditAmount) / tier.creditAmount) * 100,
          );
          return (
            <div
              key={tier.id}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
                <Zap size={20} />
              </div>
              <div className="mt-4 text-3xl font-bold">${tier.creditAmount.toFixed(0)}</div>
              <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">额度</div>
              <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <div className="text-lg font-semibold">${tier.priceUSD.toFixed(2)}</div>
                <div className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  ≈ ¥{usdToCny(tier.priceUSD).toFixed(2)}
                </div>
                <div className="mt-1 text-xs text-brand">+{markupPercent}% 服务费</div>
              </div>
              <Link
                href={`/checkout/${tier.id}`}
                className="mt-5 rounded-lg bg-brand-700 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-brand-600"
              >
                立即购买
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
