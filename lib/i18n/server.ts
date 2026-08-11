import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config";
import { zh } from "./dictionaries/zh";
import { en } from "./dictionaries/en";
import type { Dictionary } from "./dictionaries/zh";

const DICTIONARIES: Record<Locale, Dictionary> = { zh, en };

/** Read the active locale from the cookie (server components only). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Resolve the dictionary for the active locale (server components only). */
export async function getDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getLocale()];
}

export function dictionaryFor(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
