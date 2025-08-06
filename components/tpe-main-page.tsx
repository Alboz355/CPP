"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3,
  ActivityIcon,
  Search,
  FileText,
  ArrowLeftRight,
  History,
  Settings,
  Zap,
  Target,
  Receipt,
  QrCode,
  Wifi,
  Battery,
  Signal,
} from "lucide-react"
import type { AppState } from "@/app/page"

interface TPEMainPageProps {
  onNavigate: (page: AppState) => void
  onExitTPE: () => void
  walletData: any
}

interface DashboardStats {
  todayTransactions: number
  todayVolume: number
  weekVolume: number
  monthVolume: number
  pendingTransactions: number
  averageTransaction: number
  topCrypto: string
  conversionRate: number
}

interface RecentTransaction {
  id: string
  type: "payment" | "conversion" | "refund"
  customer: string
  amount: string
  currency: string
  cryptoAmount: string
  cryptoCurrency: string
  time: string
  status: "completed" | "pending" | "failed"
}

// Données de test améliorées
const mockStats: DashboardStats = {
  todayTransactions: 24,
  todayVolume: 12450.75,
  weekVolume: 89320.5,
  monthVolume: 345680.25,
  pendingTransactions: 3,
  averageTransaction: 518.78,
  topCrypto: "Bitcoin",
  conversionRate: 0.95,
}

const mockTransactions: RecentTransaction[] = [
  {
    id: "TXN001",
    type: "payment",
    customer: "Marie Dubois",
    amount: "2,150.00",
    currency: "CHF",
    cryptoAmount: "0.05",
    cryptoCurrency: "BTC",
    time: "14:30",
    status: "completed",
  },
  {
    id: "TXN002",
    type: "conversion",
    customer: "Jean Martin",
    amount: "12,480.00",
    currency: "CHF",
    cryptoAmount: "5.2",
    cryptoCurrency: "ETH",
    time: "13:45",
    status: "completed",
  },
  {
    id: "TXN003",
    type: "payment",
    customer: "Anna Schmidt",
    amount: "320.00",
    currency: "CHF",
    cryptoAmount: "1000",
    cryptoCurrency: "ALGO",
    time: "12:20",
    status: "pending",
  },
  {
    id: "TXN004",
    type: "refund",
    customer: "Pierre Müller",
    amount: "860.00",
    currency: "CHF",
    cryptoAmount: "0.02",
    cryptoCurrency: "BTC",
    time: "11:15",
    status: "completed",
  },
]

export function TPEMainPage({ onNavigate, onExitTPE, walletData }: TPEMainPageProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>(mockTransactions)
  const [quickAmount, setQuickAmount] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <ArrowDownRight className="h-4 w-4 text-green-600" />
      case "conversion":
        return <ArrowLeftRight className="h-4 w-4 text-blue-600" />
      case "refund":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const quickActions = [
    {
      title: "Paiement Rapide",
      description: "Nouveau paiement crypto",
      icon: CreditCard,
      action: () => onNavigate("tpe-payment"),
      color: "bg-green-600 hover:bg-green-700",
      shortcut: "P",
    },
    {
      title: "Recherche Client",
      description: "Trouver un client",
      icon: Search,
      action: () => onNavigate("tpe-search"),
      color: "bg-blue-600 hover:bg-blue-700",
      shortcut: "R",
    },
    {
      title: "Facturation",
      description: "Créer une facture",
      icon: FileText,
      action: () => onNavigate("tpe-billing"),
      color: "bg-purple-600 hover:bg-purple-700",
      shortcut: "F",
    },
    {
      title: "Conversion",
      description: "Convertir crypto",
      icon: ArrowLeftRight,
      action: () => onNavigate("tpe-conversion"),
      color: "bg-orange-600 hover:bg-orange-700",
      shortcut: "C",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Enhanced Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onExitTPE} className="text-white hover:bg-white/10">
              ← Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold">🏪 Terminal de Paiement</h1>
              <p className="text-blue-200 text-sm">Mode Commerçant Actif</p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Wifi className="h-4 w-4 text-green-400" />
              <Signal className="h-4 w-4 text-green-400" />
              <Battery className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-xl font-mono font-bold">{currentTime.toLocaleTimeString("fr-CH")}</div>
              <div className="text-xs text-blue-200">
                {currentTime.toLocaleDateString("fr-CH", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Enhanced Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Aujourd'hui</p>
                  <p className="text-2xl font-bold">{stats.todayVolume.toLocaleString()} CHF</p>
                  <p className="text-xs text-green-100">{stats.todayTransactions} transactions</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Cette Semaine</p>
                  <p className="text-2xl font-bold">{stats.weekVolume.toLocaleString()} CHF</p>
                  <p className="text-xs text-blue-100">+12.5% vs semaine dernière</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Transaction Moyenne</p>
                  <p className="text-2xl font-bold">{stats.averageTransaction.toLocaleString()} CHF</p>
                  <p className="text-xs text-purple-100">Crypto préférée: {stats.topCrypto}</p>
                </div>
                <Target className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">En Attente</p>
                  <p className="text-2xl font-bold">{stats.pendingTransactions}</p>
                  <p className="text-xs text-orange-100">
                    Taux de conversion: {(stats.conversionRate * 100).toFixed(1)}%
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 border-white/10">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-white/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Tableau de Bord
            </TabsTrigger>
            <TabsTrigger value="quick-pay" className="text-white data-[state=active]:bg-white/20">
              <Zap className="h-4 w-4 mr-2" />
              Paiement Rapide
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-white data-[state=active]:bg-white/20">
              <ActivityIcon className="h-4 w-4 mr-2" />
              Activité
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-white data-[state=active]:bg-white/20">
              <Settings className="h-4 w-4 mr-2" />
              Outils
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Actions Grid */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      className={`${action.color} h-24 flex flex-col items-center justify-center text-white border-0 relative group`}
                    >
                      <action.icon className="h-6 w-6 mb-2" />
                      <span className="font-semibold text-sm">{action.title}</span>
                      <span className="text-xs opacity-80">{action.description}</span>
                      <Badge className="absolute top-2 right-2 bg-white/20 text-white text-xs">{action.shortcut}</Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5" />
                  État du Système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-white">Réseau Bitcoin</span>
                    <Badge className="bg-green-500 text-white">🟢 Actif</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-white">Réseau Ethereum</span>
                    <Badge className="bg-green-500 text-white">🟢 Actif</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-white">Prix Crypto</span>
                    <Badge className="bg-green-500 text-white">🟢 Sync</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quick-pay" className="space-y-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Paiement Express
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm mb-2 block">Montant (CHF)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={quickAmount}
                      onChange={(e) => setQuickAmount(e.target.value)}
                      className="bg-white/10 border-white/20 text-white text-2xl font-bold text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white text-sm block">Montants Rapides</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["50", "100", "200", "500", "1000", "2000"].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          onClick={() => setQuickAmount(amount)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => onNavigate("tpe-payment")}
                    className="bg-green-600 hover:bg-green-700 h-16 flex flex-col"
                    disabled={!quickAmount}
                  >
                    <QrCode className="h-6 w-6 mb-1" />
                    Générer QR Code
                  </Button>
                  <Button
                    onClick={() => onNavigate("tpe-search")}
                    className="bg-blue-600 hover:bg-blue-700 h-16 flex flex-col"
                  >
                    <Search className="h-6 w-6 mb-1" />
                    Rechercher Client
                  </Button>
                  <Button
                    onClick={() => onNavigate("tpe-billing")}
                    className="bg-purple-600 hover:bg-purple-700 h-16 flex flex-col"
                  >
                    <Receipt className="h-6 w-6 mb-1" />
                    Nouvelle Facture
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(transaction.type)}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{transaction.customer}</span>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status === "completed"
                                ? "✅"
                                : transaction.status === "pending"
                                  ? "⏳"
                                  : "❌"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300">
                            {transaction.id} • {transaction.time}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-white">
                          {transaction.amount} {transaction.currency}
                        </div>
                        <div className="text-sm text-blue-300">
                          {transaction.cryptoAmount} {transaction.cryptoCurrency}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => onNavigate("tpe-settings")}
                    className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres TPE
                  </Button>
                  <Button
                    onClick={() => onNavigate("tpe-vat-management")}
                    className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Gestion TVA
                  </Button>
                  <Button
                    onClick={() => onNavigate("tpe-history")}
                    className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0"
                  >
                    <History className="h-4 w-4 mr-2" />
                    Historique Complet
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistiques Avancées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <p className="text-2xl font-bold text-white">{stats.monthVolume.toLocaleString()}</p>
                      <p className="text-xs text-gray-300">Volume Mensuel (CHF)</p>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <p className="text-2xl font-bold text-white">{(stats.conversionRate * 100).toFixed(1)}%</p>
                      <p className="text-xs text-gray-300">Taux de Conversion</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Bitcoin</span>
                      <span className="text-white">45%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Ethereum</span>
                      <span className="text-white">35%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Algorand</span>
                      <span className="text-white">20%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Alert Messages */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-white">Terminal de Paiement Actif</p>
                <p className="text-sm text-blue-200">
                  Tous les systèmes fonctionnent normalement. Prêt à accepter les paiements crypto.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
