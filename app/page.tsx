import { prisma } from "@/lib/prisma";
import Hero from "@/components/hero";
import SubscriptionPicker from "@/components/subscription-picker";
import HowItWorks from "@/components/how-it-works";
import ServiceNotes from "@/components/service-notes";
import FAQ from "@/components/faq";
import ApiPromoBanner from "@/components/api-promo-banner";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true, type: "subscription" },
    select: { id: true, plan: true, duration: true },
  });

  const subscriptionProducts = products.filter(
    (p): p is { id: string; plan: NonNullable<typeof p.plan>; duration: NonNullable<typeof p.duration> } =>
      p.plan !== null && p.duration !== null,
  );

  return (
    <main className="flex-1">
      <Hero />
      <SubscriptionPicker products={subscriptionProducts} />
      <HowItWorks />
      <ServiceNotes />
      <FAQ />
      <ApiPromoBanner />
    </main>
  );
}
