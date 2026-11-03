import en from "./dictionaries/en";
import sk, { type Dictionary } from "./dictionaries/sk";
import { localeTags, type Locale } from "./config";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { sk, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Replace `{name}` placeholders. */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => (key in vars ? String(vars[key]) : m));
}

/** Slovak/English plural form of "item". */
export function pluralItems(locale: Locale, count: number, forms: Dictionary["common"]["items"]): string {
  const rule = new Intl.PluralRules(localeTags[locale].intl).select(count);
  if (rule === "one") return forms.one;
  if (rule === "few") return forms.few;
  return forms.many;
}
