import { Code2, KeyRound, Wallet } from "lucide-react";

const STEPS = [
  {
    icon: Wallet,
    title: "充值额度",
    desc: "选择档位并完成支付，额度立即到账，永久有效，用多少扣多少。",
  },
  {
    icon: KeyRound,
    title: "获取 Key",
    desc: "充值成功后，我们会通过邮件为您发送专属 API Key，可自行设置用量上限。",
  },
  {
    icon: Code2,
    title: "开始调用",
    desc: "使用与 Anthropic 官方一致的接口格式，替换 Base URL 与 Key 即可直接调用。",
    code: `curl https://api.example.com/v1/messages \\\n  -H "x-api-key: $YOUR_KEY" \\\n  -H "content-type: application/json" \\\n  -d '{"model":"claude-sonnet-5",\n      "messages":[...]}'`,
  },
];

export default function ApiHowItWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">如何使用</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">三步接入，无需申请，充值即用。</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
              <step.icon size={20} />
            </div>
            <div className="mt-4 text-sm font-medium text-neutral-400">STEP {i + 1}</div>
            <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{step.desc}</p>
            {step.code && (
              <pre className="mt-4 min-w-0 overflow-x-hidden whitespace-pre-wrap break-all rounded-lg bg-neutral-100 p-3 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {step.code}
              </pre>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
