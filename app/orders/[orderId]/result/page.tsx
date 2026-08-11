import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default async function OrderResultPage({
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

  // 权限检查
  if (session?.user?.email && order.contactEmail !== session.user.email) {
    redirect("/");
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      title: "等待支付",
      message: "请完成支付以继续处理您的订单",
    },
    paid: {
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      title: "支付确认中",
      message: "我们正在确认您的付款，通常需要 5-30 分钟",
    },
    fulfilling: {
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      title: "订单处理中",
      message: "我们正在处理您的订单，完成后会发送邮件通知",
    },
    completed: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
      title: "订单已完成",
      message: "订单已完成，激活链接或 API Key 已发送到您的邮箱",
    },
    cancelled: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
      title: "订单已取消",
      message: "订单已取消",
    },
    refunded: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
      title: "订单已退款",
      message: "订单已退款",
    },
  };

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-12">
      <div className={`rounded-2xl border p-8 text-center ${status.bg}`}>
        <StatusIcon className={`mx-auto h-16 w-16 ${status.color}`} />
        <h1 className="mt-4 text-2xl font-bold">{status.title}</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">{status.message}</p>
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-semibold">{dict.orderDetail.orderNo}</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">订单号</span>
            <span className="font-mono font-medium">{order.orderNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">商品</span>
            <span className="font-medium">{order.product.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">金额</span>
            <span className="font-medium">${Number(order.totalUSD).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">状态</span>
            <span className="font-medium">{dict.enums.orderStatus[order.status]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">联系邮箱</span>
            <span className="font-medium">{order.contactEmail}</span>
          </div>
        </div>

        {order.status === "pending" && (
          <Link
            href={`/payment/${order.id}`}
            className="mt-6 block w-full rounded-lg bg-brand px-6 py-3 text-center font-semibold text-white transition hover:bg-brand-600"
          >
            前往支付
          </Link>
        )}

        {order.status === "completed" && order.activationLink && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="mb-2 text-sm font-medium text-green-900 dark:text-green-200">
              激活链接
            </p>
            <a
              href={order.activationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-green-700 underline dark:text-green-300"
            >
              {order.activationLink}
            </a>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          ← 返回首页
        </Link>
      </div>
    </main>
  );
}
