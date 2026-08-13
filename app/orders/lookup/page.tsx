import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
import OrderLookupClient from "./order-lookup-client";

export default async function OrderLookupPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("recent_order_nos")?.value ?? "";
  const orderNos = raw.split(",").filter(Boolean);

  const recentOrders = orderNos.length
    ? await prisma.order.findMany({
        where: { orderNo: { in: orderNos } },
        include: { product: true },
      })
    : [];

  const ordered = orderNos
    .map((no) => recentOrders.find((o) => o.orderNo === no))
    .filter((o): o is NonNullable<typeof o> => Boolean(o));

  const serialized = ordered.map((order) => ({
    id: order.id,
    orderNo: order.orderNo,
    productName: order.product.name,
    totalUSD: order.totalUSD.toString(),
    contactEmail: order.contactEmail,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    paidAt: order.paidAt?.toISOString() ?? null,
  }));

  const dict = await getDictionary();

  return (
    <main className="flex flex-1 flex-col lg:flex-row">
      {/* 左侧渐变面板 */}
      <div className="relative flex-none lg:w-[40%] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#7e22ce] text-white p-12 lg:p-20 flex flex-col justify-between overflow-hidden opacity-0 animate-[fadeInLeft_0.8s_ease-out_0.2s_forwards]">
        <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-pulse-slow" />
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            {dict.lookup.title}
          </h1>
          <p className="text-lg opacity-90 font-light leading-relaxed">
            {dict.lookup.subtitle}
          </p>
        </div>
        <div className="relative z-10 mt-12 space-y-6 lg:mt-0">
          <div className="flex items-start gap-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards]">
            <div className="flex-shrink-0 w-11 h-11 border-2 border-white/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/60 hover:-translate-y-0.5">
              <span className="text-lg font-bold">1</span>
            </div>
            <p className="pt-2 text-[0.95rem] opacity-80 font-light">
              填写下单时使用的邮箱
            </p>
          </div>
          <div className="flex items-start gap-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.6s_forwards]">
            <div className="flex-shrink-0 w-11 h-11 border-2 border-white/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/60 hover:-translate-y-0.5">
              <span className="text-lg font-bold">2</span>
            </div>
            <p className="pt-2 text-[0.95rem] opacity-80 font-light">
              接收邮箱验证码完成身份验证
            </p>
          </div>
          <div className="flex items-start gap-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.8s_forwards]">
            <div className="flex-shrink-0 w-11 h-11 border-2 border-white/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/60 hover:-translate-y-0.5">
              <span className="text-lg font-bold">3</span>
            </div>
            <p className="pt-2 text-[0.95rem] opacity-80 font-light">
              查看订单状态与支付进度
            </p>
          </div>
        </div>
      </div>

      {/* 右侧内容面板 */}
      <div className="flex-1 bg-white dark:bg-neutral-950 p-12 lg:p-20 opacity-0 animate-[fadeInRight_0.8s_ease-out_0.4s_forwards]">
        <div className="mx-auto max-w-lg">
          <OrderLookupClient recentOrders={serialized} />
        </div>
      </div>
    </main>
  );
}
