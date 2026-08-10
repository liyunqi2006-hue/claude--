import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderStatusLabels, payChannelLabels } from "@/lib/labels";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">我的订单</h1>

      {orders.length === 0 ? (
        <p className="text-neutral-500">
          暂无订单，去{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            首页
          </Link>{" "}
          看看吧
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.orderNo}`}
              className="block rounded-lg border border-neutral-200 bg-white p-4 hover:border-blue-400"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{order.product.name}</span>
                <span className="text-sm text-neutral-500">
                  {orderStatusLabels[order.status]}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-neutral-500">
                <span>{order.orderNo}</span>
                <span>
                  ${order.amountUSD.toString()} (¥{order.amountCNY.toString()})
                  {order.payChannel ? ` · ${payChannelLabels[order.payChannel]}` : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
