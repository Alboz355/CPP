"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, History, Filter, Download, Search, ArrowLeftRight, Euro, BarChart3 } from "lucide-react"
import type { AppState } from "@/app/page"

interface Transaction {
  id: string
  type: "payment" | "conversion"
  amount: number
  currency: string
  toCurrency?: string
  toAmount?: number
  description?: string
  customerEmail?: string
  status: "completed" | "pending" | "failed"
  timestamp: string
}

interface TPEHistoryPageProps {
  onNavigate: (page: AppState) => void
}

export function TPEHistoryPage({ onNavigate }: TPEHistoryPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterPeriod, setFilterPeriod] = useState("today")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Statistiques
  const [stats, setStats] = useState({
    today: { transactions: 0, volume: 0, conversions: 0 },
    week: { transactions: 0, volume: 0, conversions: 0 },
    month: { transactions: 0, volume: 0, conversions: 0 },
  })

  useEffect(() => {
    // Charger les transactions TPE
    const tpeTransactions = JSON.parse(localStorage.getItem("tpe-transactions") || "[]")
    const tpeConversions = JSON.parse(localStorage.getItem("tpe-conversions") || "[]")

    // Combiner et trier les transactions
    const allTransactions = [
      ...tpeTransactions.map((t: any) => ({ ...t, type: "payment" })),
      ...tpeConversions.map((c: any) => ({ ...c, type: "conversion" })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setTransactions(allTransactions)
    calculateStats(allTransactions)
  }, [])

  useEffect(() => {
    // Filtrer les transactions
    let filtered = transactions

    // Filtre par type
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    // Filtre par période
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    switch (filterPeriod) {
      case "today":
        filtered = filtered.filter((t) => new Date(t.timestamp) >= today)
        break
      case "week":
        filtered = filtered.filter((t) => new Date(t.timestamp) >= weekAgo)
        break
      case "month":
        filtered = filtered.filter((t) => new Date(t.timestamp) >= monthAgo)
        break
      case "custom":
        const selectedDateTime = new Date(selectedDate)
        const nextDay = new Date(selectedDateTime.getTime() + 24 * 60 * 60 * 1000)
        filtered = filtered.filter((t) => {
          const transactionDate = new Date(t.timestamp)
          return transactionDate >= selectedDateTime && transactionDate < nextDay
        })
        break
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.currency.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredTransactions(filtered)
  }, [transactions, filterType, filterPeriod, selectedDate, searchTerm])

  const calculateStats = (transactions: Transaction[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const calculatePeriodStats = (startDate: Date) => {
      const periodTransactions = transactions.filter((t) => new Date(t.timestamp) >= startDate)
      const payments = periodTransactions.filter((t) => t.type === "payment")
      const conversions = periodTransactions.filter((t) => t.type === "conversion")

      return {
        transactions: payments.length,
        volume: payments.reduce((sum, t) => sum + t.amount, 0),
        conversions: conversions.length,
      }
    }

    setStats({
      today: calculatePeriodStats(today),
      week: calculatePeriodStats(weekAgo),
      month: calculatePeriodStats(monthAgo),
    })
  }

  const exportTransactions = () => {
    const csvContent = [
      ["Date", "Type", "Montant", "Devise", "Description", "Email", "Statut"].join(","),
      ...filteredTransactions.map((t) =>
        [
          new Date(t.timestamp).toLocaleString(),
          t.type === "payment" ? "Paiement" : "Conversion",
          t.amount,
          t.currency,
          t.description || "",
          t.customerEmail || "",
          t.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tpe-transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === "conversion") {
      return <ArrowLeftRight className="h-4 w-4 text-purple-600" />
    }
    return <Euro className="h-4 w-4 text-green-600" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Échoué</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("tpe")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Historique TPE</h1>
            <p className="text-gray-600">Transactions et statistiques</p>
          </div>
        </div>
        <Button variant="outline" onClick={exportTransactions}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        {/* Onglet Transactions */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtres</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par description, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtres */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="payment">Paiements</SelectItem>
                      <SelectItem value="conversion">Conversions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Période</label>
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="custom">Date personnalisée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sélecteur de date personnalisée */}
              {filterPeriod === "custom" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Liste des transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transactions</CardTitle>
                <Badge variant="outline">
                  {filteredTransactions.length} résultat{filteredTransactions.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Aucune transaction trouvée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">
                              {transaction.type === "payment" ? "Paiement reçu" : "Conversion"}
                            </p>
                            {getStatusBadge(transaction.status)}
                          </div>
                          <p className="text-sm text-gray-600">{new Date(transaction.timestamp).toLocaleString()}</p>
                          {transaction.description && (
                            <p className="text-sm text-gray-500">{transaction.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">
                          {transaction.amount} {transaction.currency}
                        </p>
                        {transaction.type === "conversion" && transaction.toAmount && (
                          <p className="text-sm text-purple-600">
                            → {transaction.toAmount} {transaction.toCurrency}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Statistiques */}
        <TabsContent value="statistics" className="space-y-6">
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Aujourd'hui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Transactions</span>
                    <span className="font-bold text-blue-600">{stats.today.transactions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Volume</span>
                    <span className="font-bold text-green-600">{stats.today.volume.toFixed(2)} CHF</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversions</span>
                    <span className="font-bold text-purple-600">{stats.today.conversions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Cette semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Transactions</span>
                    <span className="font-bold text-blue-600">{stats.week.transactions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Volume</span>
                    <span className="font-bold text-green-600">{stats.week.volume.toFixed(2)} CHF</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversions</span>
                    <span className="font-bold text-purple-600">{stats.week.conversions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ce mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Transactions</span>
                    <span className="font-bold text-blue-600">{stats.month.transactions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Volume</span>
                    <span className="font-bold text-green-600">{stats.month.volume.toFixed(2)} CHF</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversions</span>
                    <span className="font-bold text-purple-600">{stats.month.conversions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique simulé */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Évolution du volume</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-center space-x-4 bg-gray-50 rounded-lg p-4">
                {/* Barres simulées */}
                {[65, 45, 80, 55, 70, 90, 75].map((height, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className="w-8 bg-blue-500 rounded-t" style={{ height: `${height}%` }}></div>
                    <span className="text-xs text-gray-600">
                      {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR", {
                        weekday: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center mt-4">Volume des transactions des 7 derniers jours</p>
            </CardContent>
          </Card>

          {/* Répartition par crypto */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par cryptomonnaie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { crypto: "ETH", percentage: 45, volume: "1,250.00", color: "bg-blue-500" },
                  { crypto: "BTC", percentage: 30, volume: "890.00", color: "bg-orange-500" },
                  { crypto: "USDT", percentage: 25, volume: "675.00", color: "bg-green-500" },
                ].map((item) => (
                  <div key={item.crypto} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.crypto}</span>
                      <span className="text-sm text-gray-600">
                        {item.volume} CHF ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
