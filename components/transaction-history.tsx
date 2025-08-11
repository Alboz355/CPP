"use client"

import { useState, useMemo, useEffect } from "react"
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

// Récupérer les vraies transactions depuis localStorage
const getTransactionHistory = (): Transaction[] => {
  try {
    const history = localStorage.getItem('transaction-history')
    if (history) {
      const parsed = JSON.parse(history)
      // Convertir les timestamps en Date objects
      return parsed.map((tx: any) => ({
        ...tx,
        timestamp: new Date(tx.timestamp)
      }))
    }
  } catch (error) {
    console.error('Error loading transaction history:', error)
  }
  return []
}

export function TransactionHistory({ onNavigate }: TransactionHistoryProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "send" | "receive">("all")
  const [filterCrypto, setFilterCrypto] = useState<"all" | "bitcoin" | "ethereum" | "algorand">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "failed">("all")

  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Charger l'historique au montage et écouter les changements
    const loadTransactions = () => {
      setTransactions(getTransactionHistory())
    }
    loadTransactions()

    // Écouter les changements dans localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'transaction-history') {
        loadTransactions()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // Rafraîchir périodiquement
    const interval = setInterval(loadTransactions, 5000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return []

    return transactions.filter((transaction) => {
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

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setFilterCrypto("all")
    setFilterStatus("all")
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Style Apple */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("dashboard")}
              className="flex items-center space-x-2 bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 text-[#007AFF]" />
              <span className="text-[#007AFF] font-medium">{t.common.back}</span>
            </Button>
            <div>
              <h1 className="text-3xl font-semibold text-[#000000] dark:text-[#FFFFFF]">{t.history.title}</h1>
              <p className="text-[#8E8E93]">{t.history.subtitle}</p>
            </div>
          </div>
          <Button 
            onClick={exportToCSV} 
            className="apple-button flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{t.history.exportCSV}</span>
          </Button>
        </div>

        {/* Filters Style Apple */}
        <Card className="apple-card mb-6">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title">
              <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                <Filter className="h-5 w-5 text-[#007AFF]" />
              </div>
              {t.history.filters.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="apple-card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8E8E93]" />
                <Input
                  placeholder={t.history.filters.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 apple-input"
                />
              </div>

              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="apple-input">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E5E5EA] dark:border-[#38383A] bg-[#FFFFFF] dark:bg-[#1C1C1E]">
                  <SelectItem value="all">{t.history.filters.allTypes}</SelectItem>
                  <SelectItem value="send">{t.history.filters.sent}</SelectItem>
                  <SelectItem value="receive">{t.history.filters.received}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCrypto} onValueChange={(value: any) => setFilterCrypto(value)}>
                <SelectTrigger className="apple-input">
                  <SelectValue placeholder="Crypto" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E5E5EA] dark:border-[#38383A] bg-[#FFFFFF] dark:bg-[#1C1C1E]">
                  <SelectItem value="all">{t.history.filters.allCryptos}</SelectItem>
                  <SelectItem value="bitcoin">{t.crypto.bitcoin}</SelectItem>
                  <SelectItem value="ethereum">{t.crypto.ethereum}</SelectItem>
                  <SelectItem value="algorand">{t.crypto.algorand}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="apple-input">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E5E5EA] dark:border-[#38383A] bg-[#FFFFFF] dark:bg-[#1C1C1E]">
                  <SelectItem value="all">{t.history.filters.allStatuses}</SelectItem>
                  <SelectItem value="completed">{t.history.filters.completed}</SelectItem>
                  <SelectItem value="pending">{t.history.filters.pending}</SelectItem>
                  <SelectItem value="failed">{t.history.filters.failed}</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="apple-button-outline"
              >
                {t.history.filters.reset}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List Style Apple */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Card className="apple-card">
              <CardContent className="text-center py-12">
                <div className="text-[#8E8E93] mb-4">
                  <Clock className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-[#000000] dark:text-[#FFFFFF] mb-2">
                  {t.history.noTransactions}
                </h3>
                <p className="text-[#8E8E93]">
                  {searchTerm || filterType !== "all" || filterCrypto !== "all" || filterStatus !== "all"
                    ? t.history.noTransactionsFiltered
                    : t.history.noTransactionsDescription}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="apple-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-xl ${
                          transaction.type === "receive" 
                            ? "bg-[#34C759]/10" 
                            : "bg-[#007AFF]/10"
                        }`}
                      >
                        {transaction.type === "receive" ? (
                          <ArrowDownLeft
                            className={`h-6 w-6 ${
                              transaction.type === "receive" ? "text-[#34C759]" : "text-[#007AFF]"
                            }`}
                          />
                        ) : (
                          <ArrowUpRight
                            className={`h-6 w-6 text-[#007AFF]`}
                          />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-lg text-[#000000] dark:text-[#FFFFFF]">
                            {transaction.type === "receive" ? "+" : "-"}
                            {transaction.amount} {getCryptoIcon(transaction.crypto)}
                          </span>
                          <Badge variant="outline" className="text-xs bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/20">
                            {transaction.crypto.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-[#8E8E93]">
                          {getTypeLabel(transaction.type)}: {transaction.address.slice(0, 20)}
                          ...
                        </div>
                        <div className="text-xs text-[#8E8E93]">
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
                      <div className="text-lg font-semibold text-[#000000] dark:text-[#FFFFFF]">
                        {transaction.type === "receive" ? "+" : "-"}${transaction.fiatAmount}
                      </div>
                      <div className="text-xs text-[#8E8E93]">
                        Frais: {transaction.fee} {getCryptoIcon(transaction.crypto)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
