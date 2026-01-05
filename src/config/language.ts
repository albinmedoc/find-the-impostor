import { languages, TLanguageCode, ILanguage } from "countries-list";

export type Locale = TLanguageCode;

export const SUPPORTED_LANGUAGES: Locale[] = Object.keys(languages) as Locale[];

export const getLanguageByLocale = (locale: Locale): ILanguage | undefined => {
  const language = languages[locale];
  return language;
};

export const getLanguageName = (locale: Locale): string => {
  return getLanguageByLocale(locale)?.name || locale;
};

export const getLanguageNativeName = (locale: Locale): string => {
  return getLanguageByLocale(locale)?.native || locale;
};

export const isValidLocale = (locale: string): locale is Locale => {
  return locale in languages;
};
