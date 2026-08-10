import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildPaymentUrl, type EpayType } from "@/lib/epay";

const schema = z.object({
  payChannel: z.enum(["alipay", "wxpay", "bank", "applepay", "link"]),
});

export async function POST(request: Request, { params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "参数不正确" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { orderNo }, include: { product: true } });
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }
  if (order.status !== "pending") {
    return NextResponse.json({ error: "该订单无需再次支付" }, { status: 409 });
  }

  const paymentUrl = buildPaymentUrl({
    outTradeNo: order.orderNo,
    name: order.product.name,
    money: order.amountCNY.toFixed(2),
    type: parsed.data.payChannel as EpayType,
  });

  return NextResponse.json({ paymentUrl });
}
