import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.RESEND_FROM_EMAIL ?? "orders@example.com";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL;

export async function sendOrderPaidNotice(orderNo: string, productName: string) {
  if (!ADMIN_EMAIL || !resend) return;
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `新订单待履约 #${orderNo}`,
    text: `订单 ${orderNo}（${productName}）已支付，请登录后台处理履约。`,
  });
}

export async function sendOrderFulfilledNotice(toEmail: string, orderNo: string) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `您的订单 #${orderNo} 已完成`,
    text: `您的订单 ${orderNo} 已处理完成，请登录用户中心查看详情。`,
  });
}

export async function sendVerificationCode(toEmail: string, code: string) {
  if (!resend) {
    console.info(`[verification] ${toEmail} -> ${code}`);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: "订单查询验证码",
    text: `您的验证码是 ${code}，10 分钟内有效。如非本人操作请忽略此邮件。`,
  });
}

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? ADMIN_EMAIL;

export async function sendContactMessage(params: {
  fromEmail: string;
  orderNo?: string;
  message: string;
}) {
  const to = SUPPORT_EMAIL;
  const text = `联系我们留言\n来信邮箱：${params.fromEmail}\n订单号：${params.orderNo || "（未填写）"}\n时间：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}\n\n${params.message}`;

  if (!to || !resend) {
    console.info(`[contact] from ${params.fromEmail}: ${params.message}`);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to,
    replyTo: params.fromEmail,
    subject: `联系我们留言 - ${params.fromEmail}`,
    text,
  });
}
