"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "这是一项什么服务？",
    a: "本站提供 Claude（Anthropic）订阅与 API 额度的代付服务。您选择套餐并支付后，我们使用真实的官方支付渠道为您下单，官方会将激活链接直接发送到您填写的邮箱。",
  },
  {
    q: "为什么选择本平台？",
    a: "支持支付宝、微信支付、银行卡等国内常用支付方式，无需信用卡或外币账户即可完成代付，价格透明，官方费用与服务费分开展示，付款后最快 1 小时内完成开通。",
  },
  {
    q: "我凭什么信任你们？",
    a: "每笔代付都直接在 Anthropic 官网完成下单，激活链接由官方系统直接发出，不经过第三方转发。订单状态可随时在「查询订单」页面核实，支付前也可先咨询客服了解流程。",
  },
  {
    q: "如何付款？",
    a: "在套餐选择区选好方案后，点击「立即购买」即可跳转至对应的支付宝 / 微信 / 银行卡收银台完成付款，付款成功后系统会自动处理后续代付流程。",
  },
  {
    q: "如何查询订单状态？",
    a: "点击顶部导航「查询订单」，本设备下单的记录会自动展示；也可以用下单时填写的邮箱获取验证码后查询全部历史订单。",
  },
  {
    q: "可以退款吗？",
    a: "订单在官方激活链接发送前可申请取消退款；激活链接一经发送即视为服务完成交付，不再支持退款。详情请查看退款政策。",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">常见问题</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">购买前你需要了解的一切。</p>
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
