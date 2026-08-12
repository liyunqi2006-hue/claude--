"use client";

import Image from "next/image";
import { Zap, Sparkles, ShieldCheck } from "lucide-react";
import { PRICE_TABLE } from "@/lib/pricing";
import { useI18n } from "@/lib/i18n/context";
import { useSubscriptionSelection } from "@/components/subscription-context";

export default function Hero() {
  const { plan, duration } = useSubscriptionSelection();
  const { dict } = useI18n();
  const price = PRICE_TABLE[plan][duration];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#7e22ce] text-white">
      {/* Background decoration */}
      <div className="absolute top-[-30%] right-[-20%] h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-32">
        {/* Left content */}
        <div className="relative z-10 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
          <div className="mb-6">
            <Image
              src="/claude-logo.png"
              alt="Claude"
              width={72}
              height={72}
              priority
              className="h-[72px] w-[72px] rounded-2xl shadow-lg shadow-black/20"
            />
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight lg:text-6xl">
            Claude 订阅
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              官方代付 · 一键激活
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/80 lg:text-xl">
            填写邮箱并付款，由我们为您完成官网订阅。官方将直接发送包含激活链接的邮件至您的邮箱，
            点击即可一键开通使用。
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">安全可靠</p>
                <p className="text-xs text-white/60">官方直发邮件</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">快速激活</p>
                <p className="text-xs text-white/60">支付后即刻处理</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className="relative z-10 flex flex-col items-center lg:items-end opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>专业代付服务</span>
          </div>

          <div className="group w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg">
                <Zap size={28} fill="white" strokeWidth={0} />
              </div>
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                当前套餐
              </span>
            </div>

            <div className="mt-8">
              <p key={duration} className="text-sm font-medium text-white/70">
                {dict.enums.duration[duration]}
              </p>
              <p key={plan} className="mt-1 text-3xl font-bold">
                {dict.enums.plan[plan]}
              </p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex items-baseline gap-2">
                <span key={`total-${price.total}`} className="text-5xl font-bold">
                  ${price.total.toFixed(2)}
                </span>
                <span className="text-sm text-white/60">USD</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">官方订阅费</span>
                  <span key={`official-${price.official}`} className="font-medium text-white/90">
                    ${price.official.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">服务费</span>
                  <span key={`service-${price.service}`} className="font-medium text-white/90">
                    ${price.service.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <a
              href="#pricing"
              className="mt-8 block w-full rounded-xl bg-white py-4 text-center text-base font-semibold text-[#2a5298] transition-all duration-300 hover:bg-white/90 hover:shadow-lg"
            >
              立即购买
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
