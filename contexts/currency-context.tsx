"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Currency } from "@/lib/crypto-prices"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>("CHF")

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem("app-currency") as Currency
    if (savedCurrency && (savedCurrency === "CHF" || savedCurrency === "EUR" || savedCurrency === "USD")) {
      setCurrencyState(savedCurrency)
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("app-currency", newCurrency)
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
