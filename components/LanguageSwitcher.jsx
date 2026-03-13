'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { speak } from '@/lib/tts';

export default function LanguageSwitcher() {
  const { lang, setLang, currentLanguage, languages, t } = useLanguage();

  const handleLanguageChange = (code) => {
    setLang(code);
    // Find translation key and speak in new language
    const ttsKey = 'ttsLanguageChanged';
    const msg = t(ttsKey);
    speak(msg, code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-1.5 px-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center space-x-2 cursor-pointer ${
              lang === language.code ? 'bg-blue-50 text-[#2D4FE0] font-semibold' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <div>
              <span className="text-sm">{language.name}</span>
            </div>
            {lang === language.code && (
              <span className="ml-auto text-[#2D4FE0] text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
