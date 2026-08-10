import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
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
    orderNo: order.orderNo,
    productName: order.product.name,
    amountUSD: order.amountUSD.toString(),
    amountCNY: order.amountCNY.toString(),
    contactEmail: order.contactEmail,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    paidAt: order.paidAt?.toISOString() ?? null,
  }));

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold">查询订单</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          轻松查询您的 Claude 订阅代付订单状态。
        </p>
      </div>
      <OrderLookupClient recentOrders={serialized} />
    </main>
  );
}
