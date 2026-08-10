import { Cpu } from "lucide-react";

export default function ApiHero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 sm:items-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Claude API 平台</h1>
        <p className="mt-3 text-lg font-medium text-brand">按量付费 · 稳定中转</p>
        <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-300">
          购买 API 额度，通过我们的中转平台直接调用 Claude 模型 —— 使用你自己的 API Key、自定义用量限制，按实际使用量付费。
        </p>
      </div>

      <div className="flex justify-center sm:justify-end">
        <div className="w-full max-w-xs rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white shadow-lg shadow-orange-500/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Cpu size={20} />
          </div>
          <ul className="mt-6 space-y-2 text-sm">
            <li>$50 起充，秒级到账</li>
            <li>全系列模型覆盖</li>
            <li>接口格式与官方一致</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
