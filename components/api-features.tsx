import { Boxes, Gauge, Clock, LifeBuoy, Server, Wallet } from "lucide-react";

const FEATURES = [
  {
    icon: Boxes,
    title: "全模型覆盖",
    desc: "支持 Claude Opus / Sonnet / Haiku 全系列模型，与官方同步更新。",
  },
  {
    icon: Server,
    title: "接口格式兼容",
    desc: "接口与 Anthropic 官方 API 格式一致，现有代码无需改动，替换 Key 即可切换。",
  },
  {
    icon: Gauge,
    title: "用量透明",
    desc: "每次调用的 Token 消耗与扣费明细均可查询，不含隐藏费用。",
  },
  {
    icon: Wallet,
    title: "无最低消费",
    desc: "按实际用量扣除额度，未使用部分不过期，无需担心浪费。",
  },
  {
    icon: Clock,
    title: "稳定可用",
    desc: "多节点中转，故障自动切换，保障调用请求的稳定与低延迟。",
  },
  {
    icon: LifeBuoy,
    title: "中文技术支持",
    desc: "接入过程中遇到问题，可随时联系客服获得中文技术支持。",
  },
];

export default function ApiFeatures() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">平台特性</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
              <feature.icon size={20} />
            </div>
            <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
