import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ApiHero from "@/components/api-hero";
import ApiCreditTiers from "@/components/api-credit-tiers";
import ApiHowItWorks from "@/components/api-how-it-works";
import ApiFeatures from "@/components/api-features";
import ApiFAQ from "@/components/api-faq";

export const metadata: Metadata = {
  title: "Claude API 充值 | 按量付费中转，兼容官方接口",
  description:
    "Claude API 额度充值：USDT 支付，$50 起充秒级到账，接口格式与 Anthropic 官方一致，覆盖 Opus / Sonnet / Haiku 全系列模型，无需海外信用卡，按实际用量扣费。",
  keywords: [
    "claude api 充值",
    "claude api key 购买",
    "claude api 国内",
    "claude 中转 api",
    "anthropic api 代充",
  ],
  alternates: { canonical: "/api-platform" },
  openGraph: {
    title: "Claude API 充值 | 按量付费中转，兼容官方接口",
    description:
      "USDT 支付，$50 起充秒级到账，接口与官方一致，覆盖全系列 Claude 模型，按实际用量扣费。",
    url: "/api-platform",
  },
};

export default async function ApiPlatformPage() {
  const products = await prisma.product.findMany({
    where: { active: true, type: "api_credit" },
    orderBy: { priceUSD: "asc" },
  });

  const tiers = products
    .filter((p) => p.creditAmount !== null)
    .map((p) => ({
      id: p.id,
      name: p.name,
      creditAmount: Number(p.creditAmount),
      priceUSD: Number(p.priceUSD),
    }));

  return (
    <main className="flex-1">
      <ApiHero />
      <ApiCreditTiers tiers={tiers} />
      <ApiHowItWorks />
      <ApiFeatures />
      <ApiFAQ />
    </main>
  );
}
