"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductType = "subscription" | "api_credits";

export default function FulfillmentForm({
  orderId,
  productType
}: {
  orderId: string;
  productType: ProductType;
}) {
  const router = useRouter();
  const [activationLink, setActivationLink] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSubscription = productType === "subscription";
  const isApiCredits = productType === "api_credits";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // 验证至少填写一个字段
    if (!activationLink && !apiKey) {
      setError("请至少填写一个字段");
      setLoading(false);
      return;
    }

    const response = await fetch(`/api/admin/orders/${orderId}/fulfill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activationLink: activationLink || undefined,
        apiKey: apiKey || undefined,
      }),
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
    <form onSubmit={submit} className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
      <h2 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-300">完成发货</h2>
      <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        根据商品类型填写相应的发货信息。保存后会自动发送邮件通知客户。
      </p>

      <div className="space-y-4">
        {/* 订阅激活链接 */}
        {isSubscription && (
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              订阅激活链接 <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={activationLink}
              onChange={(e) => setActivationLink(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              placeholder="https://claude.ai/activate/..."
              required={isSubscription}
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              客户点击此链接可激活 Claude Pro 订阅
            </p>
          </div>
        )}

        {/* API Key */}
        {isApiCredits && (
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              API Key <span className="text-red-500">*</span>
            </label>
            <textarea
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800"
              placeholder="sk-ant-api03-..."
              required={isApiCredits}
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              客户将收到此 API Key 用于调用 Claude API
            </p>
          </div>
        )}

        {/* 通用字段（如果两种类型都可能） */}
        {!isSubscription && !isApiCredits && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                激活链接（可选）
              </label>
              <input
                type="url"
                value={activationLink}
                onChange={(e) => setActivationLink(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                placeholder="https://claude.ai/activate/..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                API Key（可选）
              </label>
              <textarea
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800"
                placeholder="sk-ant-api03-..."
              />
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {loading ? "提交中..." : "✓ 保存并完成订单"}
      </button>
    </form>
  );
}
