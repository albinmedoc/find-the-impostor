import { Locale } from "@/src/config/language";
import { getUserLocale } from "@/src/lib/locale";
import fs from "fs";
import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import path from "path";

// Dynamically get available locales from the locales folder
const localesDir = path.join(process.cwd(), "i18n", "locales");
const supportedLocales = fs
  .readdirSync(localesDir)
  .filter(file => file.endsWith(".json"))
  .map(file => file.replace(".json", "")) as Locale[];

async function getPreferredLocale(): Promise<Locale> {
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language");

    if (acceptLanguage) {
      // Parse Accept-Language header (z.B. "en-US,en;q=0.9,de;q=0.8")
      const languages = acceptLanguage
        .split(",")
        .map(lang => {
          const [code, quality] = lang.split(";q=");
          return {
            code: code.trim().split("-")[0], // "en-US" -> "en"
            quality: quality ? parseFloat(quality) : 1.0,
          };
        })
        .sort((a, b) => b.quality - a.quality);

      for (const lang of languages) {
        if (supportedLocales.includes(lang.code as Locale)) {
          return lang.code as Locale;
        }
      }
    }
  } catch (error) {
    console.log("Could not detect browser language:", error);
  }

  return "en";
}

export default getRequestConfig(async () => {
  const locale = (await getUserLocale()) || (await getPreferredLocale());

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
