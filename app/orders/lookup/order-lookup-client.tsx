"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { HTML_LANG } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/zh";

interface LookupOrder {
  id: string;
  orderNo: string;
  productName: string;
  totalUSD: string;
  contactEmail: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(name.length - 2, 1))}@${domain}`;
}

function OrderCard({
  order,
  onResume,
  dict,
  dateLocale,
}: {
  order: LookupOrder;
  onResume: (orderNo: string) => void;
  dict: Dictionary;
  dateLocale: string;
}) {
  const statusLabel =
    (dict.enums.orderStatus as Record<string, string>)[order.status] ?? order.status;
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">{order.orderNo}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {statusLabel}
        </span>
      </div>
      <div className="mt-2 text-sm font-medium">{order.productName}</div>
      <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        ${order.totalUSD} · {maskEmail(order.contactEmail)}
      </div>
      <div className="mt-1 text-xs text-neutral-400">
        {dict.lookup.orderPlaced} {new Date(order.createdAt).toLocaleString(dateLocale)}
        {order.paidAt
          ? ` · ${dict.lookup.paid} ${new Date(order.paidAt).toLocaleString(dateLocale)}`
          : ""}
      </div>
      {order.status === "pending" && (
        <button
          type="button"
          onClick={() => onResume(order.orderNo)}
          className="mt-3 rounded-lg bg-brand-700 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          {dict.lookup.resume}
        </button>
      )}
    </div>
  );
}

export default function OrderLookupClient({ recentOrders }: { recentOrders: LookupOrder[] }) {
  const router = useRouter();
  const { dict, locale } = useI18n();
  const dateLocale = HTML_LANG[locale];
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [querying, setQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<LookupOrder[] | null>(null);

  async function resumePayment(orderNo: string) {
    // 查找订单 ID
    const order = results?.find(o => o.orderNo === orderNo) || recentOrders.find(o => o.orderNo === orderNo);
    if (order?.id) {
      router.push(`/payment/${order.id}`);
    }
  }

  async function requestCode() {
    if (!email || cooldown > 0 || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "发送验证码失败，请检查邮箱");
        return;
      }
      setCodeSent(true);
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } finally {
      setSending(false);
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setQuerying(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? dict.lookup.queryFailed);
        return;
      }
      setResults(data.orders);
    } finally {
      setQuerying(false);
    }
  }

  return (
    <div className="space-y-10">
      {recentOrders.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">{dict.lookup.recentTitle}</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard
                key={order.orderNo}
                order={order}
                onResume={resumePayment}
                dict={dict}
                dateLocale={dateLocale}
              />
            ))}
          </div>
        </section>
      )}

      {recentOrders.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          <span className="text-sm text-neutral-400">{dict.common.or}</span>
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </div>
      )}

      <section>
        <h2 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{dict.lookup.byEmailTitle}</h2>
        <p className="mb-8 text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
          {dict.lookup.byEmailNote}
        </p>
        <form onSubmit={handleLookup} className="space-y-6">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="下单时填写的接收邮箱"
            className="w-full rounded-xl border-2 border-neutral-200 bg-neutral-50 px-4 py-3 text-base transition-all duration-300 focus:outline-none focus:border-[#2a5298] focus:bg-white focus:-translate-y-1 focus:shadow-[0_10px_25px_-10px_rgba(42,82,152,0.6)] placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:bg-neutral-950"
          />

          <div className="flex items-stretch gap-3">
            <input
              type="text"
              required
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="6 位验证码"
              className="min-w-0 flex-1 rounded-xl border-2 border-neutral-200 bg-neutral-50 px-4 py-3 text-base transition-all duration-300 focus:outline-none focus:border-[#2a5298] focus:bg-white focus:-translate-y-1 focus:shadow-[0_10px_25px_-10px_rgba(42,82,152,0.6)] placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:bg-neutral-950"
            />
            <button
              type="button"
              onClick={requestCode}
              disabled={!email || cooldown > 0 || sending}
              className="shrink-0 whitespace-nowrap rounded-xl border-2 border-[#2a5298] px-5 text-sm font-semibold text-[#2a5298] transition-all duration-300 hover:bg-[#2a5298] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#2a5298] dark:border-[#5b7fc7] dark:text-[#8fb0e8] dark:hover:bg-[#2a5298] dark:hover:text-white"
            >
              {sending
                ? "发送中..."
                : cooldown > 0
                  ? `${cooldown}s`
                  : codeSent
                    ? "重新发送"
                    : "发送验证码"}
            </button>
          </div>

          <p className="text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">
            为保护隐私，订单不公开展示，需验证下单邮箱后才可查看。验证码 10 分钟有效。
          </p>

          <button
            type="submit"
            disabled={querying || !email || !code}
            className="w-full py-[18px] px-8 bg-gradient-to-r from-[#2a5298] to-[#7e22ce] text-white rounded-xl text-base font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(42,82,152,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(42,82,152,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {querying ? dict.lookup.querying : dict.lookup.query}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {results && (
          <div className="mt-6 space-y-3">
            {results.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{dict.lookup.notFound}</p>
            ) : (
              results.map((order) => (
                <OrderCard
                  key={order.orderNo}
                  order={order}
                  onResume={resumePayment}
                  dict={dict}
                  dateLocale={dateLocale}
                />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
