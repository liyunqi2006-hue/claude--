import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendPaymentSuccess } from "@/lib/email-service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const session = await auth();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 验证权限
    if (session?.user?.email && order.contactEmail !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 更新订单状态为"已支付待处理"
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "paid",
        paidAt: new Date(),
      },
    });

    // 发送支付成功邮件
    sendPaymentSuccess(
      order.contactEmail,
      order.orderNo,
      "zh" // TODO: 根据用户语言设置
    ).catch((err) => console.error("Failed to send payment success email:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
