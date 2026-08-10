"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderStatusLabels } from "@/lib/labels";

interface LookupOrder {
  orderNo: string;
  productName: string;
  amountUSD: string;
  amountCNY: string;
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

function OrderCard({ order, onResume }: { order: LookupOrder; onResume: (orderNo: string) => void }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">{order.orderNo}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {orderStatusLabels[order.status] ?? order.status}
        </span>
      </div>
      <div className="mt-2 text-sm font-medium">{order.productName}</div>
      <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        ${order.amountUSD} (¥{order.amountCNY}) · {maskEmail(order.contactEmail)}
      </div>
      <div className="mt-1 text-xs text-neutral-400">
        下单 {new Date(order.createdAt).toLocaleString("zh-CN")}
        {order.paidAt ? ` · 支付 ${new Date(order.paidAt).toLocaleString("zh-CN")}` : ""}
      </div>
      {order.status === "pending" && (
        <button
          type="button"
          onClick={() => onResume(order.orderNo)}
          className="mt-3 rounded-lg bg-brand-700 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          继续支付
        </button>
      )}
    </div>
  );
}

export default function OrderLookupClient({ recentOrders }: { recentOrders: LookupOrder[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [querying, setQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<LookupOrder[] | null>(null);

  async function resumePayment(orderNo: string) {
    const res = await fetch(`/api/orders/${orderNo}/resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payChannel: "alipay" }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/pay/${orderNo}?url=${encodeURIComponent(data.paymentUrl)}`);
    }
  }

  async function requestCode() {
    if (!email || cooldown > 0) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/verification/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "order_lookup" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "验证码发送失败");
        return;
      }
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
        setError(data.error ?? "查询失败");
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
          <h2 className="mb-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">本设备的近期订单</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.orderNo} order={order} onResume={resumePayment} />
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        <span className="text-sm text-neutral-400">或</span>
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400">通过邮箱查询</h2>
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          为保护您的隐私，我们需要验证您的身份。请输入您下单时使用的收货邮箱。
        </p>
        <form onSubmit={handleLookup} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱地址"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
          />
          <div className="flex gap-2">
            <input
              type="text"
              required
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="验证码"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
            <button
              type="button"
              onClick={requestCode}
              disabled={!email || cooldown > 0 || sending}
              className="shrink-0 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              {cooldown > 0 ? `${cooldown}s` : "获取验证码"}
            </button>
          </div>
          <button
            type="submit"
            disabled={querying}
            className="w-full rounded-lg bg-brand-700 py-2.5 font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {querying ? "查询中..." : "查询订单"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {results && (
          <div className="mt-6 space-y-3">
            {results.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">未查询到相关订单</p>
            ) : (
              results.map((order) => <OrderCard key={order.orderNo} order={order} onResume={resumePayment} />)
            )}
          </div>
        )}
      </section>
    </div>
  );
}
