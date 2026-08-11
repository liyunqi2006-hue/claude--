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

// 插值：把字符串里的 {key} 占位符替换成对应值。
// 字典条目必须是纯字符串（不能是函数），否则无法从服务端组件序列化到客户端组件。
export function format(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}
