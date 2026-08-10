import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { orderStatusLabels, payChannelLabels } from "@/lib/labels";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { product: true, user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">订单管理</h1>
          <p className="mt-1 text-sm text-neutral-500">最多显示最近 100 笔订单</p>
        </div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">返回商城</Link>
      </header>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">订单</th>
              <th className="px-4 py-3 font-medium">商品 / 用户</th>
              <th className="px-4 py-3 font-medium">金额 / 渠道</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">时间</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-mono text-blue-600 hover:underline">{order.orderNo}</Link>
                </td>
                <td className="px-4 py-3">
                  <div>{order.product.name}</div>
                  <div className="mt-1 text-neutral-500">{order.user.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div>${order.amountUSD.toString()} (¥{order.amountCNY.toString()})</div>
                  <div className="mt-1 text-neutral-500">{order.payChannel ? payChannelLabels[order.payChannel] : "未支付"}</div>
                </td>
                <td className="px-4 py-3">{orderStatusLabels[order.status]}</td>
                <td className="px-4 py-3 text-neutral-500">{order.createdAt.toLocaleString("zh-CN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-8 text-center text-neutral-500">暂无订单</p>}
      </div>
    </main>
  );
}
