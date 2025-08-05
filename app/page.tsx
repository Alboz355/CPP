"use client"

import { useState, useEffect } from "react"
import { LanguageSelection } from "@/components/language-selection"
import { OnboardingPage } from "@/components/onboarding-page"
import { PinSetupPage } from "@/components/pin-setup-page"
import { MainDashboard } from "@/components/main-dashboard"
import { SendPage } from "@/components/send-page"
import { ReceivePage } from "@/components/receive-page"
import { TransactionHistory } from "@/components/transaction-history"
import { SettingsPage } from "@/components/settings-page"
import { TPEDashboard } from "@/components/tpe-dashboard"
import { ErrorBoundary } from "@/components/error-boundary"
import { SecureStorage } from "@/lib/secure-storage"
import { Language } from "@/lib/i18n"

export type AppState =
  | "language-selection"
  | "onboarding"
  | "pin-setup"
  | "dashboard"
  | "send"
  | "receive"
  | "history"
  | "settings"
  | "tpe"
  | "tpe-search"
  | "tpe-billing"
  | "tpe-payment"
  | "tpe-conversion"
  | "tpe-history"
  | "tpe-settings"
  | "tpe-vat"

export default function CryptoWalletApp() {
  const [currentPage, setCurrentPage] = useState<AppState>("language-selection")
  const [walletData, setWalletData] = useState<any>(null)
  const [pin, setPin] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)

  // Verify app state on startup using secure storage
  useEffect(() => {
    const loadSecureData = async () => {
      try {
        // Check for saved language preference first
        const savedLanguage = await SecureStorage.getItem("language")
        if (savedLanguage) {
          const language = JSON.parse(savedLanguage)
          setSelectedLanguage(language)
          
          // Only then check for wallet data
          const savedWallet = await SecureStorage.getItem("wallet")
          const savedPin = await SecureStorage.getItem("pin")

          if (savedWallet && savedPin) {
            setCurrentPage("dashboard")
            setWalletData(JSON.parse(savedWallet))
            setPin(savedPin)
          } else {
            setCurrentPage("onboarding")
          }
        } else {
          // No language preference saved, show language selection
          setCurrentPage("language-selection")
        }
      } catch (error) {
        console.error("Failed to load secure data:", error)
        // Fallback to check if data exists in old localStorage format
        const oldWallet = localStorage.getItem("wallet")
        const oldPin = localStorage.getItem("pin")
        
        if (oldWallet && oldPin) {
          // Migrate old data to secure storage
          await SecureStorage.setItem("wallet", oldWallet)
          await SecureStorage.setItem("pin", oldPin)
          
          // Remove from localStorage
          localStorage.removeItem("wallet")
          localStorage.removeItem("pin")
          
          // Check for saved language or default to French
          const savedLanguage = localStorage.getItem("language")
          if (savedLanguage) {
            const language = JSON.parse(savedLanguage)
            setSelectedLanguage(language)
            await SecureStorage.setItem("language", savedLanguage)
            localStorage.removeItem("language")
          } else {
            // Default to French
            const defaultLanguage: Language = {
              code: "fr",
              name: "French",
              flag: "🇫🇷",
              nativeName: "Français"
            }
            setSelectedLanguage(defaultLanguage)
            await SecureStorage.setItem("language", JSON.stringify(defaultLanguage))
          }
          
          setCurrentPage("dashboard")
          setWalletData(JSON.parse(oldWallet))
          setPin(oldPin)
        }
      }
    }
    
    loadSecureData()
  }, [])

  const handleLanguageSelected = async (language: Language) => {
    setSelectedLanguage(language)
    await SecureStorage.setItem("language", JSON.stringify(language))
    setCurrentPage("onboarding")
  }

  const handleWalletCreated = async (wallet: any) => {
    setWalletData(wallet)
    await SecureStorage.setItem("wallet", JSON.stringify(wallet))
    setCurrentPage("pin-setup")
  }

  const handlePinCreated = async (newPin: string) => {
    setPin(newPin)
    await SecureStorage.setItem("pin", newPin)
    setCurrentPage("dashboard")
  }

  const navigateTo = (page: AppState) => {
    setCurrentPage(page)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "language-selection":
        return <LanguageSelection onLanguageSelected={handleLanguageSelected} />
      case "onboarding":
        return selectedLanguage ? <OnboardingPage onWalletCreated={handleWalletCreated} selectedLanguage={selectedLanguage} /> : null
      case "pin-setup":
        return <PinSetupPage onPinCreated={handlePinCreated} />
      case "dashboard":
        return <MainDashboard walletData={walletData} onNavigate={navigateTo} />
      case "send":
        return <SendPage onNavigate={navigateTo} />
      case "receive":
        return <ReceivePage walletData={walletData} onNavigate={navigateTo} />
      case "history":
        return <TransactionHistory onNavigate={navigateTo} />
      case "settings":
        return <SettingsPage onNavigate={navigateTo} />
      case "tpe":
      case "tpe-search":
      case "tpe-billing":
      case "tpe-payment":
      case "tpe-conversion":
      case "tpe-history":
      case "tpe-settings":
      case "tpe-vat":
        return <TPEDashboard currentPage={currentPage} onNavigate={navigateTo} walletData={walletData} />
      default:
        return selectedLanguage ? <OnboardingPage onWalletCreated={handleWalletCreated} selectedLanguage={selectedLanguage} /> : <LanguageSelection onLanguageSelected={handleLanguageSelected} />
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">{renderCurrentPage()}</div>
    </ErrorBoundary>
  )
}
