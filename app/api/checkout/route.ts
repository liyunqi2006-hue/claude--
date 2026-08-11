import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const checkoutSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).default(1),
  contactEmail: z.string().email(),
  contactNote: z.string().max(2000).optional(),
  payChannel: z.enum(["usdt"]),
});

function generateOrderNo(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `ORD${ts}${rand}`.toUpperCase();
}

const RECENT_ORDERS_COOKIE = "recent_order_nos";
const RECENT_ORDERS_MAX = 10;
const RECENT_ORDERS_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  const session = await auth();

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
  const orderNo = generateOrderNo();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // USDT 支付 1 小时超时

  const order = await prisma.order.create({
    data: {
      orderNo,
      userId: session?.user?.id,
      productId: product.id,
      quantity,
      totalUSD: amountUSD,
      contactEmail,
      noteFromUser: contactNote,
      expiresAt,
      payChannel,
    },
  });

  // USDT 支付跳转到内部支付页面
  const paymentUrl = `/payment/${order.id}`;

  const response = NextResponse.json({ orderNo: order.orderNo, paymentUrl });

  const existing = request.headers.get("cookie")?.match(new RegExp(`${RECENT_ORDERS_COOKIE}=([^;]*)`))?.[1];
  const previousOrderNos = existing ? decodeURIComponent(existing).split(",").filter(Boolean) : [];
  const nextOrderNos = [order.orderNo, ...previousOrderNos.filter((no) => no !== order.orderNo)].slice(
    0,
    RECENT_ORDERS_MAX,
  );
  response.cookies.set(RECENT_ORDERS_COOKIE, nextOrderNos.join(","), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: RECENT_ORDERS_MAX_AGE,
  });

  return response;
}
