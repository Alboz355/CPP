'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Download, ShoppingCart, CreditCard, Bell, Settings, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, DollarSign, Target, Users, BarChart3, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { getTranslation } from '@/lib/i18n'
import { CryptoList } from './crypto-list'
import { RealTimePrices } from './real-time-prices'

interface MainDashboardProps {
  userType: 'individual' | 'business'
  onNavigate: (page: string) => void
  walletData?: any
  onShowMtPelerin?: () => void
  onShowPriceAlert?: () => void
}

export function MainDashboard({ userType, onNavigate, walletData, onShowMtPelerin, onShowPriceAlert }: MainDashboardProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const [focusMode, setFocusMode] = useState(false)

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
    }
  }, [])

  const toggleFocusMode = () => {
    const newFocusMode = !focusMode
    setFocusMode(newFocusMode)
    localStorage.setItem("focus-mode", JSON.stringify(newFocusMode))
    
    // Apply focus mode styles immediately
    if (newFocusMode) {
      document.body.classList.add('focus-mode')
    } else {
      document.body.classList.remove('focus-mode')
    }
  }
  
  const [totalBalance] = useState(12847.32)
  const [monthlyChange] = useState(8.5)
  const [monthlyTransactions] = useState(47)
  const [monthlyVolume] = useState(8420.50)
  const [monthlyGoal] = useState(75)
  const [clientsCount] = useState(156)

  const recentTransactions = [
    {
      id: '1',
      type: 'received' as const,
      crypto: 'BTC',
      amount: 0.0234,
      value: 1250.00,
      from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'completed' as const
    },
    {
      id: '2',
      type: 'sent' as const,
      crypto: 'ETH',
      amount: 0.85,
      value: 2100.00,
      to: '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e3e3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'completed' as const
    },
    {
      id: '3',
      type: 'received' as const,
      crypto: 'ALGO',
      amount: 500,
      value: 125.00,
      from: 'ALGO1234567890ABCDEF',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      status: 'pending' as const
    }
  ]

  const formatTimeAgo = (date: Date) => {
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
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
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
  }

  return (
    <div className="min-h-screen bg-background ios-content-safe">
      {/* Focus Mode Toggle */}
      <button
        onClick={toggleFocusMode}
        className="focus-mode-toggle"
        title={focusMode ? "Désactiver le mode focus" : "Activer le mode focus"}
      >
        {focusMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>

      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between ios-header-safe">
          <div>
            <h1 className="text-3xl font-bold">
              {userType === 'business' ? t.dashboard.professionalTitle : t.dashboard.title}
            </h1>
            <p className="text-muted-foreground">
              {userType === 'business' ? t.dashboard.professionalSubtitle : t.dashboard.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => onShowPriceAlert && onShowPriceAlert()}>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onNavigate('settings')}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">{t.dashboard.totalBalance}</p>
                <p className={`text-3xl font-bold balance-amount ${focusMode ? 'sensitive-data' : ''}`}>
                  CHF {totalBalance.toLocaleString('fr-CH', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {monthlyChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-300" />
                  )}
                  <span className={`text-sm ${monthlyChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {monthlyChange >= 0 ? '+' : ''}{monthlyChange}% {t.time.thisMonth}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Avatar className="h-12 w-12 mb-2">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>CW</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2 card-hover button-press btn-enhanced"
            onClick={() => onNavigate('send')}
          >
            <Send className="h-6 w-6" />
            <span>{t.dashboard.quickActions.send}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2 card-hover button-press btn-enhanced"
            onClick={() => onNavigate('receive')}
          >
            <Download className="h-6 w-6" />
            <span>{t.dashboard.quickActions.receive}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2 card-hover button-press btn-enhanced"
            onClick={() => onShowMtPelerin && onShowMtPelerin()}
          >
            <ShoppingCart className="h-6 w-6" />
            <span>{t.dashboard.quickActions.buy}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2 card-hover button-press btn-enhanced"
            onClick={() => onNavigate('tpe')}
          >
            <CreditCard className="h-6 w-6" />
            <span>{t.dashboard.quickActions.tpeMode}</span>
          </Button>
        </div>

        {/* Statistics Cards for Business Users */}
        {userType === 'business' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.dashboard.statistics.monthlyTransactions}</p>
                    <p className="text-2xl font-bold">{monthlyTransactions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.dashboard.statistics.volumeExchanged}</p>
                    <p className="text-2xl font-bold">CHF {monthlyVolume.toLocaleString('fr-CH')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.tpe.stats.clients}</p>
                    <p className="text-2xl font-bold">{clientsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.dashboard.statistics.monthlyGoal}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={monthlyGoal} className="flex-1" />
                      <span className="text-sm font-medium">{monthlyGoal}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>{t.dashboard.portfolio}</CardTitle>
            </CardHeader>
            <CardContent>
              <CryptoList />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.dashboard.recentTransactions}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('history')} className="button-press">
                {t.dashboard.transactions.viewAll}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border card-hover">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        tx.type === 'received' 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : 'bg-red-100 dark:bg-red-900'
                      }`}>
                        {tx.type === 'received' ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {tx.type === 'received' ? t.dashboard.transactions.received : t.dashboard.transactions.sent} {tx.crypto}
                          </p>
                          {getStatusIcon(tx.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatTimeAgo(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium transaction-amount ${focusMode ? 'sensitive-data' : ''}`}>
                        {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.crypto}
                      </p>
                      <p className={`text-sm text-muted-foreground transaction-amount ${focusMode ? 'sensitive-data' : ''}`}>
                        CHF {tx.value.toLocaleString('fr-CH', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Prices */}
        <Card>
          <CardHeader>
            <CardTitle>Prix en Temps Réel</CardTitle>
          </CardHeader>
          <CardContent>
            <RealTimePrices />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
