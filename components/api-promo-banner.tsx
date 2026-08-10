import Link from "next/link";
import { Cpu, ArrowRight } from "lucide-react";

export default function ApiPromoBanner() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
            <Cpu size={22} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">更喜欢按量付费的 API 接入？</h3>
            <p className="mt-1 max-w-xl text-sm text-neutral-600 dark:text-neutral-300">
              购买 API 额度，通过我们的中转平台直接调用 Claude 模型 —— 使用你自己的 API Key、自定义用量限制，按实际使用量付费。
            </p>
          </div>
        </div>
        <Link
          href="/api-platform"
          className="flex shrink-0 items-center gap-1 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          了解 API 平台 <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
