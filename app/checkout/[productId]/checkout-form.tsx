"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { format } from "@/lib/i18n/config";

const CHANNELS = ["alipay", "wxpay", "bank", "applepay", "link"] as const;

export default function CheckoutForm({
  productId,
  unitPrice,
  exchangeRate,
  defaultEmail,
  isSubscription,
}: {
  productId: string;
  unitPrice: number;
  exchangeRate: number;
  defaultEmail: string;
  isSubscription: boolean;
}) {
  const router = useRouter();
  const { dict } = useI18n();
  const [quantity, setQuantity] = useState(1);
  const [contactEmail, setContactEmail] = useState(defaultEmail);
  const [contactNote, setContactNote] = useState("");
  const [payChannel, setPayChannel] = useState<typeof CHANNELS[number]>("alipay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalUSD = (unitPrice * quantity).toFixed(2);
  const totalCNY = (unitPrice * quantity * exchangeRate).toFixed(2);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, contactEmail, contactNote, payChannel }),
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">{dict.checkout.quantity}</label>
        <input
          type="number"
          min={1}
          max={10}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-24 rounded border border-neutral-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{dict.checkout.contactEmail}</label>
        <input
          type="email"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full rounded border border-neutral-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          {isSubscription ? dict.checkout.subscriptionNote : dict.checkout.optionalNote}
        </label>
        <textarea
          value={contactNote}
          onChange={(e) => setContactNote(e.target.value)}
          rows={3}
          className="w-full rounded border border-neutral-300 px-3 py-2"
          placeholder={isSubscription ? dict.checkout.subscriptionPlaceholder : ""}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{dict.checkout.payMethod}</label>
        <div className="grid grid-cols-3 gap-2">
          {CHANNELS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setPayChannel(c)}
              className={`rounded border px-3 py-2 text-sm ${
                payChannel === c
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-neutral-300"
              }`}
            >
              {dict.enums.payChannel[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
        <span className="text-lg font-semibold">
          {format(dict.checkout.total, { usd: totalUSD })}
          <span className="ml-2 text-sm font-normal text-neutral-500">≈ ¥{totalCNY}</span>
        </span>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? dict.common.submitting : dict.checkout.pay}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
