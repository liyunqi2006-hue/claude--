import Link from "next/link";
import { Cpu, Zap } from "lucide-react";
import type { Order, Product } from "@prisma/client";
import StatusBadge from "@/components/dashboard/status-badge";
import FulfillmentBlock from "@/components/dashboard/fulfillment-block";
import { payChannelLabels } from "@/lib/labels";

type OrderWithProduct = Order & { product: Product };

export default function OrderCard({
  order,
  deliveredContent,
}: {
  order: OrderWithProduct;
  deliveredContent: string | null;
}) {
  const isApiCredit = order.product.type === "api_credit";
  const Icon = isApiCredit ? Cpu : Zap;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
            <Icon size={18} />
          </span>
          <div>
            <p className="font-medium text-neutral-900 dark:text-neutral-100">
              {order.product.name}
            </p>
            {isApiCredit && order.product.creditAmount !== null && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                ${order.product.creditAmount.toString()} 额度
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link
          href={`/dashboard/orders/${order.orderNo}`}
          className="text-brand-700 hover:underline dark:text-brand-100"
        >
          {order.orderNo}
        </Link>
        <span>
          ${order.amountUSD.toString()} (¥{order.amountCNY.toString()})
          {order.payChannel ? ` · ${payChannelLabels[order.payChannel]}` : ""}
        </span>
      </div>

      {deliveredContent && (
        <FulfillmentBlock
          title={isApiCredit ? "API Key" : "激活链接"}
          content={deliveredContent}
          hint={isApiCredit ? "Base URL: https://api.example.com" : undefined}
        />
      )}
    </div>
  );
}
