import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";

export default async function PayResultPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNo?: string }>;
}) {
  const { orderNo } = await searchParams;
  const order = orderNo
    ? await prisma.order.findUnique({ where: { orderNo } })
    : null;
  const dict = await getDictionary();

  return (
    <main className="flex-1 mx-auto w-full max-w-lg px-6 py-12 text-center">
      <h1 className="mb-4 text-xl font-bold">{dict.pay.resultTitle}</h1>
      {order ? (
        <>
          <p className="mb-2 text-neutral-600">{dict.pay.orderNoLabel}{order.orderNo}</p>
          <p className="mb-6 text-lg font-medium">
            {dict.pay.currentStatus}{dict.enums.orderStatus[order.status]}
          </p>
        </>
      ) : (
        <p className="mb-6 text-neutral-600">{dict.pay.resultNotFound}</p>
      )}
      <Link href="/dashboard" className="text-blue-600 hover:underline">
        {dict.pay.viewOrders}
      </Link>
    </main>
  );
}
