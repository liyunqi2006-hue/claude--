import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeScript } from "@/components/theme-script";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claude 代付充值",
  description: "Claude Pro / Max5x / Max20x 订阅代付与 API 余额充值",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
