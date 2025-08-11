'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Download, ShoppingCart, CreditCard, Bell, Settings, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, DollarSign, Target, Users, BarChart3, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { getTranslation } from '@/lib/i18n'
import { formatBalance, formatCryptoAmount } from '@/lib/wallet-utils'
import { CryptoList } from './crypto-list'
import { RealTimePrices } from './real-time-prices'
import type { AppState } from '@/app/page'
import type { UserType } from '@/components/onboarding-page'

interface MainDashboardProps {
  userType: UserType | 'individual' | 'business' | null
  onNavigate: (page: AppState) => void
  walletData?: any
  onShowMtPelerin?: () => void
  onShowPriceAlert?: () => void
}

export function MainDashboard({ userType, onNavigate, walletData, onShowMtPelerin, onShowPriceAlert }: MainDashboardProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const [focusMode, setFocusMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Helper function to check if user is business/merchant
  const isBusinessUser = userType === 'business' || userType === 'merchant'

  useEffect(() => {
    const savedFocusMode = localStorage.getItem("focus-mode")
    
    if (savedFocusMode) {
      const focusModeEnabled = JSON.parse(savedFocusMode)
      setFocusMode(focusModeEnabled)
      // Apply focus mode to body
      if (focusModeEnabled) {
        document.body.classList.add('focus-mode')
      } else {
        document.body.classList.remove('focus-mode')
      }
    } else {
      // Si pas de préférence sauvegardée, s'assurer que le mode focus est désactivé
      setFocusMode(false)
      document.body.classList.remove('focus-mode')
    }
    
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const toggleFocusMode = useCallback(() => {
    const newFocusMode = !focusMode
    setFocusMode(newFocusMode)
    localStorage.setItem("focus-mode", JSON.stringify(newFocusMode))
    
    // Apply focus mode styles immediately
    if (newFocusMode) {
      document.body.classList.add('focus-mode')
    } else {
      document.body.classList.remove('focus-mode')
    }
  }, [focusMode])
  
  // Utiliser les vraies données du wallet avec calcul en temps réel
  const dashboardData = useMemo(() => {
    // Données par défaut
    let totalBalance = 0
    let totalBalanceFormatted = 'CHF 0.00'
    let isLoading = true
    
    return {
      totalBalance,
      totalBalanceFormatted,
      isLoading,
      btcBalance: walletData?.balances?.bitcoin || 0,
      ethBalance: walletData?.balances?.ethereum || 0,
      algoBalance: walletData?.balances?.algorand || 0,
      solBalance: walletData?.balances?.solana || 0,
      monthlyChange: 0,
      monthlyTransactions: 0,
      monthlyVolume: 0,
      monthlyGoal: 0,
      clientsCount: 0
    }
  }, [walletData])

  // État pour les vraies données calculées
  const [realTimeBalance, setRealTimeBalance] = useState<{
    total: number
    formatted: string
    breakdown: any
    lastUpdated?: string
    isLoading: boolean
    error?: string
  }>({
    total: 0,
    formatted: 'CHF 0.00',
    breakdown: {},
    isLoading: true
  })

  // Fonction pour récupérer le vrai solde total
  const fetchRealBalance = useCallback(async () => {
    if (!walletData?.addresses) {
      console.warn('⚠️ Pas d\'adresses disponibles pour calculer le solde')
      setRealTimeBalance(prev => ({ ...prev, isLoading: false }))
      return
    }

    try {
      console.log('🔄 Récupération solde total en temps réel...')
      setRealTimeBalance(prev => ({ ...prev, isLoading: true, error: undefined }))

      const response = await fetch('/api/wallet-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addresses: walletData.addresses,
          currency: 'CHF'
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        const { stats, breakdown } = result.data
        
        setRealTimeBalance({
          total: stats.totalValue,
          formatted: stats.totalValueFormatted,
          breakdown,
          lastUpdated: stats.lastUpdated,
          isLoading: false
        })
        
        console.log(`✅ Solde total calculé: ${stats.totalValueFormatted}`)
      } else {
        throw new Error(result.error || 'Erreur de calcul du solde')
      }
    } catch (error) {
      console.error('❌ Erreur calcul solde:', error)
      setRealTimeBalance(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }))
    }
  }, [walletData])

  // Charger le solde au montage et refresh périodique
  useEffect(() => {
    // Chargement initial avec délai pour éviter le spam
    const timer = setTimeout(() => {
      fetchRealBalance()
    }, 1000)

    // Refresh périodique (toutes les 2 minutes)
    const interval = setInterval(fetchRealBalance, 2 * 60 * 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [fetchRealBalance])

  // Fonction de refresh manuel
  const handleRefreshBalance = useCallback(async () => {
    setIsRefreshing(true)
    await fetchRealBalance()
    // Petit délai pour l'UX
    setTimeout(() => setIsRefreshing(false), 1000)
  }, [fetchRealBalance])

  interface Transaction {
    id: string
    type: 'received' | 'sent'
    crypto: string
    amount: number | string
    value: number
    from?: string
    to?: string
    timestamp: Date
    status: 'completed' | 'pending' | 'failed'
  }

  const recentTransactions = useMemo((): Transaction[] => {
    // Récupérer les vraies transactions depuis localStorage
    try {
      const history = localStorage.getItem('transaction-history')
      if (history) {
        const parsed = JSON.parse(history)
        // Prendre les 3 dernières transactions
        return parsed
          .slice(0, 3)
          .map((tx: any) => ({
            ...tx,
            timestamp: new Date(tx.timestamp)
          }))
      }
    } catch (error) {
      console.error('Error loading recent transactions:', error)
    }
    return []
  }, [])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await fetchRealBalance()
    // Petit délai pour l'UX
    setTimeout(() => setIsRefreshing(false), 1000)
  }, [fetchRealBalance])

  const formatTimeAgo = useCallback((date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? t.time.minute : t.time.minutes} ${t.time.ago}`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} ${hours === 1 ? t.time.hour : t.time.hours} ${t.time.ago}`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} ${days === 1 ? t.time.day : t.time.days} ${t.time.ago}`
    }
  }, [t.time])

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-[#34C759]" />
      case 'pending':
        return <Clock className="h-4 w-4 text-[#FF9500]" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-[#FF3B30]" />
      default:
        return <Clock className="h-4 w-4 text-[#8E8E93]" />
    }
  }, [])

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'completed':
        return t.dashboard.transactions.completed
      case 'pending':
        return t.dashboard.transactions.pending
      case 'failed':
        return t.dashboard.transactions.failed
      default:
        return status
    }
  }, [t.dashboard.transactions])

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] ios-content-safe" role="main" aria-label="Tableau de bord principal">
      {/* Focus Mode Toggle */}
      <button
        onClick={toggleFocusMode}
        className="focus-mode-toggle apple-press"
        title={focusMode ? "Désactiver le mode focus" : "Activer le mode focus"}
        aria-label={focusMode ? "Désactiver le mode focus" : "Activer le mode focus"}
        aria-pressed={focusMode}
        aria-describedby="focus-mode-description"
      >
        {focusMode ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
      </button>
      <div id="focus-mode-description" className="sr-only">
        {focusMode ? "Mode focus activé - Les montants sont masqués" : "Mode focus désactivé - Les montants sont visibles"}
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Header Style Apple */}
        <header className="flex items-center justify-between ios-header-safe" role="banner">
          <div>
            <h1 className="text-3xl font-semibold text-[#000000] dark:text-[#FFFFFF]" id="dashboard-title">
              {isBusinessUser ? t.dashboard.professionalTitle : t.dashboard.title}
            </h1>
            <p className="text-[#8E8E93] mt-1" id="dashboard-subtitle">
              {isBusinessUser ? t.dashboard.professionalSubtitle : t.dashboard.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3" role="toolbar" aria-label="Actions rapides">
            <button
              onClick={() => onShowPriceAlert && onShowPriceAlert()} 
              className="btn-icon"
              aria-label="Alertes de prix"
              aria-describedby="price-alert-description"
            >
              <Bell className="h-5 w-5 text-[#007AFF]" aria-hidden="true" />
            </button>
            <div id="price-alert-description" className="sr-only">
              Ouvrir les alertes de prix pour configurer des notifications
            </div>
            <button
              onClick={() => onNavigate('settings')} 
              className="btn-icon"
              aria-label="Paramètres"
              aria-describedby="settings-description"
            >
              <Settings className="h-5 w-5 text-[#007AFF]" aria-hidden="true" />
            </button>
            <div id="settings-description" className="sr-only">
              Ouvrir les paramètres de l'application
            </div>
          </div>
        </header>

        {/* Loading State Style Apple */}
        {isLoading && (
          <Card className="apple-card" role="status" aria-live="polite">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="h-6 w-6 animate-spin text-[#007AFF]" aria-hidden="true" />
                <span className="text-[#000000] dark:text-[#FFFFFF] font-medium">Chargement des données...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Balance Card Style Apple */}
        {!isLoading && (
          <Card className="apple-card balance-card bg-[#FFFFFF] dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#38383A] shadow-lg apple-hover" role="region" aria-labelledby="balance-title">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8E8E93] mb-2 text-sm font-medium" id="balance-title">{t.dashboard.totalBalance}</p>
                  {realTimeBalance.isLoading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-[#007AFF]" aria-hidden="true" />
                      <span className="text-2xl font-medium text-[#8E8E93]">Calcul en cours...</span>
                    </div>
                  ) : realTimeBalance.error ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-2xl font-medium text-[#FF3B30]">Erreur calcul</p>
                      <p className="text-xs text-[#8E8E93]">{realTimeBalance.error}</p>
                    </div>
                  ) : (
                    <p className={`text-4xl font-bold balance-display ${realTimeBalance.total > 0 ? 'balance-positive' : 'balance-zero'} ${focusMode ? 'sensitive-data' : ''}`} 
                       aria-live="polite">
                      {realTimeBalance.formatted}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3" role="status" aria-live="polite">
                    <TrendingUp className="h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
                    <span className="text-sm text-[#8E8E93] font-medium">
                      {realTimeBalance.lastUpdated ? 
                        `Mis à jour: ${new Date(realTimeBalance.lastUpdated).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}` :
                        '0.00% ' + t.time.thisMonth
                      }
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <Avatar className="h-16 w-16 mb-2 border-2 border-[#E5E5EA] dark:border-[#38383A]">
                    <AvatarImage src="/placeholder-logo.png" alt="CryptoWallet" />
                    <AvatarFallback className="bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#000000] dark:text-[#FFFFFF] font-semibold">CW</AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRefreshBalance}
                    disabled={isRefreshing || realTimeBalance.isLoading}
                    className="text-[#007AFF] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl flex items-center gap-2"
                  >
                    {isRefreshing || realTimeBalance.isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-xs">Actualiser</span>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Style Apple */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="group" aria-label="Actions rapides">
          <button
            className="btn-action"
            onClick={() => onNavigate('send')}
            aria-label={`${t.dashboard.quickActions.send} - Envoyer des cryptomonnaies`}
          >
            <Send className="h-8 w-8 text-[#007AFF]" aria-hidden="true" />
            <span className="font-medium text-[#000000] dark:text-[#FFFFFF]">{t.dashboard.quickActions.send}</span>
          </button>
          <button
            className="btn-action"
            onClick={() => onNavigate('receive')}
            aria-label={`${t.dashboard.quickActions.receive} - Recevoir des cryptomonnaies`}
          >
            <Download className="h-8 w-8 text-[#007AFF]" aria-hidden="true" />
            <span className="font-medium text-[#000000] dark:text-[#FFFFFF]">{t.dashboard.quickActions.receive}</span>
          </button>
          <button
            className="btn-action"
            onClick={() => onShowMtPelerin && onShowMtPelerin()}
            aria-label={`${t.dashboard.quickActions.buy} - Acheter des cryptomonnaies`}
          >
            <ShoppingCart className="h-8 w-8 text-[#007AFF]" aria-hidden="true" />
            <span className="font-medium text-[#000000] dark:text-[#FFFFFF]">{t.dashboard.quickActions.buy}</span>
          </button>
          <button
            className="btn-action"
            onClick={() => onNavigate('tpe')}
            aria-label={`${t.dashboard.quickActions.tpeMode} - Mode terminal de paiement`}
          >
            <CreditCard className="h-8 w-8 text-[#007AFF]" aria-hidden="true" />
            <span className="font-medium text-[#000000] dark:text-[#FFFFFF]">{t.dashboard.quickActions.tpeMode}</span>
          </button>
        </div>

        {/* Statistics Cards for Business Users Style Apple */}
        {isBusinessUser && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="apple-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#007AFF]/10 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-[#007AFF]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8E8E93]">{t.dashboard.statistics.monthlyTransactions}</p>
                    <p className="text-2xl font-bold text-[#000000] dark:text-[#FFFFFF]">{dashboardData.monthlyTransactions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#34C759]/10 rounded-xl">
                    <DollarSign className="h-6 w-6 text-[#34C759]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8E8E93]">{t.dashboard.statistics.volumeExchanged}</p>
                    <p className="text-2xl font-bold text-[#000000] dark:text-[#FFFFFF]">CHF 0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#FF9500]/10 rounded-xl">
                    <Target className="h-6 w-6 text-[#FF9500]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8E8E93]">{t.dashboard.statistics.monthlyGoal}</p>
                    <p className="text-2xl font-bold text-[#000000] dark:text-[#FFFFFF]">{dashboardData.monthlyGoal}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#AF52DE]/10 rounded-xl">
                    <Users className="h-6 w-6 text-[#AF52DE]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8E8E93]">Clients</p>
                    <p className="text-2xl font-bold text-[#000000] dark:text-[#FFFFFF]">{dashboardData.clientsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Style Apple */}
          <Card className="apple-card">
            <CardHeader className="apple-card-header">
              <CardTitle className="apple-card-title">
                <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                  <BarChart3 className="h-5 w-5 text-[#007AFF]" />
                </div>
                {t.dashboard.portfolio}
              </CardTitle>
            </CardHeader>
            <CardContent className="apple-card-content">
              <CryptoList />
            </CardContent>
          </Card>

          {/* Recent Transactions Style Apple */}
          <Card className="apple-card">
            <CardHeader className="flex flex-row items-center justify-between apple-card-header">
              <CardTitle className="apple-card-title">
                <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                  <Clock className="h-5 w-5 text-[#007AFF]" />
                </div>
                {t.dashboard.recentTransactions}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate('history')} 
                className="text-[#007AFF] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl"
              >
                {t.dashboard.transactions.viewAll}
              </Button>
            </CardHeader>
            <CardContent className="apple-card-content">
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl border border-[#E5E5EA] dark:border-[#38383A]">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        tx.type === 'received' 
                          ? 'bg-[#34C759]/10' 
                          : 'bg-[#FF3B30]/10'
                      }`}>
                        {tx.type === 'received' ? (
                          <ArrowDownLeft className="h-4 w-4 text-[#34C759]" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-[#FF3B30]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[#000000] dark:text-[#FFFFFF]">
                            {tx.type === 'received' ? t.dashboard.transactions.received : t.dashboard.transactions.sent} {tx.crypto}
                          </p>
                          {getStatusIcon(tx.status)}
                        </div>
                        <p className="text-sm text-[#8E8E93]">
                          {formatTimeAgo(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium transaction-amount ${focusMode ? 'sensitive-data' : ''} text-[#000000] dark:text-[#FFFFFF]`}>
                        {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.crypto}
                      </p>
                      <p className={`text-sm text-[#8E8E93] transaction-amount ${focusMode ? 'sensitive-data' : ''}`}>
                        CHF {tx.value.toLocaleString('fr-CH', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Prices Style Apple */}
        <Card className="apple-card">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title">
              <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#007AFF]" />
              </div>
              Prix en Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent className="apple-card-content">
            <RealTimePrices />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
