import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { orderStatusLabels } from "@/lib/labels";

export default async function PayResultPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNo?: string }>;
}) {
  const { orderNo } = await searchParams;
  const order = orderNo
    ? await prisma.order.findUnique({ where: { orderNo } })
    : null;

  return (
    <main className="flex-1 mx-auto w-full max-w-lg px-6 py-12 text-center">
      <h1 className="mb-4 text-xl font-bold">支付结果</h1>
      {order ? (
        <>
          <p className="mb-2 text-neutral-600">订单号：{order.orderNo}</p>
          <p className="mb-6 text-lg font-medium">
            当前状态：{orderStatusLabels[order.status]}
          </p>
        </>
      ) : (
        <p className="mb-6 text-neutral-600">未找到订单信息，支付状态请以实际扣款为准</p>
      )}
      <Link href="/dashboard" className="text-blue-600 hover:underline">
        查看我的订单
      </Link>
    </main>
  );
}
