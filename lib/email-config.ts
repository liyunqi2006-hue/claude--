// 邮件服务配置
export const EMAIL_CONFIG = {
  // SMTP 配置
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "465"),
  SMTP_SECURE: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",

  // 发件人信息
  FROM_EMAIL: process.env.SMTP_FROM || "noreply@example.com",
  FROM_NAME: process.env.SMTP_FROM_NAME || "Claude 代付",

  // 管理员通知邮箱
  ADMIN_EMAIL: process.env.ADMIN_NOTIFY_EMAIL || "",
};

// 验证邮件配置是否完整
export function isEmailConfigured(): boolean {
  return !!(
    EMAIL_CONFIG.SMTP_HOST &&
    EMAIL_CONFIG.SMTP_USER &&
    EMAIL_CONFIG.SMTP_PASS &&
    EMAIL_CONFIG.FROM_EMAIL
  );
}
