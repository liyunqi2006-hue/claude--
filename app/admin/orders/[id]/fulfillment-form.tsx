"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FulfillmentForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/admin/orders/${orderId}/fulfill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveredContent: content }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "履约失败");
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-blue-200 bg-blue-50 p-5">
      <h2 className="mb-3 font-semibold">完成履约</h2>
      <p className="mb-3 text-sm text-neutral-600">填写 API Key、开通凭证或交付说明。内容会加密后保存，仅用户本人可查看。</p>
      <textarea required rows={6} value={content} onChange={(event) => setContent(event.target.value)} className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm" placeholder="例如：API Key: sk-ant-..." />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="mt-3 rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
        {loading ? "提交中..." : "保存并完成订单"}
      </button>
    </form>
  );
}
