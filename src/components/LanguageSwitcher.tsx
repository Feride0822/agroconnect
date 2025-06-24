import { useTranslation } from "react-i18next";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { actualTheme } = useTheme();
  const [language, setLanguage] = useState(i18n.language || "en");

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <Select value={language} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          actualTheme === "dark"
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">🇬🇧 English</SelectItem>
        <SelectItem value="uz">🇺🇿 Uzbek</SelectItem>
        <SelectItem value="ru">🇷🇺 Russian</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
