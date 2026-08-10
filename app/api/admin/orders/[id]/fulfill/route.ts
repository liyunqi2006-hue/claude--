import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import { getAdminSession } from "@/lib/admin-session";
import { sendOrderFulfilledNotice } from "@/lib/resend";

const schema = z.object({
  deliveredContent: z.string().min(1).max(10000),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "发货内容不能为空" }, { status: 400 });

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  if (order.status !== "paid" && order.status !== "fulfilling") {
    return NextResponse.json({ error: "当前订单不能履约" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.fulfillment.upsert({
      where: { orderId: order.id },
      update: { deliveredContent: encrypt(parsed.data.deliveredContent), operatorId: admin.adminId, deliveredAt: new Date() },
      create: { orderId: order.id, deliveredContent: encrypt(parsed.data.deliveredContent), operatorId: admin.adminId },
    }),
    prisma.order.update({ where: { id: order.id }, data: { status: "completed" } }),
    prisma.auditLog.create({ data: { adminId: admin.adminId, action: "fulfill", targetType: "order", targetId: order.id } }),
  ]);

  await sendOrderFulfilledNotice(order.contactEmail, order.orderNo).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
