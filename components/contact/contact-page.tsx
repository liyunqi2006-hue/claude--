"use client";

import { useState, FormEvent } from "react";
import { Mail, MessageCircle, Clock } from "lucide-react";

type SubmitState = "idle" | "success" | "error";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setIsSubmitting(true);
    setResult("idle");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          orderNo: data.get("orderNo") || undefined,
          message: data.get("message"),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult("error");
        setErrorMsg(json.error ?? "发送失败，请稍后重试");
        return;
      }
      setResult("success");
      form.reset();
    } catch {
      setResult("error");
      setErrorMsg("网络错误，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        {/* Left Panel */}
        <div className="relative flex-none lg:w-[40%] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#7e22ce] text-white p-12 lg:p-20 flex flex-col justify-between overflow-hidden animate-[fadeInLeft_0.8s_ease-out_0.2s_forwards] opacity-0">
          {/* Background decoration */}
          <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-pulse-slow" />

          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Claude 代付
            </h1>
            <p className="text-lg opacity-90 font-light leading-relaxed">
              专业的 Claude 订阅代付服务平台，安全、快速、可靠
            </p>
          </div>

          <div className="relative z-10 space-y-12 my-16 lg:my-0">
            <div className="flex items-start gap-5 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards]">
              <div className="flex-shrink-0 w-16 h-16 border-[3px] border-white/40 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/70 hover:-translate-y-0.5">
                <Mail className="w-9 h-9" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 opacity-90">
                  电子邮件
                </h3>
                <p className="text-[0.95rem] opacity-70 font-light leading-relaxed">
                  3818051816@qq.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.6s_forwards]">
              <div className="flex-shrink-0 w-16 h-16 border-[3px] border-white/40 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/70 hover:-translate-y-0.5">
                <MessageCircle className="w-9 h-9" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 opacity-90">
                  在线客服
                </h3>
                <p className="text-[0.95rem] opacity-70 font-light leading-relaxed">
                  Telegram / 微信
                  <br />
                  10:00-22:00 (UTC+8)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.8s_forwards]">
              <div className="flex-shrink-0 w-16 h-16 border-[3px] border-white/40 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/70 hover:-translate-y-0.5">
                <Clock className="w-9 h-9" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 opacity-90">
                  响应时效
                </h3>
                <p className="text-[0.95rem] opacity-70 font-light leading-relaxed">
                  1-2个工作日回复
                  <br />
                  紧急订单优先处理
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex gap-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_1s_forwards]">
            <div className="w-10 h-10 border-[1.5px] border-white/30 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-white/15 hover:border-white hover:-translate-y-1">
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </div>
            <div className="w-10 h-10 border-[1.5px] border-white/30 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-white/15 hover:border-white hover:-translate-y-1">
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
              </svg>
            </div>
            <div className="w-10 h-10 border-[1.5px] border-white/30 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-white/15 hover:border-white hover:-translate-y-1">
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-white p-12 lg:p-20 opacity-0 animate-[fadeInRight_0.8s_ease-out_0.4s_forwards]">
          <div className="max-w-2xl">
            <div className="mb-16">
              <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 mb-3">
                给我们留言
              </h2>
              <p className="text-base text-neutral-600 font-light">
                请填写以下信息，我们会尽快回复您
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-base text-neutral-800 mb-3 tracking-wide font-bold"
                >
                  你的邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="请填写您的邮箱"
                  className="w-full border-0 border-b-[1.5px] border-neutral-200 py-3 text-base text-neutral-900 bg-transparent transition-all duration-300 focus:outline-none focus:border-[#2a5298] focus:-translate-y-0.5 placeholder:text-neutral-400"
                />
              </div>

              <div className="group">
                <label
                  htmlFor="orderNo"
                  className="block text-base text-neutral-800 mb-3 tracking-wide font-bold"
                >
                  订单号（可选）
                </label>
                <input
                  type="text"
                  id="orderNo"
                  name="orderNo"
                  placeholder="如有相关订单请填写"
                  className="w-full border-0 border-b-[1.5px] border-neutral-200 py-3 text-base text-neutral-900 bg-transparent transition-all duration-300 focus:outline-none focus:border-[#2a5298] focus:-translate-y-0.5 placeholder:text-neutral-400"
                />
              </div>

              <div className="group">
                <label
                  htmlFor="message"
                  className="block text-base text-neutral-800 mb-3 tracking-wide font-bold"
                >
                  详细描述你的问题
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="请详细描述您遇到的问题或需要咨询的内容"
                  className="w-full border-0 border-b-[1.5px] border-neutral-200 py-3 text-base text-neutral-900 bg-transparent transition-all duration-300 focus:outline-none focus:border-[#2a5298] focus:-translate-y-0.5 placeholder:text-neutral-400 resize-y min-h-[120px]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-[18px] px-8 bg-gradient-to-r from-[#2a5298] to-[#7e22ce] text-white rounded-xl text-base font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(42,82,152,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(42,82,152,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? "发送中..." : "发送留言"}
              </button>

              {result === "success" && (
                <p className="text-sm text-green-600">
                  感谢您的留言！我们会尽快通过邮件回复您。
                </p>
              )}
              {result === "error" && (
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-neutral-50 px-10 py-6 text-center text-xs text-neutral-500 leading-relaxed border-t border-neutral-200">
        本平台仅提供代订阅付费服务，不发行、不持有礼品卡，仅协助用户代付，与官方品牌无任何关联。
      </div>

    </div>
  );
}
