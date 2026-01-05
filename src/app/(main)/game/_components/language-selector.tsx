import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Locale,
  SUPPORTED_LANGUAGES,
  getLanguageName,
} from "@/src/config/language";

interface LanguageSelectorProps {
  triggerClassName?: string;
  contentClassName?: string;
  selectedLanguage: Locale;
  onLanguageChange?: (locale: Locale) => void;
}

export default function LanguageSelector({
  triggerClassName,
  contentClassName,
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const handleLanguageChange = (value: string) => {
    const newLocale = value as Locale;
    onLanguageChange?.(newLocale);
  };

  return (
    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className={`w-full ${triggerClassName}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className={` ${contentClassName}`}>
        {SUPPORTED_LANGUAGES.map(lang => (
          <SelectItem key={lang} value={lang}>
            <div className="flex items-center gap-2">
              <span>{getLanguageName(lang)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
