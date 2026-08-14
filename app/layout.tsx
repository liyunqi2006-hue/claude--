import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ThemeInitializer from "@/components/theme-initializer";
import TranslationGuard from "@/components/translation-guard";
import { getLocale, dictionaryFor } from "@/lib/i18n/server";
import { HTML_LANG } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/context";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Claude 代付充值 | Claude Pro / Max 订阅与 API 额度国内充值",
    template: "%s | Claude 代付充值",
  },
  description:
    "Claude 代付充值平台：支持 USDT (TRC20) 支付，无需信用卡即可开通 Claude Pro / Max5x / Max20x 订阅，或充值 Claude API 额度。官方渠道代付，激活链接直发邮箱，最快 1 小时到账。",
  keywords: [
    "claude 代付",
    "claude pro 国内充值",
    "claude 订阅怎么付款",
    "claude max 代充",
    "claude api 充值",
    "claude 订阅代付",
    "claude 会员开通",
    "usdt 代付 claude",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Claude 代付充值",
    title: "Claude 代付充值 | Claude Pro / Max 订阅与 API 额度国内充值",
    description:
      "支持 USDT (TRC20) 支付，无需信用卡即可开通 Claude Pro / Max 订阅或充值 API 额度，官方渠道代付，激活链接直发邮箱。",
    url: "/",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const dict = dictionaryFor(locale);

  return (
    <html
      lang={HTML_LANG[locale]}
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <TranslationGuard />
        <ThemeInitializer />
        <SessionProvider>
          <I18nProvider locale={locale} dict={dict}>
            <SiteHeader />
            {children}
            <SiteFooter />
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
