"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Search, Receipt, History, Settings, Calculator, Users, FileText, BarChart3, Printer, Wifi, Battery, Clock, Sun, Moon } from 'lucide-react'
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import { TPESearchPage } from "@/components/tpe-search-page"
import { TPEBillingPage } from "@/components/tpe-billing-page"
import { TPEPaymentPage } from "@/components/tpe-payment-page"
import { TPEConversionPage } from "@/components/tpe-conversion-page"
import { TPEHistoryPage } from "@/components/tpe-history-page"
import { TPESettingsPage } from "@/components/tpe-settings-page"
import { TPEVatManagement } from "@/components/tpe-vat-management"
import { TPEStatisticsPage } from "@/components/tpe-statistics-page"
import type { AppState } from "@/app/page"

interface TPEDashboardProps {
  currentPage: AppState
  onNavigate: (page: AppState) => void
  onExitTPE: () => void
  walletData: any
}

export function TPEDashboard({ currentPage, onNavigate, onExitTPE, walletData }: TPEDashboardProps) {
  const { t } = useLanguage()
  const [currentTime, setCurrentTime] = useState(new Date())
  const { theme, setTheme } = useTheme()

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const renderStatusBar = () => (
    <div className="tpe-status-bar bg-card dark:bg-card text-foreground px-4 py-2 flex justify-between items-center text-sm border-b border-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Wifi className="h-4 w-4 text-green-500" />
          <span>{t.tpe.status.online}</span>
        </div>
        <div className="flex items-center gap-1">
          <Printer className="h-4 w-4 text-blue-500" />
          <span>{t.tpe.status.printerOk}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 p-0"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{currentTime.toLocaleTimeString("fr-CH")}</span>
        </div>
        <div className="flex items-center gap-1">
          <Battery className="h-4 w-4 text-green-500" />
          <span>85%</span>
        </div>
      </div>
    </div>
  )

  const renderTPEMenu = () => (
    <div className="tpe-container min-h-screen bg-background dark:bg-background">
      {renderStatusBar()}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">🏪 {t.tpe.title}</h1>
            <p className="text-muted-foreground mt-1">{t.tpe.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-300 dark:border-green-700"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {t.tpe.status.operational}
            </Badge>
            <Button variant="outline" onClick={onExitTPE} className="bg-background dark:bg-background">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.tpe.exitTPE}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="tpe-card bg-card dark:bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.tpe.stats.todaySales}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">2,450 CHF</p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="tpe-card bg-card dark:bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.tpe.stats.transactions}</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">18</p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="tpe-card bg-card dark:bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.tpe.stats.clients}</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="tpe-card bg-card dark:bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.tpe.stats.averageRate}</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">7.7%</p>
                </div>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <Calculator className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Menu */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Nouveau Paiement */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
            onClick={() => onNavigate("tpe-payment")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 hover:bg-white/30 transition-colors">
                <CreditCard className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">{t.tpe.menu.newPayment}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-green-100">{t.tpe.menu.newPaymentDescription}</p>
            </CardContent>
          </Card>

          {/* Recherche Client */}
          <Card
            className="tpe-card cursor-pointer hover:shadow-lg transition-all duration-200 bg-card dark:bg-card hover:bg-muted dark:hover:bg-muted"
            onClick={() => onNavigate("tpe-search")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-foreground">{t.tpe.menu.clientSearch}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t.tpe.menu.clientSearchDescription}</p>
            </CardContent>
          </Card>

          {/* Facturation */}
          <Card
            className="tpe-card cursor-pointer hover:shadow-lg transition-all duration-200 bg-card dark:bg-card hover:bg-muted dark:hover:bg-muted"
            onClick={() => onNavigate("tpe-billing")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Receipt className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-foreground">{t.tpe.menu.billing}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t.tpe.menu.billingDescription}</p>
            </CardContent>
          </Card>

          {/* Conversion */}
          <Card
            className="tpe-card cursor-pointer hover:shadow-lg transition-all duration-200 bg-card dark:bg-card hover:bg-muted dark:hover:bg-muted"
            onClick={() => onNavigate("tpe-conversion")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-foreground">{t.tpe.menu.conversion}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t.tpe.menu.conversionDescription}</p>
            </CardContent>
          </Card>

          {/* Historique */}
          <Card
            className="tpe-card cursor-pointer hover:shadow-lg transition-all duration-200 bg-card dark:bg-card hover:bg-muted dark:hover:bg-muted"
            onClick={() => onNavigate("tpe-history")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                <History className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-foreground">{t.tpe.menu.history}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t.tpe.menu.historyDescription}</p>
            </CardContent>
          </Card>

          {/* Gestion TVA */}
          <Card
            className="tpe-card cursor-pointer hover:shadow-lg transition-all duration-200 bg-card dark:bg-card hover:bg-muted dark:hover:bg-muted"
            onClick={() => onNavigate("tpe-vat-management")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-foreground">{t.tpe.menu.vatManagement}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t.tpe.menu.vatManagementDescription}</p>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card
            className="tpe-card cursor-pointer hover:shadow-lg transition-all duration-200 bg-card dark:bg-card hover:bg-muted dark:hover:bg-muted"
            onClick={() => onNavigate("tpe-statistics")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
              <CardTitle className="text-foreground">{t.tpe.menu.statistics}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t.tpe.menu.statisticsDescription}</p>
            </CardContent>
          </Card>

          {/* Paramètres */}
          <Card
            className="tpe-card cursor-pointer hover:shadow-lg transition-all duration-200 bg-card dark:bg-card hover:bg-muted dark:hover:bg-muted"
            onClick={() => onNavigate("tpe-settings")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
              <CardTitle className="text-foreground">{t.tpe.menu.settings}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t.tpe.menu.settingsDescription}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "tpe":
        return renderTPEMenu()
      case "tpe-search":
        return <TPESearchPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-billing":
        return <TPEBillingPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-payment":
        return <TPEPaymentPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} walletData={walletData} />
      case "tpe-conversion":
        return <TPEConversionPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-history":
        return <TPEHistoryPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-settings":
        return <TPESettingsPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-vat-management":
        return <TPEVatManagement onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-statistics":
        return <TPEStatisticsPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      default:
        return renderTPEMenu()
    }
  }

  return renderCurrentPage()
}
