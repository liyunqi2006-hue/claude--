import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { decrypt } from "@/lib/crypto";
import { findUserOrderByNo } from "@/lib/user-orders";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { HTML_LANG } from "@/lib/i18n/config";
import StatusBadge from "@/components/dashboard/status-badge";
import FulfillmentBlock from "@/components/dashboard/fulfillment-block";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNo: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const { orderNo } = await params;
  const order = await findUserOrderByNo(
    { id: session.user.id, email: session.user.email },
    orderNo,
  );

  if (!order) {
    notFound();
  }

  const dict = await getDictionary();
  const dateLocale = HTML_LANG[await getLocale()];
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
        {dict.orderDetail.back}
      </Link>

      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {order.product.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {dict.orderDetail.orderNo} {order.orderNo}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <dl className="mt-6 space-y-2 text-sm">
          <Row label={dict.orderDetail.status} value={dict.enums.orderStatus[order.status]} />
          <Row
            label={dict.orderDetail.amount}
            value={`$${order.amountUSD.toString()} (¥${order.amountCNY.toString()})`}
          />
          {order.payChannel && (
            <Row label={dict.orderDetail.payMethod} value={dict.enums.payChannel[order.payChannel]} />
          )}
          <Row label={dict.orderDetail.createdAt} value={order.createdAt.toLocaleString(dateLocale)} />
          {order.paidAt && (
            <Row label={dict.orderDetail.paidAt} value={order.paidAt.toLocaleString(dateLocale)} />
          )}
        </dl>

        {deliveredContent && (
          <FulfillmentBlock
            title={isApiCredit ? dict.orderDetail.apiKey : dict.orderDetail.activationLink}
            content={deliveredContent}
            copyLabel={dict.dashboard.copy}
            copiedLabel={dict.dashboard.copied}
            hint={isApiCredit ? "Base URL: https://api.example.com" : undefined}
          />
        )}

        {!deliveredContent && order.status !== "pending" && (
          <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
            {dict.orderDetail.processing}
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
