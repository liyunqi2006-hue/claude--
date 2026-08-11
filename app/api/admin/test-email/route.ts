import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { isEmailConfigured } from "@/lib/email-config";
import { sendEmail } from "@/lib/email-service";

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({
      success: false,
      error: "邮件服务未配置",
      message: "请在 .env 文件中配置 SMTP 相关环境变量"
    }, { status: 400 });
  }

  const { to } = await request.json();
  const testEmail = to || admin.email || "test@example.com";

  try {
    const success = await sendEmail({
      to: testEmail,
      subject: "邮件服务测试 - Claude 代付",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; }
            .success { background: #10B981; color: white; padding: 20px; border-radius: 8px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">
              <h1>✓ 邮件服务测试成功</h1>
              <p>如果您收到此邮件，说明邮件服务配置正确。</p>
              <p style="font-size: 14px; margin-top: 20px;">发送时间: ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: "邮件服务测试成功 - Claude 代付",
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: `测试邮件已发送到 ${testEmail}`
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "邮件发送失败，请检查 SMTP 配置"
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "邮件发送异常",
      message: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const configured = isEmailConfigured();

  return NextResponse.json({
    configured,
    message: configured ? "邮件服务已配置" : "邮件服务未配置，请填写 .env 中的 SMTP 配置"
  });
}
