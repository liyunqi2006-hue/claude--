export const LOCALES = ["zh", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh";

export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "zh" || value === "en";
}

// <html lang="..."> 值
export const HTML_LANG: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en",
};
