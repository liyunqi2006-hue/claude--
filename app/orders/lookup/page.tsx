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
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold">{dict.lookup.title}</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">{dict.lookup.subtitle}</p>
      </div>
      <OrderLookupClient recentOrders={serialized} />
    </main>
  );
}
