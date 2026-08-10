// 美元计价，支付时按汇率折算为人民币下单
const DEFAULT_USD_TO_CNY_RATE = 7.3;

export function getUsdToCnyRate(): number {
  const raw = process.env.USD_TO_CNY_RATE;
  const rate = raw ? Number(raw) : DEFAULT_USD_TO_CNY_RATE;
  return Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_USD_TO_CNY_RATE;
}

export function usdToCny(amountUSD: number): number {
  const rate = getUsdToCnyRate();
  return Math.round(amountUSD * rate * 100) / 100;
}
