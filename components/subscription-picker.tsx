"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SubscriptionDuration, SubscriptionPlan } from "@prisma/client";
import { DURATIONS, PLANS, PRICE_TABLE, planDescriptions } from "@/lib/pricing";
import { durationLabels, payChannelLabels, planLabels } from "@/lib/labels";

const CHANNELS = ["alipay", "wxpay", "bank", "applepay", "link"] as const;

export interface ProductLookup {
  id: string;
  plan: SubscriptionPlan;
  duration: SubscriptionDuration;
}

export default function SubscriptionPicker({ products }: { products: ProductLookup[] }) {
  const router = useRouter();
  const [plan, setPlan] = useState<SubscriptionPlan>("pro");
  const [duration, setDuration] = useState<SubscriptionDuration>("month");
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
      setError("该套餐暂未上架，请联系客服");
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
        setError(data.error ?? "下单失败");
        setLoading(false);
        return;
      }
      router.push(`/pay/${data.orderNo}?url=${encodeURIComponent(data.paymentUrl)}`);
    } catch {
      setError("网络错误，请稍后重试");
      setLoading(false);
    }
  }

  return (
    <section id="pricing" className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <div className="mb-6 grid grid-cols-3 gap-2">
          {PLANS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlan(p)}
              className={`rounded-xl border px-4 py-3 text-center transition ${
                plan === p
                  ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/10"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-300"
              }`}
            >
              <div className="font-semibold">{planLabels[p]}</div>
              <div className="mt-0.5 text-xs text-neutral-400">{planDescriptions[p]}</div>
            </button>
          ))}
        </div>

        <div className="mb-6 grid grid-cols-4 gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                duration === d
                  ? "bg-brand text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              {durationLabels[d]}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium">接收邮箱</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="填写接收订阅链接的邮箱"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
          />
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            支付成功后，我们将为您代付官方订单，该邮箱将直接收到来自 Anthropic 官方直发的订阅激活链接。
          </p>
          <label className="mt-2 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={confirmedEmail}
              onChange={(e) => setConfirmedEmail(e.target.checked)}
              className="mt-0.5"
            />
            <span>我已仔细核对接收邮箱，并知悉此邮箱提交后不可更改，已谨慎填写。</span>
          </label>
        </div>

        <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900 dark:border-yellow-700/60 dark:bg-yellow-950/40 dark:text-yellow-200">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              我已知悉本站仅提供软件订阅的纯代付服务，并非储值卡售卖。我同意服务条款与退款政策，并明确知悉：官方激活链接一经发送即严格不支持退款，且本平台不对任何第三方账号封禁风险负责。
            </span>
          </label>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">支付方式</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {CHANNELS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setPayChannel(c)}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  payChannel === c
                    ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/10"
                    : "border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
                }`}
              >
                {payChannelLabels[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-5 dark:border-neutral-800 sm:flex-row sm:items-center">
          <div>
            <div className="text-2xl font-bold">${price.total.toFixed(2)}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              = ${price.official.toFixed(2)} (官方订阅费) + ${price.service.toFixed(2)} (服务费)
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full rounded-lg bg-brand-700 px-8 py-3 font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {loading ? "提交中..." : "立即购买"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </section>
  );
}
