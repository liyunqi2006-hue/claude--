import { Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 sm:items-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Claude 订阅</h1>
        <p className="mt-3 text-lg font-medium text-brand">官方代付 · 一键激活</p>
        <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-300">
          填写邮箱并付款，由我们为您完成官网扣费。官方将直接发送包含激活链接的邮件至您的邮箱，点击即可一键开通使用。
        </p>
      </div>

      <div className="flex justify-center sm:justify-end">
        <div className="w-full max-w-xs rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white shadow-lg shadow-orange-500/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Zap size={20} fill="currentColor" />
          </div>
          <p className="mt-6 text-sm text-white/80">当前套餐</p>
          <p className="mt-1 text-2xl font-bold">1 个月 Claude Pro</p>
          <p className="mt-4 text-3xl font-bold">$25.00</p>
        </div>
      </div>
    </section>
  );
}
