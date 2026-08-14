import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendPaymentSuccess, sendAdminPaymentNotification } from "@/lib/email-service";
import { PAYMENT_CONFIG } from "@/lib/payment-config";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const session = await auth();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 验证权限
    if (session?.user?.email && order.contactEmail !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 订单已过期（待支付但超过有效期）：标记取消，拒绝确认
    if (order.status === "pending" && order.expiresAt < new Date()) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "cancelled" },
      });
      return NextResponse.json(
        { error: "订单已超过支付有效期，已自动取消，请重新下单" },
        { status: 400 }
      );
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

    // 通知管理员：用户声称已付款，需人工核对链上到账
    sendAdminPaymentNotification(
      order.orderNo,
      order.product.name,
      order.totalUSD.toFixed(2),
      order.contactEmail,
      PAYMENT_CONFIG.USDT_TRC20_ADDRESS
    ).catch((err) => console.error("Failed to send admin payment notification:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
