// USDT (TRC20) 支付配置
export const PAYMENT_CONFIG = {
  // USDT (TRC20) 收款地址 - 请填写您的钱包地址
  USDT_TRC20_ADDRESS: process.env.USDT_TRC20_ADDRESS || "T_YOUR_WALLET_ADDRESS_HERE",

  // USD 到 USDT 汇率（建议 1.02 覆盖手续费）
  USD_TO_USDT_RATE: parseFloat(process.env.USD_TO_USDT_RATE || "1.02"),

  // 支付超时时间（分钟）—— 24 小时
  PAYMENT_TIMEOUT_MINUTES: 24 * 60,
};

// 计算 USDT 金额
export function calculateUsdtAmount(usdAmount: number): string {
  return (usdAmount * PAYMENT_CONFIG.USD_TO_USDT_RATE).toFixed(2);
}

// 生成收款地址二维码数据
export function generatePaymentQrData(address: string, amount: string): string {
  // TRC20 USDT 转账 URI
  return `tron:${address}?amount=${amount}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
}
