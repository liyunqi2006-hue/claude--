"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "这个 API 平台是什么？",
    a: "本平台是 Claude 官方 API 的中转服务，充值额度后按实际用量扣费，接口格式与官方一致，无需自行申请海外支付方式。",
  },
  {
    q: "和官方 API 有什么关系？",
    a: "调用最终仍经由官方模型处理，我们只是提供计费与转发层，保证接口稳定可用，不会篡改或记录您的请求内容。",
  },
  {
    q: "充值的额度会过期吗？",
    a: "不会。充值到账后额度永久有效，按实际 Token 用量扣除，用不完可以留到以后使用。",
  },
  {
    q: "如何获取 API Key？",
    a: "充值成功后，我们会将专属 API Key 发送到您下单时填写的邮箱，凭 Key 即可直接调用。",
  },
  {
    q: "支持哪些模型？",
    a: "支持 Claude Opus、Sonnet、Haiku 全系列模型，随官方更新同步上线最新版本。",
  },
  {
    q: "有稳定性保障吗？",
    a: "平台采用多节点中转，遇到单节点异常会自动切换，尽量保证调用请求的可用性与响应速度。",
  },
];

export default function ApiFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">常见问题</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">接入前你需要了解的一切。</p>
      </div>
      <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.q}
              className="px-6 py-4"
              onMouseEnter={() => setOpenIndex(index)}
              onMouseLeave={() => setOpenIndex((current) => (current === index ? null : current))}
            >
              <div className="flex cursor-default items-center justify-between text-sm font-medium">
                {item.q}
                <span className={`ml-4 text-neutral-400 transition ${isOpen ? "rotate-45" : ""}`}>+</span>
              </div>
              {isOpen && (
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
