"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Check } from "lucide-react"
import { Language, getSupportedLanguages, getTranslations } from "@/lib/i18n"

interface LanguageSelectionProps {
  onLanguageSelected: (language: Language) => void
}

export function LanguageSelection({ onLanguageSelected }: LanguageSelectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  
  // Default to French for initial display
  const t = getTranslations(selectedLanguage?.code || 'fr')
  const availableLanguages = getSupportedLanguages()

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
  }

  const handleContinue = () => {
    if (selectedLanguage) {
      onLanguageSelected(selectedLanguage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/20">
      <div className="w-full max-w-lg modern-card p-8 scale-in">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="heading-1 mb-2">{t.chooseLanguage}</h1>
          <p className="body-text">{t.selectAppLanguage}</p>
        </div>

        <div className="space-y-3 mb-8">
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className={`
                w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${selectedLanguage?.code === language.code
                  ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
                  : 'border-border/30 bg-accent/20 hover:border-blue-300 hover:bg-accent/40'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <div className="font-semibold text-foreground">{language.nativeName}</div>
                    <div className="text-sm text-muted-foreground">{language.name}</div>
                  </div>
                </div>
                {selectedLanguage?.code === language.code && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedLanguage}
          className="ios-button-primary w-full disabled:opacity-50"
        >
          {selectedLanguage 
            ? `${getTranslations(selectedLanguage.code).continueIn} ${selectedLanguage.nativeName}` 
            : t.selectLanguage
          }
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {t.languageWillBeUsed}
          </p>
        </div>
      </div>
    </div>
  )
}