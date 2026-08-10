import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "参数不正确" }, { status: 400 });
  }
  const { email, code } = parsed.data;

  const record = await prisma.verificationCode.findFirst({
    where: { email, purpose: "order_lookup", code, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) {
    return NextResponse.json({ error: "验证码错误或已过期" }, { status: 400 });
  }

  await prisma.verificationCode.update({ where: { id: record.id }, data: { usedAt: new Date() } });

  const orders = await prisma.order.findMany({
    where: { contactEmail: email },
    include: { product: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    orders: orders.map((order) => ({
      orderNo: order.orderNo,
      productName: order.product.name,
      amountUSD: order.amountUSD.toString(),
      amountCNY: order.amountCNY.toString(),
      contactEmail: order.contactEmail,
      status: order.status,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
    })),
  });
}
