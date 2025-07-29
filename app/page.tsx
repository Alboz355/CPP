"use client"

import { useState, useEffect } from "react"
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

export type AppState =
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
  const [currentPage, setCurrentPage] = useState<AppState>("onboarding")
  const [walletData, setWalletData] = useState<any>(null)
  const [pin, setPin] = useState<string>("")

  // Verify app state on startup using secure storage
  useEffect(() => {
    const loadSecureData = async () => {
      try {
        const savedWallet = await SecureStorage.getItem("wallet")
        const savedPin = await SecureStorage.getItem("pin")

        if (savedWallet && savedPin) {
          setCurrentPage("dashboard")
          setWalletData(JSON.parse(savedWallet))
          setPin(savedPin)
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
          
          setCurrentPage("dashboard")
          setWalletData(JSON.parse(oldWallet))
          setPin(oldPin)
        }
      }
    }
    
    loadSecureData()
  }, [])

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
      case "onboarding":
        return <OnboardingPage onWalletCreated={handleWalletCreated} />
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
        return <OnboardingPage onWalletCreated={handleWalletCreated} />
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">{renderCurrentPage()}</div>
    </ErrorBoundary>
  )
}
