import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { orderStatusLabels, payChannelLabels } from "@/lib/labels";
import FulfillmentForm from "./fulfillment-form";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { product: true, user: { select: { email: true } }, fulfillment: true },
  });
  if (!order) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">← 返回订单列表</Link>
      <h1 className="mt-4 text-2xl font-bold">订单 {order.orderNo}</h1>
      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <dl className="space-y-3 text-sm">
          <Row label="商品" value={order.product.name} />
          <Row label="用户邮箱" value={order.user.email} />
          <Row label="联系邮箱" value={order.contactEmail} />
          <Row label="订单状态" value={orderStatusLabels[order.status]} />
          <Row label="支付金额" value={`¥${order.amountCNY.toString()}`} />
          <Row label="支付方式" value={order.payChannel ? payChannelLabels[order.payChannel] : "未支付"} />
          {order.tradeNo && <Row label="支付平台交易号" value={order.tradeNo} />}
          {order.contactNote && <Row label="用户备注" value={order.contactNote} />}
        </dl>
      </div>
      {(order.status === "paid" || order.status === "fulfilling") && (
        <div className="mt-6"><FulfillmentForm orderId={order.id} /></div>
      )}
      {order.fulfillment && <p className="mt-6 rounded bg-green-50 p-4 text-sm text-green-800">该订单已经完成履约。</p>}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-[9rem_1fr] gap-3 border-b border-neutral-100 pb-2 last:border-0"><dt className="text-neutral-500">{label}</dt><dd className="break-words">{value}</dd></div>;
}
