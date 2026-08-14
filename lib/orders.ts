import { prisma } from "@/lib/prisma";

/**
 * 把所有已过期（expiresAt 已过）且仍处于 pending 状态的订单批量标记为 cancelled。
 *
 * 项目没有独立的定时任务，改为在读取订单的关键入口（管理后台、订单查询、支付页）
 * 顺带调用本函数，实现「过期自动取消」。批量更新，幂等，可安全重复调用。
 *
 * @returns 本次被取消的订单数量
 */
export async function cancelExpiredOrders(): Promise<number> {
  try {
    const result = await prisma.order.updateMany({
      where: {
        status: "pending",
        expiresAt: { lt: new Date() },
      },
      data: { status: "cancelled" },
    });
    return result.count;
  } catch (err) {
    console.error("Failed to cancel expired orders:", err);
    return 0;
  }
}
