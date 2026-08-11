"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SubscriptionDuration, SubscriptionPlan } from "@prisma/client";
import { DURATIONS, PLANS, PRICE_TABLE } from "@/lib/pricing";
import { useI18n } from "@/lib/i18n/context";
import { useSubscriptionSelection } from "@/components/subscription-context";

const CHANNELS = ["alipay", "wxpay", "bank", "applepay", "link"] as const;

export interface ProductLookup {
  id: string;
  plan: SubscriptionPlan;
  duration: SubscriptionDuration;
}

export default function SubscriptionPicker({ products }: { products: ProductLookup[] }) {
  const router = useRouter();
  const { dict } = useI18n();
  const { plan, setPlan, duration, setDuration } = useSubscriptionSelection();
  const [email, setEmail] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [payChannel, setPayChannel] = useState<typeof CHANNELS[number]>("alipay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = PRICE_TABLE[plan][duration];
  const product = useMemo(
    () => products.find((p) => p.plan === plan && p.duration === duration),
    [products, plan, duration],
  );

  const canSubmit = email.length > 0 && confirmedEmail && agreedTerms && !loading;

  async function handleSubmit() {
    if (!product) {
      setError(dict.subscription.planUnavailable);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          contactEmail: email,
          payChannel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? dict.common.orderFailed);
        setLoading(false);
        return;
      }
      router.push(`/pay/${data.orderNo}?url=${encodeURIComponent(data.paymentUrl)}`);
    } catch {
      setError(dict.common.networkError);
      setLoading(false);
    }
  }

  return (
    <section id="pricing" className="mx-auto w-full max-w-4xl px-6 py-14">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-10">
        <div className="mb-8 grid grid-cols-3 gap-3">
          {PLANS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlan(p)}
              className={`rounded-2xl border px-5 py-5 text-center transition ${
                plan === p
                  ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/10"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-300"
              }`}
            >
              <div className="text-lg font-semibold">{dict.enums.plan[p]}</div>
              <div className="mt-1 text-sm text-neutral-400">{dict.enums.planDescription[p]}</div>
            </button>
          ))}
        </div>

        <div className="mb-8 grid grid-cols-4 gap-3">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className={`rounded-xl px-4 py-3 text-base font-medium transition ${
                duration === d
                  ? "bg-brand text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              {dict.enums.duration[d]}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-base font-medium">{dict.subscription.receiveEmail}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.subscription.emailPlaceholder}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base dark:border-neutral-700 dark:bg-neutral-950"
          />
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            {dict.subscription.emailNote}
          </p>
          <label className="mt-3 flex items-start gap-2 text-base">
            <input
              type="checkbox"
              checked={confirmedEmail}
              onChange={(e) => setConfirmedEmail(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>{dict.subscription.confirmEmail}</span>
          </label>
        </div>

        <div className="mb-8 rounded-xl border border-yellow-300 bg-yellow-50 p-5 text-base text-yellow-900 dark:border-yellow-700/60 dark:bg-yellow-950/40 dark:text-yellow-200">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>{dict.subscription.agreeTerms}</span>
          </label>
        </div>

        <div className="mb-8">
          <label className="mb-3 block text-base font-medium">{dict.subscription.payMethod}</label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {CHANNELS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setPayChannel(c)}
                className={`rounded-xl border px-4 py-3 text-base transition ${
                  payChannel === c
                    ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/10"
                    : "border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
                }`}
              >
                {dict.enums.payChannel[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-5 border-t border-neutral-200 pt-6 dark:border-neutral-800 sm:flex-row sm:items-center">
          <div>
            <div className="text-4xl font-bold">${price.total.toFixed(2)}</div>
            <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {dict.subscription.breakdown(price.official.toFixed(2), price.service.toFixed(2))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full rounded-xl bg-brand-700 px-10 py-4 text-lg font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {loading ? dict.common.submitting : dict.common.buyNow}
          </button>
        </div>

        {error && <p className="mt-4 text-base text-red-600">{error}</p>}
      </div>
    </section>
  );
}
