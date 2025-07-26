"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Download, Search, ExternalLink } from "lucide-react"
import type { AppState } from "@/app/page"
// Ajouter les imports
import { BlockchainManager, type BlockchainTransaction } from "@/lib/blockchain-apis"
import { useEffect } from "react"

interface TransactionHistoryProps {
  onNavigate: (page: AppState) => void
}

export function TransactionHistory({ onNavigate }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCrypto, setFilterCrypto] = useState("all")

  // Ajouter un état pour les transactions réelles
  const [blockchainTransactions, setBlockchainTransactions] = useState<BlockchainTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Créer une instance du gestionnaire blockchain
  const blockchainManager = new BlockchainManager()

  // Ajouter une fonction pour charger les transactions réelles
  const loadTransactions = async () => {
    // Récupérer les adresses depuis le localStorage
    const walletData = JSON.parse(localStorage.getItem("wallet") || "{}")
    if (!walletData?.addresses) return

    setIsLoading(true)
    try {
      const transactions = await blockchainManager.getAllTransactions({
        eth: walletData.addresses.ethereum,
        btc: walletData.addresses.bitcoin,
      })

      setBlockchainTransactions(transactions)
    } catch (error) {
      console.error("Erreur lors du chargement des transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les transactions au montage
  useEffect(() => {
    loadTransactions()
  }, [])

  // Utiliser les vraies transactions au lieu des données simulées
  const transactions = blockchainTransactions.map((tx) => {
    const walletData = JSON.parse(localStorage.getItem("wallet") || "{}")
    return {
      id: tx.hash,
      type:
        tx.from.toLowerCase() === walletData?.addresses?.ethereum?.toLowerCase() ||
        tx.from === walletData?.addresses?.bitcoin
          ? "sent"
          : "received",
      crypto: tx.hash.startsWith("0x")
        ? tx.value.includes(".") && Number.parseFloat(tx.value) < 1000
          ? "ETH"
          : "USDT"
        : "BTC",
      amount: tx.type === "sent" ? `-${tx.value}` : `+${tx.value}`,
      value: `$${tx.valueUSD}`,
      from: tx.from,
      to: tx.to,
      hash: tx.hash,
      status: tx.status,
      time: new Date(tx.timestamp).toLocaleString(),
      fee: `${tx.fee} ${tx.hash.startsWith("0x") ? "ETH" : "BTC"}`,
    }
  })

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || tx.type === filterType
    const matchesCrypto = filterCrypto === "all" || tx.crypto === filterCrypto

    return matchesSearch && matchesType && matchesCrypto
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Confirmé
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">En attente</Badge>
      case "failed":
        return <Badge variant="destructive">Échoué</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const openInExplorer = (hash: string) => {
    // Simuler l'ouverture dans un explorateur de blockchain
    alert(`Ouverture de la transaction ${hash} dans l'explorateur`)
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Historique</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par hash ou adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="sent">Envoyé</SelectItem>
                    <SelectItem value="received">Reçu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Crypto</label>
                <Select value={filterCrypto} onValueChange={setFilterCrypto}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ajouter un indicateur de chargement */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Chargement des transactions...</p>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((tx) => (
          <Card key={tx.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Transaction Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "received" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {tx.type === "received" ? (
                        <Download className="h-5 w-5 text-green-600" />
                      ) : (
                        <Send className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {tx.type === "received" ? "Reçu" : "Envoyé"} {tx.crypto}
                      </p>
                      <p className="text-sm text-gray-600">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === "received" ? "text-green-600" : "text-red-600"}`}>
                      {tx.amount} {tx.crypto}
                    </p>
                    <p className="text-sm text-gray-600">{tx.value}</p>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">De:</span>
                    <span className="font-mono">{tx.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">À:</span>
                    <span className="font-mono">{tx.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais:</span>
                    <span>{tx.fee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Statut:</span>
                    {getStatusBadge(tx.status)}
                  </div>
                </div>

                {/* Transaction Hash */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Hash de transaction</p>
                    <p className="font-mono text-sm">{tx.hash}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openInExplorer(tx.hash)}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Aucune transaction trouvée</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
