import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { EMAIL_CONFIG, isEmailConfigured } from "./email-config";

let transporter: Transporter | null = null;

// 创建邮件传输器
function getTransporter(): Transporter {
  if (!transporter) {
    if (!isEmailConfigured()) {
      console.warn("Email service not configured. Emails will not be sent.");
      // 返回一个空传输器用于测试
      return nodemailer.createTransport({
        streamTransport: true,
        newline: "unix",
        buffer: true,
      });
    }

    transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.SMTP_HOST,
      port: EMAIL_CONFIG.SMTP_PORT,
      secure: EMAIL_CONFIG.SMTP_SECURE,
      auth: {
        user: EMAIL_CONFIG.SMTP_USER,
        pass: EMAIL_CONFIG.SMTP_PASS,
      },
    });
  }
  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

// 发送邮件
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!isEmailConfigured()) {
      console.log("Email not configured. Would send email:", {
        to: options.to,
        subject: options.subject,
      });
      return false;
    }

    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"${EMAIL_CONFIG.FROM_NAME}" <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

// 发送验证码邮件
export async function sendVerificationCode(email: string, code: string, locale: "zh" | "en" = "zh") {
  const subject = locale === "zh" ? "您的验证码" : "Your Verification Code";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; }
        .content { padding: 30px 20px; }
        .code-box { background: #F3F4F6; border: 2px dashed #4F46E5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5; }
        .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 12px; border-top: 1px solid #E5E7EB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #4F46E5;">Claude 代付</h1>
        </div>
        <div class="content">
          <h2>${locale === "zh" ? "验证码" : "Verification Code"}</h2>
          <p>${locale === "zh" ? "您的验证码是：" : "Your verification code is:"}</p>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <p style="color: #6B7280;">
            ${locale === "zh"
              ? "该验证码 10 分钟内有效，请勿泄露给他人。"
              : "This code is valid for 10 minutes. Do not share it with others."}
          </p>
          <p style="color: #6B7280;">
            ${locale === "zh"
              ? "如果这不是您的操作，请忽略此邮件。"
              : "If you didn't request this, please ignore this email."}
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Claude 代付. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    text: `${subject}\n\n${locale === "zh" ? "您的验证码是" : "Your verification code is"}: ${code}\n\n${locale === "zh" ? "该验证码 10 分钟内有效。" : "This code is valid for 10 minutes."}`,
  });
}

// 发送订单确认邮件
export async function sendOrderConfirmation(
  email: string,
  orderNo: string,
  productName: string,
  amount: string,
  locale: "zh" | "en" = "zh"
) {
  const subject = locale === "zh" ? `订单确认 - ${orderNo}` : `Order Confirmation - ${orderNo}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; }
        .content { padding: 30px 20px; }
        .order-info { background: #F9FAFB; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .order-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E5E7EB; }
        .order-row:last-child { border-bottom: none; }
        .label { color: #6B7280; }
        .value { font-weight: 600; }
        .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 12px; border-top: 1px solid #E5E7EB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #4F46E5;">Claude 代付</h1>
        </div>
        <div class="content">
          <h2>${locale === "zh" ? "订单确认" : "Order Confirmation"}</h2>
          <p>${locale === "zh" ? "感谢您的订单！我们已收到您的订单，请尽快完成支付。" : "Thank you for your order! We've received it. Please complete the payment."}</p>

          <div class="order-info">
            <div class="order-row">
              <span class="label">${locale === "zh" ? "订单号" : "Order No."}</span>
              <span class="value">${orderNo}</span>
            </div>
            <div class="order-row">
              <span class="label">${locale === "zh" ? "商品" : "Product"}</span>
              <span class="value">${productName}</span>
            </div>
            <div class="order-row">
              <span class="label">${locale === "zh" ? "金额" : "Amount"}</span>
              <span class="value">$${amount}</span>
            </div>
          </div>

          <p style="color: #6B7280;">
            ${locale === "zh"
              ? "支付完成后，我们会尽快处理您的订单并发送激活链接到此邮箱。"
              : "After payment, we'll process your order and send the activation link to this email."}
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Claude 代付. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

// 发送支付成功邮件
export async function sendPaymentSuccess(
  email: string,
  orderNo: string,
  locale: "zh" | "en" = "zh"
) {
  const subject = locale === "zh" ? `支付成功 - ${orderNo}` : `Payment Successful - ${orderNo}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10B981; }
        .content { padding: 30px 20px; }
        .success-icon { text-align: center; font-size: 48px; color: #10B981; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 12px; border-top: 1px solid #E5E7EB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #10B981;">✓ ${locale === "zh" ? "支付成功" : "Payment Successful"}</h1>
        </div>
        <div class="content">
          <div class="success-icon">✓</div>
          <h2 style="text-align: center;">${locale === "zh" ? "支付确认中" : "Payment Confirmed"}</h2>
          <p style="text-align: center;">
            ${locale === "zh"
              ? "我们已收到您的付款，正在处理订单。"
              : "We've received your payment and are processing your order."}
          </p>
          <p style="text-align: center; color: #6B7280;">
            ${locale === "zh" ? "订单号" : "Order No."}: <strong>${orderNo}</strong>
          </p>
          <p style="color: #6B7280;">
            ${locale === "zh"
              ? "处理完成后，我们会将激活链接或 API Key 发送到此邮箱，通常需要 5-30 分钟。"
              : "We'll send the activation link or API Key to this email once processed, usually within 5-30 minutes."}
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Claude 代付. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

// 发送订阅激活链接邮件
export async function sendSubscriptionActivation(
  email: string,
  orderNo: string,
  activationLink: string,
  productName: string,
  locale: "zh" | "en" = "zh"
) {
  const subject = locale === "zh" ? `订单完成 - Claude 订阅激活链接` : `Order Complete - Claude Subscription Activation`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; }
        .content { padding: 30px 20px; }
        .activation-box { background: #EEF2FF; border: 2px solid #4F46E5; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; }
        .steps { background: #F9FAFB; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .step { margin: 15px 0; }
        .step-number { display: inline-block; width: 24px; height: 24px; background: #4F46E5; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; }
        .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 12px; border-top: 1px solid #E5E7EB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #4F46E5;">🎉 ${locale === "zh" ? "订单已完成" : "Order Complete"}</h1>
        </div>
        <div class="content">
          <h2>${locale === "zh" ? "您的 Claude 订阅激活链接" : "Your Claude Subscription Activation Link"}</h2>
          <p>
            ${locale === "zh"
              ? `您购买的 <strong>${productName}</strong> 已完成处理，请使用以下链接激活订阅。`
              : `Your <strong>${productName}</strong> order has been processed. Please use the link below to activate your subscription.`}
          </p>

          <div class="activation-box" style="text-align: center;">
            <p style="margin: 0 0 15px 0; color: #4F46E5; font-weight: 600;">
              ${locale === "zh" ? "点击下方按钮激活" : "Click the button below to activate"}
            </p>
            <a href="${activationLink}" class="button" target="_blank">
              ${locale === "zh" ? "激活 Claude 订阅" : "Activate Claude Subscription"}
            </a>
          </div>

          <div class="steps">
            <h3 style="margin-top: 0;">${locale === "zh" ? "激活步骤" : "Activation Steps"}:</h3>
            <div class="step">
              <span class="step-number">1</span>
              ${locale === "zh" ? "点击上方激活按钮" : "Click the activation button above"}
            </div>
            <div class="step">
              <span class="step-number">2</span>
              ${locale === "zh" ? "登录您的 Claude 账号" : "Log in to your Claude account"}
            </div>
            <div class="step">
              <span class="step-number">3</span>
              ${locale === "zh" ? "确认激活订阅" : "Confirm subscription activation"}
            </div>
            <div class="step">
              <span class="step-number">4</span>
              ${locale === "zh" ? "开始使用 Claude！" : "Start using Claude!"}
            </div>
          </div>

          <p style="color: #EF4444; font-weight: 600;">
            ${locale === "zh" ? "⚠️ 重要提示" : "⚠️ Important Notice"}:
          </p>
          <ul style="color: #6B7280;">
            <li>${locale === "zh" ? "激活链接仅可使用一次，请妥善保管" : "The activation link can only be used once, please keep it safe"}</li>
            <li>${locale === "zh" ? "链接有效期通常为 7 天" : "The link is usually valid for 7 days"}</li>
            <li>${locale === "zh" ? "请使用正确的 Claude 账号登录激活" : "Please log in with the correct Claude account to activate"}</li>
          </ul>

          <p style="color: #6B7280; font-size: 14px;">
            ${locale === "zh" ? "订单号" : "Order No."}: <code>${orderNo}</code>
          </p>
        </div>
        <div class="footer">
          <p>${locale === "zh" ? "如有任何问题，请联系客服" : "If you have any questions, please contact support"}</p>
          <p>© ${new Date().getFullYear()} Claude 代付. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

// 发送 API Key 邮件
export async function sendApiKey(
  email: string,
  orderNo: string,
  apiKey: string,
  creditAmount: string,
  locale: "zh" | "en" = "zh"
) {
  const subject = locale === "zh" ? `订单完成 - Claude API Key` : `Order Complete - Claude API Key`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; }
        .content { padding: 30px 20px; }
        .apikey-box { background: #1F2937; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .apikey { font-family: 'Courier New', monospace; color: #10B981; word-break: break-all; font-size: 14px; }
        .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 12px; border-top: 1px solid #E5E7EB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #4F46E5;">🎉 ${locale === "zh" ? "订单已完成" : "Order Complete"}</h1>
        </div>
        <div class="content">
          <h2>${locale === "zh" ? "您的 Claude API Key" : "Your Claude API Key"}</h2>
          <p>
            ${locale === "zh"
              ? `您购买的 <strong>$${creditAmount}</strong> API 额度已充值完成。`
              : `Your <strong>$${creditAmount}</strong> API credit has been topped up.`}
          </p>

          <div class="apikey-box">
            <div class="apikey">${apiKey}</div>
          </div>

          <div class="warning">
            <p style="margin: 0; font-weight: 600; color: #92400E;">
              ${locale === "zh" ? "🔒 安全提醒" : "🔒 Security Notice"}
            </p>
            <ul style="margin: 10px 0 0 0; color: #92400E;">
              <li>${locale === "zh" ? "请妥善保管您的 API Key，不要泄露给他人" : "Keep your API Key safe and do not share it with others"}</li>
              <li>${locale === "zh" ? "如需查询用量，请访问 Anthropic 控制台" : "To check usage, please visit the Anthropic console"}</li>
              <li>${locale === "zh" ? "如果 API Key 泄露，请立即重新生成" : "If your API Key is compromised, regenerate it immediately"}</li>
            </ul>
          </div>

          <h3>${locale === "zh" ? "使用方法" : "Usage"}:</h3>
          <pre style="background: #F3F4F6; padding: 15px; border-radius: 6px; overflow-x: auto;"><code>import anthropic

client = anthropic.Anthropic(
    api_key="${apiKey}"
)

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content)</code></pre>

          <p style="color: #6B7280; font-size: 14px;">
            ${locale === "zh" ? "订单号" : "Order No."}: <code>${orderNo}</code>
          </p>
        </div>
        <div class="footer">
          <p>${locale === "zh" ? "如有任何问题，请联系客服" : "If you have any questions, please contact support"}</p>
          <p>© ${new Date().getFullYear()} Claude 代付. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

// 发送联系我们留言（转发到客服邮箱）
export async function sendContactMessage(params: {
  fromEmail: string;
  orderNo?: string;
  message: string;
}): Promise<boolean> {
  const to = EMAIL_CONFIG.SUPPORT_EMAIL || EMAIL_CONFIG.ADMIN_EMAIL || EMAIL_CONFIG.SMTP_USER;
  if (!to) {
    console.warn("未配置客服收件邮箱，联系我们留言未发送。");
    return false;
  }

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const subject = `联系我们留言 - ${params.fromEmail}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { padding: 16px 0; border-bottom: 2px solid #2a5298; }
        .info { background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 16px 0; }
        .row { padding: 8px 0; border-bottom: 1px solid #E5E7EB; }
        .row:last-child { border-bottom: none; }
        .label { color: #6B7280; font-size: 13px; }
        .message { white-space: pre-wrap; background: #F3F4F6; border-radius: 8px; padding: 16px; margin-top: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0; color: #2a5298;">📨 新的联系我们留言</h2>
        </div>
        <div class="info">
          <div class="row"><span class="label">来信邮箱：</span> ${esc(params.fromEmail)}</div>
          <div class="row"><span class="label">订单号：</span> ${params.orderNo ? esc(params.orderNo) : "（未填写）"}</div>
          <div class="row"><span class="label">时间：</span> ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</div>
        </div>
        <div>
          <div class="label">留言内容：</div>
          <div class="message">${esc(params.message)}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text: `联系我们留言\n来信邮箱：${params.fromEmail}\n订单号：${params.orderNo || "（未填写）"}\n\n${params.message}`,
    // 便于客服直接回复用户
    replyTo: params.fromEmail,
  });
}

// 发送管理员通知（新订单）
export async function sendAdminNotification(
  orderNo: string,
  productName: string,
  amount: string,
  contactEmail: string
) {
  if (!EMAIL_CONFIG.ADMIN_EMAIL) {
    return false;
  }

  const subject = `新订单 - ${orderNo}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: monospace; line-height: 1.6; }
        .order-info { background: #f5f5f5; padding: 15px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h2>🔔 新订单通知</h2>
      <div class="order-info">
        <p><strong>订单号:</strong> ${orderNo}</p>
        <p><strong>商品:</strong> ${productName}</p>
        <p><strong>金额:</strong> $${amount}</p>
        <p><strong>客户邮箱:</strong> ${contactEmail}</p>
        <p><strong>时间:</strong> ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</p>
      </div>
      <p>请登录后台查看详情并处理订单。</p>
    </body>
    </html>
  `;

  return sendEmail({
    to: EMAIL_CONFIG.ADMIN_EMAIL,
    subject,
    html,
  });
}
