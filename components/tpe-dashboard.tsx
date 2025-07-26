"use client"

import { TPESearchPage } from "./tpe-search-page"
import { TPEBillingPage } from "./tpe-billing-page"
import { TPEConversionPage } from "./tpe-conversion-page"
import { TPEHistoryPage } from "./tpe-history-page"
import { TPESettingsPage } from "./tpe-settings-page"
import { TPEMainPage } from "./tpe-main-page"
import type { AppState } from "@/app/page"
import { TPEPaymentPage } from "./tpe-payment-page"
import { TPEVATManagement } from "./tpe-vat-management"

interface TPEDashboardProps {
  currentPage: AppState
  onNavigate: (page: AppState) => void
  walletData: any
}

export function TPEDashboard({ currentPage, onNavigate, walletData }: TPEDashboardProps) {
  const renderTPEPage = () => {
    switch (currentPage) {
      case "tpe":
        return <TPEMainPage onNavigate={onNavigate} walletData={walletData} />
      case "tpe-search":
        return <TPESearchPage onNavigate={onNavigate} />
      case "tpe-billing":
        return <TPEBillingPage onNavigate={onNavigate} walletData={walletData} />
      case "tpe-payment":
        const paymentRequest = JSON.parse(localStorage.getItem("current-payment-request") || "{}")
        return <TPEPaymentPage onNavigate={onNavigate} paymentRequest={paymentRequest} walletData={walletData} />
      case "tpe-conversion":
        return <TPEConversionPage onNavigate={onNavigate} walletData={walletData} />
      case "tpe-history":
        return <TPEHistoryPage onNavigate={onNavigate} />
      case "tpe-settings":
        return <TPESettingsPage onNavigate={onNavigate} />
      case "tpe-vat":
        return <TPEVATManagement onNavigate={onNavigate} />
      default:
        return <TPEMainPage onNavigate={onNavigate} walletData={walletData} />
    }
  }

  return <div className="min-h-screen">{renderTPEPage()}</div>
}
