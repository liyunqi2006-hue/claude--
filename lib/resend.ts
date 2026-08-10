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
