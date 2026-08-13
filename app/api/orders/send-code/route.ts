import { NextResponse } from "next/server";
import { z } from "zod";
import { createVerificationCode } from "@/lib/verification";
import { sendVerificationCode } from "@/lib/email-service";

const sendCodeSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = sendCodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { email } = parsed.data;

    // 校验该邮箱是否有订单（无订单也返回成功，避免暴露邮箱是否下过单）
    const { prisma } = await import("@/lib/prisma");
    const order = await prisma.order.findFirst({
      where: { contactEmail: email },
    });

    if (!order) {
      // 不泄露"该邮箱没有订单"，直接返回成功，但不实际发码
      return NextResponse.json({ success: true });
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
