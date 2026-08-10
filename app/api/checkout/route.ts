import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { buildPaymentUrl, type EpayType } from "@/lib/epay";
import { usdToCny } from "@/lib/exchange";

const checkoutSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).default(1),
  contactEmail: z.string().email(),
  contactNote: z.string().max(2000).optional(),
  payChannel: z.enum(["alipay", "wxpay", "bank", "applepay", "link"]),
});

function generateOrderNo(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `ORD${ts}${rand}`.toUpperCase();
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "参数不正确" }, { status: 400 });
  }
  const { productId, quantity, contactEmail, contactNote, payChannel } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) {
    return NextResponse.json({ error: "商品不存在或已下架" }, { status: 404 });
  }

  const amountUSD = Number(product.priceUSD) * quantity;
  const amountCNY = usdToCny(amountUSD);
  const orderNo = generateOrderNo();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const order = await prisma.order.create({
    data: {
      orderNo,
      userId: session.user.id,
      productId: product.id,
      quantity,
      amountUSD,
      amountCNY,
      contactEmail,
      contactNote,
      expiresAt,
    },
  });

  const paymentUrl = buildPaymentUrl({
    outTradeNo: order.orderNo,
    name: product.name,
    money: amountCNY.toFixed(2),
    type: payChannel as EpayType,
  });

  return NextResponse.json({ orderNo: order.orderNo, paymentUrl });
}
