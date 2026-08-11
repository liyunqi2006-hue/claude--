import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";
import { sendSubscriptionActivation, sendApiKey } from "@/lib/email-service";

const schema = z.object({
  activationLink: z.string().url().optional(),
  apiKey: z.string().min(1).optional(),
}).refine(data => data.activationLink || data.apiKey, {
  message: "必须提供激活链接或 API Key",
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { product: true }
  });
  if (!order) return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  if (order.status !== "paid" && order.status !== "fulfilling") {
    return NextResponse.json({ error: "当前订单不能履约" }, { status: 409 });
  }

  const { activationLink, apiKey } = parsed.data;

  // 更新订单状态
  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        status: "completed",
        activationLink,
        apiKey,
      }
    }),
    prisma.auditLog.create({
      data: {
        adminId: admin.adminId,
        action: "fulfill",
        targetType: "order",
        targetId: order.id
      }
    }),
  ]);

  // 发送对应的邮件
  if (activationLink) {
    // 订阅订单 - 发送激活链接
    await sendSubscriptionActivation(
      order.contactEmail,
      order.orderNo,
      activationLink,
      order.product.name,
      "zh"
    ).catch((err) => console.error("Failed to send activation email:", err));
  } else if (apiKey) {
    // API 订单 - 发送 API Key
    const creditAmount = order.product.creditAmount?.toString() || "0";
    await sendApiKey(
      order.contactEmail,
      order.orderNo,
      apiKey,
      creditAmount,
      "zh"
    ).catch((err) => console.error("Failed to send API key email:", err));
  }

  return NextResponse.json({ ok: true });
}
