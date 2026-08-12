"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SubscriptionDuration, SubscriptionPlan } from "@prisma/client";
import { DURATIONS, PLANS, PRICE_TABLE } from "@/lib/pricing";
import { useI18n } from "@/lib/i18n/context";
import { format } from "@/lib/i18n/config";
import { useSubscriptionSelection } from "@/components/subscription-context";

const CHANNELS = ["usdt"] as const;

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
  const [payChannel, setPayChannel] = useState<typeof CHANNELS[number]>("usdt");
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
    <section id="pricing" className="mx-auto w-full max-w-5xl px-6 py-20">
      <div className="mb-12 text-center opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]">
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-white">
          选择您的套餐
        </h2>
        <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-400">
          灵活的订阅周期，满足不同需求
        </p>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-12 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards]">
        {/* Plan selection */}
        <div className="mb-10">
          <label className="mb-4 block text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            订阅计划
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PLANS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlan(p)}
                className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                  plan === p
                    ? "border-[#2a5298] bg-gradient-to-br from-[#2a5298]/5 to-[#7e22ce]/5 shadow-lg"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                }`}
              >
                {plan === p && (
                  <div className="absolute right-3 top-3 rounded-full bg-[#2a5298] px-2.5 py-1 text-xs font-semibold text-white">
                    已选
                  </div>
                )}
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {dict.enums.plan[p]}
                </div>
                <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  {dict.enums.planDescription[p]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration selection */}
        <div className="mb-10">
          <label className="mb-4 block text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            订阅周期
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`rounded-xl px-5 py-4 text-base font-semibold transition-all duration-300 ${
                  duration === d
                    ? "bg-gradient-to-r from-[#2a5298] to-[#7e22ce] text-white shadow-lg shadow-[#2a5298]/30 scale-105"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                {dict.enums.duration[d]}
              </button>
            ))}
          </div>
        </div>

        <div className="my-8 border-t border-neutral-200 dark:border-neutral-800" />

        {/* Email input */}
        <div className="mb-8">
          <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {dict.subscription.receiveEmail}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.subscription.emailPlaceholder}
            className="w-full rounded-xl border-2 border-neutral-200 bg-white px-5 py-4 text-base transition-all duration-300 focus:border-[#2a5298] focus:outline-none focus:ring-4 focus:ring-[#2a5298]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-[#7e22ce]"
          />
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            {dict.subscription.emailNote}
          </p>
          <label className="mt-4 flex items-start gap-3 text-base cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmedEmail}
              onChange={(e) => setConfirmedEmail(e.target.checked)}
              className="mt-1 h-5 w-5 cursor-pointer accent-[#2a5298]"
            />
            <span className="group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              {dict.subscription.confirmEmail}
            </span>
          </label>
        </div>

        {/* Terms agreement */}
        <div className="mb-8 rounded-2xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 dark:border-yellow-700/60 dark:from-yellow-950/40 dark:to-orange-950/40">
          <label className="flex items-start gap-3 text-base cursor-pointer group">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-1 h-5 w-5 cursor-pointer accent-orange-600"
            />
            <span className="text-yellow-900 dark:text-yellow-200 leading-relaxed">
              {dict.subscription.agreeTerms}
            </span>
          </label>
        </div>

        {/* Payment method */}
        <div className="mb-10">
          <label className="mb-4 block text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {dict.subscription.payMethod}
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CHANNELS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setPayChannel(c)}
                className={`rounded-xl border-2 px-5 py-4 text-base font-semibold transition-all duration-300 ${
                  payChannel === c
                    ? "border-[#2a5298] bg-[#2a5298]/5 text-[#2a5298] dark:text-[#7e22ce]"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-300"
                }`}
              >
                {dict.enums.payChannel[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Total and submit */}
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-800/50 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-baseline gap-2">
              <span key={`total-${price.total}`} className="text-5xl font-bold text-neutral-900 dark:text-white">
                ${price.total.toFixed(2)}
              </span>
              <span className="text-lg text-neutral-500 dark:text-neutral-400">USD</span>
            </div>
            <div key={`bd-${price.official}-${price.service}`} className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {format(dict.subscription.breakdown, {
                official: price.official.toFixed(2),
                service: price.service.toFixed(2),
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-[#2a5298] to-[#7e22ce] px-12 py-5 text-lg font-bold text-white shadow-lg shadow-[#2a5298]/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#2a5298]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto"
          >
            {loading ? dict.common.submitting : dict.common.buyNow}
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-base text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
