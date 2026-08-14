import Link from "next/link";
import { getAdminSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { cancelExpiredOrders } from "@/lib/orders";

export default async function AdminHomePage() {
  const session = await getAdminSession();
  // 允许无登录访问（通过隐藏按键设置密码）

  await cancelExpiredOrders();

  // 获取统计数据
  const [
    totalOrders,
    pendingOrders,
    paidOrders,
    completedOrders,
    todayOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "paid" } }),
    prisma.order.count({ where: { status: "completed" } }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  const stats = [
    { label: "总订单", value: totalOrders, color: "blue" },
    { label: "待支付", value: pendingOrders, color: "yellow" },
    { label: "待发货", value: paidOrders, color: "orange" },
    { label: "已完成", value: completedOrders, color: "green" },
    { label: "今日订单", value: todayOrders, color: "purple" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">后台管理</h1>
        {session && (
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            欢迎回来，{session.username}
          </p>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg border p-6 ${
              stat.color === "blue"
                ? "border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10"
                : stat.color === "yellow"
                ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-900/10"
                : stat.color === "orange"
                ? "border-orange-200 bg-orange-50 dark:border-orange-900/30 dark:bg-orange-900/10"
                : stat.color === "green"
                ? "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10"
                : "border-purple-200 bg-purple-50 dark:border-purple-900/30 dark:bg-purple-900/10"
            }`}
          >
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* 快速操作 */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">快速操作</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            href="/admin/orders"
            icon="📦"
            title="订单管理"
            description="查看和处理所有订单"
          />
          <QuickLink
            href="/admin/orders?status=paid"
            icon="🚚"
            title="待发货订单"
            description="处理已支付的订单"
          />
          <QuickLink
            href="/admin/products"
            icon="🛍️"
            title="商品管理"
            description="管理商品和价格"
            disabled
          />
          <QuickLink
            href="/admin/settings"
            icon="⚙️"
            title="系统设置"
            description="配置支付和邮件"
            disabled
          />
          <QuickLink
            href="/admin/users"
            icon="👥"
            title="用户管理"
            description="查看用户信息"
            disabled
          />
          <QuickLink
            href="/admin/logs"
            icon="📊"
            title="操作日志"
            description="查看管理员操作记录"
            disabled
          />
        </div>
      </div>

      {/* 最近订单 */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">最近订单</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            查看全部 →
          </Link>
        </div>
        <RecentOrders />
      </div>
    </main>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
  disabled = false,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
}) {
  const content = (
    <div
      className={`flex items-start gap-4 rounded-lg border border-neutral-200 bg-white p-5 transition-all ${
        disabled
          ? "cursor-not-allowed opacity-50 dark:border-neutral-800 dark:bg-neutral-900"
          : "hover:border-blue-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-700"
      }`}
    >
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </div>
        {disabled && (
          <div className="mt-2 text-xs text-neutral-500">即将推出</div>
        )}
      </div>
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

async function RecentOrders() {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
    },
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        暂无订单
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full bg-white text-sm dark:bg-neutral-900">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-left dark:border-neutral-800 dark:bg-neutral-800/50">
          <tr>
            <th className="px-4 py-3 font-medium">订单号</th>
            <th className="px-4 py-3 font-medium">商品</th>
            <th className="px-4 py-3 font-medium">金额</th>
            <th className="px-4 py-3 font-medium">状态</th>
            <th className="px-4 py-3 font-medium">时间</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-mono text-blue-600 hover:underline dark:text-blue-400"
                >
                  {order.orderNo}
                </Link>
              </td>
              <td className="px-4 py-3">{order.product.name}</td>
              <td className="px-4 py-3 font-medium">
                ${order.totalUSD.toString()}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : order.status === "paid"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : order.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}
                >
                  {order.status === "pending"
                    ? "待支付"
                    : order.status === "paid"
                    ? "已支付"
                    : order.status === "fulfilling"
                    ? "处理中"
                    : order.status === "completed"
                    ? "已完成"
                    : order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                {new Date(order.createdAt).toLocaleDateString("zh-CN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
