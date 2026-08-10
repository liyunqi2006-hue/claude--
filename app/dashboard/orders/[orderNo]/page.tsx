import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { decrypt } from "@/lib/crypto";
import { findUserOrderByNo } from "@/lib/user-orders";
import { orderStatusLabels, payChannelLabels } from "@/lib/labels";
import StatusBadge from "@/components/dashboard/status-badge";
import FulfillmentBlock from "@/components/dashboard/fulfillment-block";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNo: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { orderNo } = await params;
  const order = await findUserOrderByNo(
    { id: session.user.id, email: session.user.email },
    orderNo,
  );

  if (!order) {
    notFound();
  }

  const deliveredContent = order.fulfillment
    ? decrypt(order.fulfillment.deliveredContent)
    : null;
  const isApiCredit = order.product.type === "api_credit";

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-100"
      >
        ← 返回仪表盘
      </Link>

      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {order.product.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              订单号 {order.orderNo}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <dl className="mt-6 space-y-2 text-sm">
          <Row label="状态" value={orderStatusLabels[order.status]} />
          <Row
            label="金额"
            value={`$${order.amountUSD.toString()} (¥${order.amountCNY.toString()})`}
          />
          {order.payChannel && (
            <Row label="支付方式" value={payChannelLabels[order.payChannel]} />
          )}
          <Row label="下单时间" value={order.createdAt.toLocaleString("zh-CN")} />
          {order.paidAt && (
            <Row label="支付时间" value={order.paidAt.toLocaleString("zh-CN")} />
          )}
        </dl>

        {deliveredContent && (
          <FulfillmentBlock
            title={isApiCredit ? "API Key" : "激活链接"}
            content={deliveredContent}
            hint={isApiCredit ? "Base URL: https://api.example.com" : undefined}
          />
        )}

        {!deliveredContent && order.status !== "pending" && (
          <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
            订单处理中，完成后将通过邮件通知您，也可以刷新此页面查看。
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-neutral-100 py-1.5 dark:border-neutral-800">
      <dt className="text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd className="text-neutral-900 dark:text-neutral-100">{value}</dd>
    </div>
  );
}
