import { prisma } from "@/lib/prisma";
import Hero from "@/components/hero";
import SubscriptionPicker from "@/components/subscription-picker";
import HowItWorks from "@/components/how-it-works";
import ServiceNotes from "@/components/service-notes";
import FAQ from "@/components/faq";
import { SubscriptionProvider } from "@/components/subscription-context";
import { getDictionary } from "@/lib/i18n/server";

export default async function HomePage() {
  const dict = await getDictionary();

  // FAQPage 结构化数据：帮助搜索引擎在结果页展示问答富媒体摘要
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SubscriptionProvider>
        <Hero />
        <SubscriptionPicker products={subscriptionProducts} />
      </SubscriptionProvider>
      <HowItWorks />
      <ServiceNotes />
      <FAQ />
    </main>
  );
}
