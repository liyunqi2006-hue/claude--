import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { decrypt } from "@/lib/crypto";
import { findUserOrders } from "@/lib/user-orders";
import DashboardTabs from "@/components/dashboard/dashboard-tabs";
import OrderCard from "@/components/dashboard/order-card";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { tab: rawTab } = await searchParams;
  const tab = rawTab === "subscription" || rawTab === "api_credit" ? rawTab : "all";

  const orders = await findUserOrders({ id: session.user.id, email: session.user.email });

  const completedCount = orders.filter((o) => o.status === "completed").length;
  const totalCreditUSD = orders
    .filter((o) => o.status === "completed" && o.product.type === "api_credit")
    .reduce((sum, o) => sum + Number(o.product.creditAmount ?? 0), 0);

  const visibleOrders = orders.filter((o) => tab === "all" || o.product.type === tab);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="已完成订单数" value={String(completedCount)} />
        <StatCard label="累计充值额度" value={`$${totalCreditUSD.toFixed(2)}`} />
      </div>

      <DashboardTabs active={tab} />

      {visibleOrders.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-neutral-500 dark:text-neutral-400">暂无订单</p>
          <div className="mt-4 flex justify-center gap-3 text-sm font-medium">
            <Link href="/" className="text-brand-700 hover:underline dark:text-brand-100">
              浏览订阅套餐
            </Link>
            <Link
              href="/api-platform"
              className="text-brand-700 hover:underline dark:text-brand-100"
            >
              浏览 API 平台
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              deliveredContent={
                order.fulfillment ? decrypt(order.fulfillment.deliveredContent) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        {value}
      </p>
    </div>
  );
}
