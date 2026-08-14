import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
import { PAYMENT_CONFIG, calculateUsdtAmount } from "@/lib/payment-config";
import PaymentClient from "./payment-client";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await auth();
  const dict = await getDictionary();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true },
  });

  if (!order) {
    notFound();
  }

  // 只有订单所有者或未登录但匹配邮箱的用户可以访问
  if (session?.user?.email && order.contactEmail !== session.user.email) {
    redirect("/");
  }

  // 待支付但已超过有效期：标记为已取消
  if (order.status === "pending" && order.expiresAt < new Date()) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "cancelled" },
    });
    redirect(`/orders/${orderId}/result`);
  }

  // 已支付/已取消等非待支付订单跳转到结果页
  if (order.status !== "pending") {
    redirect(`/orders/${orderId}/result`);
  }

  const usdtAmount = calculateUsdtAmount(Number(order.totalUSD));

  return (
    <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">{dict.payment.title}</h1>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
        {/* 订单信息 */}
        <div className="mb-8 space-y-3 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">{dict.payment.orderNo}</span>
            <span className="font-mono font-medium">{order.orderNo}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">{dict.payment.amount}</span>
            <span className="text-2xl font-bold text-brand">${Number(order.totalUSD).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">{dict.payment.paymentMethod}</span>
            <span className="font-medium">{dict.enums.payChannel.usdt}</span>
          </div>
        </div>

        <PaymentClient
          orderId={order.id}
          orderNo={order.orderNo}
          usdAmount={Number(order.totalUSD).toFixed(2)}
          usdtAmount={usdtAmount}
          usdtAddress={PAYMENT_CONFIG.USDT_TRC20_ADDRESS}
        />
      </div>
    </main>
  );
}
