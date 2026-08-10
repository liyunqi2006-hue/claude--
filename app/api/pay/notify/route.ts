import { prisma } from "@/lib/prisma";
import { isNotifyValid, type EpayNotifyPayload } from "@/lib/epay";
import { sendOrderPaidNotice } from "@/lib/resend";

// 易支付异步回调：GET 或 POST 均可能发生，参数以 query string 形式携带
export async function GET(request: Request) {
  return handleNotify(request);
}

export async function POST(request: Request) {
  return handleNotify(request);
}

async function handleNotify(request: Request) {
  const url = new URL(request.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const payload = params as unknown as EpayNotifyPayload;

  if (!isNotifyValid(payload)) {
    return new Response("fail", { status: 403 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNo: payload.out_trade_no },
    include: { product: true },
  });

  if (!order) {
    return new Response("fail", { status: 404 });
  }

  // 幂等：已处理过的订单直接返回成功，避免重复触发通知
  if (order.status !== "pending") {
    return new Response("success");
  }

  // 校验金额与订单一致，防止篡改
  const expectedAmount = Number(order.amountCNY).toFixed(2);
  if (payload.money !== expectedAmount) {
    return new Response("fail", { status: 400 });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "paid",
      payChannel: mapEpayType(payload.type),
      tradeNo: payload.trade_no,
      paidAt: new Date(),
    },
  });

  await sendOrderPaidNotice(order.orderNo, order.product.name).catch(() => {
    // 通知邮件失败不影响回调成功响应，后台仍可在订单列表中看到待处理订单
  });

  return new Response("success");
}

function mapEpayType(type: string): "alipay" | "wxpay" | "bank" | "applepay" | "link" {
  const allowed = ["alipay", "wxpay", "bank", "applepay", "link"] as const;
  return (allowed as readonly string[]).includes(type)
    ? (type as (typeof allowed)[number])
    : "alipay";
}
