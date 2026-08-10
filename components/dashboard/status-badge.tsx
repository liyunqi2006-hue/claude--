import type { OrderStatus } from "@prisma/client";
import { orderStatusLabels } from "@/lib/labels";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  paid: "bg-brand-50 text-brand-700 dark:bg-brand/10 dark:text-brand-100",
  fulfilling: "bg-brand-50 text-brand-700 dark:bg-brand/10 dark:text-brand-100",
  completed: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  refunded: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {orderStatusLabels[status]}
    </span>
  );
}
