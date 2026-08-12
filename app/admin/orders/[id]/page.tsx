import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";
import FulfillmentForm from "./fulfillment-form";

const orderStatusLabels: Record<string, string> = {
  pending: "待支付",
  paid: "已支付",
  fulfilling: "处理中",
  completed: "已完成",
  cancelled: "已取消",
  refunded: "已退款",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      product: true,
      user: { select: { email: true } }
    },
  });
  if (!order) notFound();

  const canFulfill = order.status === "paid" || order.status === "fulfilling";
  const isCompleted = order.status === "completed";

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link
        href="/admin/orders"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← 返回订单列表
      </Link>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">订单详情</h1>
          <p className="mt-1 font-mono text-sm text-neutral-500 dark:text-neutral-400">
            {order.orderNo}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              : order.status === "paid"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : order.status === "fulfilling"
              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
              : order.status === "completed"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
          }`}
        >
          {orderStatusLabels[order.status] || order.status}
        </span>
      </div>

      {/* 基本信息 */}
      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-semibold">基本信息</h2>
        <dl className="space-y-3 text-sm">
          <Row label="商品名称" value={order.product.name} />
          <Row label="购买数量" value={`${order.quantity} 个月`} />
          <Row label="订单金额" value={`$${order.totalUSD.toString()} USDT`} />
          <Row label="支付方式" value="USDT (TRC20)" />
          <Row label="客户邮箱" value={order.contactEmail} />
          {order.user?.email && (
            <Row label="注册用户" value={order.user.email} />
          )}
          {order.noteFromUser && (
            <Row label="用户备注" value={order.noteFromUser} />
          )}
        </dl>
      </div>

      {/* 时间线 */}
      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-semibold">订单时间线</h2>
        <div className="space-y-3 text-sm">
          <TimelineItem
            label="创建时间"
            time={order.createdAt}
            icon="📝"
          />
          {order.paidAt && (
            <TimelineItem
              label="支付时间"
              time={order.paidAt}
              icon="💰"
            />
          )}
          {order.expiresAt && order.status === "pending" && (
            <TimelineItem
              label="过期时间"
              time={order.expiresAt}
              icon="⏰"
              warning={order.expiresAt < new Date()}
            />
          )}
        </div>
      </div>

      {/* 发货信息 */}
      {(order.activationLink || order.apiKey) && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900/30 dark:bg-green-900/10">
          <h2 className="mb-4 flex items-center text-lg font-semibold text-green-800 dark:text-green-400">
            <span className="mr-2">✓</span>
            发货信息
          </h2>
          <dl className="space-y-3 text-sm">
            {order.activationLink && (
              <Row label="激活链接" value={order.activationLink} />
            )}
            {order.apiKey && (
              <Row label="API Key" value={order.apiKey} mono />
            )}
          </dl>
        </div>
      )}

      {/* 发货表单 */}
      {canFulfill && (
        <div className="mt-6">
          <FulfillmentForm orderId={order.id} productType={order.product.type} />
        </div>
      )}

      {/* 已完成提示 */}
      {isCompleted && !order.activationLink && !order.apiKey && (
        <div className="mt-6 rounded-lg bg-neutral-100 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
          ℹ️ 该订单已标记为完成，但未记录发货信息
        </div>
      )}
    </main>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[10rem_1fr] gap-3 border-b border-neutral-100 pb-2 last:border-0 dark:border-neutral-800">
      <dt className="text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd className={`break-words ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}

function TimelineItem({
  label,
  time,
  icon,
  warning = false,
}: {
  label: string;
  time: Date;
  icon: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        <div className={`text-xs ${warning ? "text-red-600 dark:text-red-400" : "text-neutral-500 dark:text-neutral-400"}`}>
          {time.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}
          {warning && " (已过期)"}
        </div>
      </div>
    </div>
  );
}
