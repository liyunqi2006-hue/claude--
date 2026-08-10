import { ClipboardList, ShieldCheck, MailCheck } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "提交需求",
    desc: "选择需要的 Claude 套餐与时长，并填写接收订阅链接的邮箱。",
  },
  {
    icon: ShieldCheck,
    title: "安全代付",
    desc: "我们收取服务费后，使用美国主流银行签发的真实信用卡，在 Anthropic 官网为您代付订阅。",
  },
  {
    icon: MailCheck,
    title: "官方直发",
    desc: "您将在邮箱中直接收到由 Anthropic 官方发送的订阅激活链接，点击即可绑定至您的账号。",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">工作原理</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          三步完成，订阅由 Anthropic 官方直接开通并发送
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
              <step.icon size={20} />
            </div>
            <div className="mt-4 text-sm font-medium text-neutral-400">STEP {i + 1}</div>
            <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
