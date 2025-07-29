"use client"

import { useEffect } from "react"
import { OnboardingPage } from "@/components/onboarding-page"
import { PinSetupPage } from "@/components/pin-setup-page"
import { MainDashboard } from "@/components/main-dashboard"
import { SendPage } from "@/components/send-page"
import { ReceivePage } from "@/components/receive-page"
import { TransactionHistory } from "@/components/transaction-history"
import { SettingsPage } from "@/components/settings-page"
import { TPEDashboard } from "@/components/tpe-dashboard"
import { ErrorBoundary } from "@/components/error-boundary"
import { useWalletStore } from "@/lib/wallet-store"

export type AppState =
  | "onboarding"
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
  const {
    currentPage,
    walletData,
    setWalletData,
    setPin,
    setCurrentPage,
    initializeFromStorage,
  } = useWalletStore()

  // Initialize from storage on app start
  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  const handleWalletCreated = (wallet: any) => {
    setWalletData(wallet)
    setCurrentPage("pin-setup")
  }

  const handlePinCreated = (newPin: string) => {
    setPin(newPin)
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
