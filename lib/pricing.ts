import type { SubscriptionDuration, SubscriptionPlan } from "@prisma/client";

export interface PriceBreakdown {
  total: number;
  official: number;
  service: number;
}

export const PLANS: readonly SubscriptionPlan[] = ["pro", "max5x", "max20x"];
export const DURATIONS: readonly SubscriptionDuration[] = ["month", "quarter", "half_year", "year"];

export const planDescriptions: Record<SubscriptionPlan, string> = {
  pro: "适合日常用户",
  max5x: "适合重度用户",
  max20x: "适合专业用户",
};

// 总价 = 官方订阅费 + 服务费。数值需与 Product.priceUSD 保持一致。
export const PRICE_TABLE: Record<SubscriptionPlan, Record<SubscriptionDuration, PriceBreakdown>> = {
  pro: {
    month: { total: 25, official: 20, service: 5 },
    quarter: { total: 75, official: 60, service: 15 },
    half_year: { total: 149, official: 120, service: 29 },
    year: { total: 298, official: 240, service: 58 },
  },
  max5x: {
    month: { total: 123, official: 100, service: 23 },
    quarter: { total: 369, official: 300, service: 69 },
    half_year: { total: 719, official: 600, service: 119 },
    year: { total: 1428, official: 1200, service: 228 },
  },
  max20x: {
    month: { total: 240, official: 200, service: 40 },
    quarter: { total: 719, official: 600, service: 119 },
    half_year: { total: 1428, official: 1200, service: 228 },
    year: { total: 2849, official: 2400, service: 449 },
  },
};
