"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  CreditCard,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
} from "lucide-react"
import type { AppState } from "@/app/page"

interface TPEStatisticsPageProps {
  onNavigate: (page: AppState) => void
  onBack: () => void
}

interface StatisticsData {
  totalRevenue: number
  totalTransactions: number
  totalCustomers: number
  averageTransaction: number
  topCrypto: string
  conversionRate: number
  dailyStats: Array<{
    date: string
    revenue: number
    transactions: number
  }>
  cryptoBreakdown: Array<{
    crypto: string
    percentage: number
    volume: number
    transactions: number
  }>
  monthlyComparison: {
    currentMonth: number
    previousMonth: number
    growth: number
  }
}

export function TPEStatisticsPage({ onNavigate, onBack }: TPEStatisticsPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<StatisticsData>({
    totalRevenue: 45680.75,
    totalTransactions: 156,
    totalCustomers: 89,
    averageTransaction: 292.82,
    topCrypto: "Bitcoin",
    conversionRate: 0.94,
    dailyStats: [
      { date: "2024-01-01", revenue: 2450, transactions: 8 },
      { date: "2024-01-02", revenue: 3200, transactions: 12 },
      { date: "2024-01-03", revenue: 1800, transactions: 6 },
      { date: "2024-01-04", revenue: 4100, transactions: 15 },
      { date: "2024-01-05", revenue: 2900, transactions: 10 },
      { date: "2024-01-06", revenue: 3500, transactions: 13 },
      { date: "2024-01-07", revenue: 2750, transactions: 9 },
    ],
    cryptoBreakdown: [
      { crypto: "Bitcoin", percentage: 45, volume: 20556.34, transactions: 70 },
      { crypto: "Ethereum", percentage: 35, volume: 15988.26, transactions: 55 },
      { crypto: "Algorand", percentage: 20, volume: 9136.15, transactions: 31 },
    ],
    monthlyComparison: {
      currentMonth: 45680.75,
      previousMonth: 38920.5,
      growth: 17.4,
    },
  })

  const refreshStats = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const exportData = (format: "csv" | "pdf") => {
    const data = {
      period: selectedPeriod,
      stats: stats,
      exportDate: new Date().toISOString(),
    }

    if (format === "csv") {
      const csvContent = `
Période,${selectedPeriod}
Chiffre d'affaires total,${stats.totalRevenue} CHF
Nombre de transactions,${stats.totalTransactions}
Nombre de clients,${stats.totalCustomers}
Transaction moyenne,${stats.averageTransaction} CHF
Crypto principale,${stats.topCrypto}
Taux de conversion,${(stats.conversionRate * 100).toFixed(1)}%

Répartition par crypto:
${stats.cryptoBreakdown
  .map((crypto) => `${crypto.crypto},${crypto.percentage}%,${crypto.volume} CHF,${crypto.transactions} transactions`)
  .join("\n")}
      `.trim()

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `statistiques-tpe-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency: "CHF",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="bg-background dark:bg-background">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au TPE
          </Button>
          <h1 className="text-2xl font-bold text-foreground">📊 Statistiques TPE</h1>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32 bg-background dark:bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">3 mois</SelectItem>
                <SelectItem value="1y">1 an</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshStats}
              disabled={loading}
              className="bg-background dark:bg-background"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card dark:bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {formatPercentage(stats.monthlyComparison.growth)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5%
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clients uniques</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCustomers}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction moyenne</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.averageTransaction)}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +4.1%
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted dark:bg-muted">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="crypto">Cryptomonnaies</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Daily Revenue Chart */}
              <Card className="bg-card dark:bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Évolution quotidienne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.dailyStats.map((day, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted dark:bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {new Date(day.date).toLocaleDateString("fr-CH", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">{day.transactions} transactions</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{formatCurrency(day.revenue)}</p>
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{
                                width: `${(day.revenue / Math.max(...stats.dailyStats.map((d) => d.revenue))) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-card dark:bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Indicateurs de performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted dark:bg-muted rounded-lg">
                    <span className="text-foreground">Taux de conversion</span>
                    <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                      {(stats.conversionRate * 100).toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted dark:bg-muted rounded-lg">
                    <span className="text-foreground">Crypto préférée</span>
                    <Badge className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400">
                      {stats.topCrypto}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted dark:bg-muted rounded-lg">
                    <span className="text-foreground">Croissance mensuelle</span>
                    <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                      {formatPercentage(stats.monthlyComparison.growth)}
                    </Badge>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">Comparaison mensuelle</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Mois actuel</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(stats.monthlyComparison.currentMonth)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Mois précédent</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(stats.monthlyComparison.previousMonth)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Répartition par cryptomonnaie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.cryptoBreakdown.map((crypto, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              crypto.crypto === "Bitcoin"
                                ? "bg-orange-500"
                                : crypto.crypto === "Ethereum"
                                  ? "bg-blue-500"
                                  : "bg-black"
                            }`}
                          ></div>
                          <span className="font-medium text-foreground">{crypto.crypto}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{crypto.percentage}%</p>
                          <p className="text-sm text-muted-foreground">{crypto.transactions} transactions</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            crypto.crypto === "Bitcoin"
                              ? "bg-orange-500"
                              : crypto.crypto === "Ethereum"
                                ? "bg-blue-500"
                                : "bg-black"
                          }`}
                          style={{ width: `${crypto.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Volume: {formatCurrency(crypto.volume)}</span>
                        <span>Moy: {formatCurrency(crypto.volume / crypto.transactions)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-card dark:bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Tendances hebdomadaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Lundi</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Mardi</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">80%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Mercredi</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div className="w-full h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">100%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Jeudi</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Vendredi</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div className="w-5/6 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">90%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Samedi</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div className="w-3/5 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">60%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Dimanche</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div className="w-2/5 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">40%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card dark:bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Heures de pointe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-green-100 dark:bg-green-900/20 rounded">
                      <span className="text-foreground">14h - 16h</span>
                      <Badge className="bg-green-600 text-white">Peak</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                      <span className="text-foreground">10h - 12h</span>
                      <Badge className="bg-blue-600 text-white">High</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-100 dark:bg-orange-900/20 rounded">
                      <span className="text-foreground">16h - 18h</span>
                      <Badge className="bg-orange-600 text-white">Medium</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                      <span className="text-foreground">8h - 10h</span>
                      <Badge variant="secondary">Low</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Exporter les données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => exportData("csv")}
                    className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Exporter CSV
                  </Button>
                  <Button
                    onClick={() => exportData("pdf")}
                    className="h-20 flex flex-col items-center justify-center bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Exporter PDF
                  </Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-3">Données incluses</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Chiffre d'affaires par période</li>
                    <li>• Nombre de transactions</li>
                    <li>• Répartition par cryptomonnaie</li>
                    <li>• Statistiques clients</li>
                    <li>• Tendances temporelles</li>
                    <li>• Taux de conversion</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
