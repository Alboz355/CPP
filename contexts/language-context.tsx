"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, getTranslation, Translations } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('fr')
  const [t, setT] = useState<Translations>(getTranslation('fr'))

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('app-language') as Language
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage)
      setT(getTranslation(savedLanguage))
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    setT(getTranslation(newLanguage))
    localStorage.setItem('app-language', newLanguage)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
