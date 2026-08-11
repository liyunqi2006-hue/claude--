import { NextResponse } from "next/server";
import { z } from "zod";
import { createVerificationCode } from "@/lib/verification";
import { sendVerificationCode } from "@/lib/email-service";

const sendCodeSchema = z.object({
  email: z.string().email(),
  orderNo: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = sendCodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { email, orderNo } = parsed.data;

    // 验证订单是否存在且邮箱匹配
    const { prisma } = await import("@/lib/prisma");
    const order = await prisma.order.findFirst({
      where: {
        orderNo,
        contactEmail: email,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found or email mismatch" }, { status: 404 });
    }

    // 生成验证码
    const code = await createVerificationCode(email, "order_lookup");

    // 发送验证码邮件
    const success = await sendVerificationCode(email, code, "zh");

    if (!success) {
      return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send verification code error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
