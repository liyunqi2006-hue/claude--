import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";
import { redirect } from "next/navigation";

const orderStatusLabels: Record<string, string> = {
  pending: "待支付",
  paid: "已支付",
  fulfilling: "处理中",
  completed: "已完成",
  cancelled: "已取消",
  refunded: "已退款",
};

export default async function AdminOrdersPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    include: {
      product: true,
      user: { select: { email: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">订单管理</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            最多显示最近 100 笔订单 · 共 {orders.length} 笔
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            返回控制台
          </Link>
          <Link
            href="/"
            className="text-sm text-neutral-600 hover:underline dark:text-neutral-400"
          >
            返回商城
          </Link>
        </div>
      </header>

      {/* 统计卡片 */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">待支付</div>
          <div className="mt-1 text-2xl font-bold">
            {orders.filter(o => o.status === "pending").length}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">已支付待处理</div>
          <div className="mt-1 text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === "paid").length}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">处理中</div>
          <div className="mt-1 text-2xl font-bold text-orange-600">
            {orders.filter(o => o.status === "fulfilling").length}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">已完成</div>
          <div className="mt-1 text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === "completed").length}
          </div>
        </div>
      </div>

      {/* 订单表格 */}
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
            <tr>
              <th className="px-4 py-3 font-medium">订单号</th>
              <th className="px-4 py-3 font-medium">商品</th>
              <th className="px-4 py-3 font-medium">客户</th>
              <th className="px-4 py-3 font-medium">金额</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">创建时间</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-mono text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {order.orderNo}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{order.product.name}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    数量: {order.quantity}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-neutral-600 dark:text-neutral-300">
                    {order.contactEmail}
                  </div>
                  {order.user?.email && (
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      注册用户
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">${order.totalUSD.toString()}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    USDT (TRC20)
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : order.status === "paid"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : order.status === "fulfilling"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                      : order.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}>
                    {orderStatusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                  <div>{order.createdAt.toLocaleDateString("zh-CN")}</div>
                  <div className="text-xs">{order.createdAt.toLocaleTimeString("zh-CN")}</div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    查看详情
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-neutral-500 dark:text-neutral-400">
            暂无订单
          </p>
        )}
      </div>
    </main>
  );
}
