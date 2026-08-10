import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { orderStatusLabels, payChannelLabels } from "@/lib/labels";

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
  const order = await prisma.order.findUnique({
    where: { orderNo },
    include: { product: true, fulfillment: true },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  const deliveredContent = order.fulfillment
    ? decrypt(order.fulfillment.deliveredContent)
    : null;

  return (
    <main className="flex-1 mx-auto w-full max-w-lg px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold">{order.product.name}</h1>
      <p className="mb-6 text-neutral-500">订单号 {order.orderNo}</p>

      <dl className="space-y-2 text-sm">
        <Row label="状态" value={orderStatusLabels[order.status]} />
        <Row label="金额" value={`$${order.amountUSD.toString()} (¥${order.amountCNY.toString()})`} />
        {order.payChannel && (
          <Row label="支付方式" value={payChannelLabels[order.payChannel]} />
        )}
        <Row label="下单时间" value={order.createdAt.toLocaleString("zh-CN")} />
        {order.paidAt && (
          <Row label="支付时间" value={order.paidAt.toLocaleString("zh-CN")} />
        )}
      </dl>

      {deliveredContent && (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-4">
          <h2 className="mb-2 font-medium text-green-800">发货内容</h2>
          <pre className="whitespace-pre-wrap text-sm text-green-900">
            {deliveredContent}
          </pre>
        </div>
      )}

      {!deliveredContent && order.status !== "pending" && (
        <p className="mt-8 text-sm text-neutral-500">
          订单处理中，完成后将通过邮件通知您，也可以刷新此页面查看。
        </p>
      )}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-neutral-100 py-1">
      <dt className="text-neutral-500">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
