"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Download, Filter, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useLanguage } from "@/contexts/language-context"
import type { AppState } from "@/app/page"

interface TransactionHistoryProps {
  onNavigate: (page: AppState) => void
}

interface Transaction {
  id: string
  type: "send" | "receive"
  crypto: "bitcoin" | "ethereum" | "algorand"
  amount: string
  fiatAmount: string
  address: string
  status: "completed" | "pending" | "failed"
  timestamp: Date
  fee: string
  hash: string
}

// Données de démonstration
const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "receive",
    crypto: "bitcoin",
    amount: "0.00125000",
    fiatAmount: "52.50",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    status: "completed",
    timestamp: new Date("2024-01-15T14:30:00"),
    fee: "0.00001500",
    hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  },
  {
    id: "2",
    type: "send",
    crypto: "ethereum",
    amount: "0.05000000",
    fiatAmount: "125.75",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    status: "completed",
    timestamp: new Date("2024-01-14T09:15:00"),
    fee: "0.00250000",
    hash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1",
  },
  {
    id: "3",
    type: "send",
    crypto: "algorand",
    amount: "100.00000000",
    fiatAmount: "18.50",
    address: "ALGORAND7UHCUR2FJKL5QWERTYUIOPASDFGHJKLZXCVBNM",
    status: "pending",
    timestamp: new Date("2024-01-13T16:45:00"),
    fee: "0.00100000",
    hash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2",
  },
  {
    id: "4",
    type: "receive",
    crypto: "bitcoin",
    amount: "0.00250000",
    fiatAmount: "105.00",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    status: "failed",
    timestamp: new Date("2024-01-12T11:20:00"),
    fee: "0.00001000",
    hash: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3",
  },
  {
    id: "5",
    type: "receive",
    crypto: "ethereum",
    amount: "0.10000000",
    fiatAmount: "251.50",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    status: "completed",
    timestamp: new Date("2024-01-11T13:10:00"),
    fee: "0.00180000",
    hash: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4",
  },
]

export function TransactionHistory({ onNavigate }: TransactionHistoryProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "send" | "receive">("all")
  const [filterCrypto, setFilterCrypto] = useState<"all" | "bitcoin" | "ethereum" | "algorand">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "failed">("all")

  const filteredTransactions = useMemo(() => {
    if (!mockTransactions || mockTransactions.length === 0) return []

    return mockTransactions.filter((transaction) => {
      const matchesSearch =
        searchTerm === "" ||
        transaction.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.includes(searchTerm)

      const matchesType = filterType === "all" || transaction.type === filterType
      const matchesCrypto = filterCrypto === "all" || transaction.crypto === filterCrypto
      const matchesStatus = filterStatus === "all" || transaction.status === filterStatus

      return matchesSearch && matchesType && matchesCrypto && matchesStatus
    })
  }, [searchTerm, filterType, filterCrypto, filterStatus])

  const getCryptoIcon = (crypto: string) => {
    switch (crypto) {
      case "bitcoin":
        return "₿"
      case "ethereum":
        return "Ξ"
      case "algorand":
        return "Ⱥ"
      default:
        return "₿"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
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
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return t.history.filters.completed
      case "pending":
        return t.history.filters.pending
      case "failed":
        return t.history.filters.failed
      default:
        return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "send":
        return t.history.filters.sent
      case "receive":
        return t.history.filters.received
      default:
        return type
    }
  }

  const exportToCSV = () => {
    const headers = ["Date", "Heure", "Type", "Crypto", "Montant", "Montant Fiat", "Adresse", "Statut", "Frais", "Hash"]
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((tx) =>
        [
          tx.timestamp.toLocaleDateString(),
          tx.timestamp.toLocaleTimeString(),
          getTypeLabel(tx.type),
          tx.crypto,
          tx.amount,
          tx.fiatAmount,
          tx.address,
          getStatusLabel(tx.status),
          tx.fee,
          tx.hash,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("dashboard")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.common.back}</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.history.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{t.history.subtitle}</p>
            </div>
          </div>
          <Button onClick={exportToCSV} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>{t.history.exportCSV}</span>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>{t.history.filters.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.history.filters.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.history.filters.allTypes}</SelectItem>
                  <SelectItem value="send">{t.history.filters.sent}</SelectItem>
                  <SelectItem value="receive">{t.history.filters.received}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCrypto} onValueChange={(value: any) => setFilterCrypto(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Crypto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.history.filters.allCryptos}</SelectItem>
                  <SelectItem value="bitcoin">{t.crypto.bitcoin}</SelectItem>
                  <SelectItem value="ethereum">{t.crypto.ethereum}</SelectItem>
                  <SelectItem value="algorand">{t.crypto.algorand}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.history.filters.allStatuses}</SelectItem>
                  <SelectItem value="completed">{t.history.filters.completed}</SelectItem>
                  <SelectItem value="pending">{t.history.filters.pending}</SelectItem>
                  <SelectItem value="failed">{t.history.filters.failed}</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                  setFilterCrypto("all")
                  setFilterStatus("all")
                }}
              >
                {t.history.filters.reset}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Clock className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  {t.history.noTransactions}
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchTerm || filterType !== "all" || filterCrypto !== "all" || filterStatus !== "all"
                    ? t.history.noTransactionsFiltered
                    : t.history.noTransactionsDescription}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-full ${transaction.type === "receive" ? "bg-green-100 dark:bg-green-900/20" : "bg-blue-100 dark:bg-blue-900/20"}`}
                      >
                        {transaction.type === "receive" ? (
                          <ArrowDownLeft
                            className={`h-6 w-6 ${transaction.type === "receive" ? "text-green-600" : "text-blue-600"}`}
                          />
                        ) : (
                          <ArrowUpRight
                            className={`h-6 w-6 ${transaction.type === "receive" ? "text-green-600" : "text-blue-600"}`}
                          />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-lg">
                            {transaction.type === "receive" ? "+" : "-"}
                            {transaction.amount} {getCryptoIcon(transaction.crypto)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {transaction.crypto.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {getTypeLabel(transaction.type)}: {transaction.address.slice(0, 20)}
                          ...
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {transaction.timestamp.toLocaleDateString()} à {transaction.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(transaction.status)}
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusLabel(transaction.status)}
                        </Badge>
                      </div>
                      <div className="text-lg font-semibold">
                        {transaction.type === "receive" ? "+" : "-"}${transaction.fiatAmount}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Frais: {transaction.fee} {getCryptoIcon(transaction.crypto)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredTransactions.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t.history.summary.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredTransactions.filter((tx) => tx.type === "receive" && tx.status === "completed").length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.history.summary.received}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredTransactions.filter((tx) => tx.type === "send" && tx.status === "completed").length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.history.summary.sent}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredTransactions.filter((tx) => tx.status === "pending").length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.history.summary.pending}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredTransactions.filter((tx) => tx.status === "failed").length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.history.summary.failed}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
