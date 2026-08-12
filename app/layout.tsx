import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ThemeInitializer from "@/components/theme-initializer";
import { getLocale, dictionaryFor } from "@/lib/i18n/server";
import { HTML_LANG } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claude 代付充值",
  description: "Claude Pro / Max5x / Max20x 订阅代付与 API 余额充值",
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
        <ThemeInitializer />
        <I18nProvider locale={locale} dict={dict}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
