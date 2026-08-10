import { prisma } from "@/lib/prisma";
import ApiHero from "@/components/api-hero";
import ApiCreditTiers from "@/components/api-credit-tiers";
import ApiHowItWorks from "@/components/api-how-it-works";
import ApiFeatures from "@/components/api-features";
import ApiFAQ from "@/components/api-faq";

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
