"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Wallet,
  Send,
  Download,
  History,
  Settings,
  Eye,
  EyeOff,
  TrendingUp,
  Copy,
  ShoppingCart,
  CreditCard,
} from "lucide-react"
import { useState, useEffect } from "react"
import type { AppState } from "@/app/page"
import { BlockchainManager, type BlockchainBalance } from "@/lib/blockchain-apis"
import { RealTimePrices } from "@/components/real-time-prices"
import { LoadingFallback } from "@/components/loading-fallback"
import { CryptoList } from "@/components/crypto-list"
import { MtPelerinWidget } from "@/components/mt-pelerin-widget"

interface MainDashboardProps {
  walletData: any
  onNavigate: (page: AppState) => void
}

export function MainDashboard({ walletData, onNavigate }: MainDashboardProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [showMtPelerin, setShowMtPelerin] = useState(false)
  const [mtPelerinAction, setMtPelerinAction] = useState<"buy" | "sell" | "swap">("buy")

  // États pour les données blockchain
  const [blockchainBalances, setBlockchainBalances] = useState<BlockchainBalance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const blockchainManager = new BlockchainManager()

  // Charger les données blockchain
  const loadBlockchainData = async () => {
    if (!walletData?.addresses) {
      console.log("Pas d'adresses de portefeuille disponibles")
      return
    }

    console.log("Chargement des données blockchain...")
    console.log("Adresses:", walletData.addresses)
    setIsLoading(true)

    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))

      const balancesPromise = blockchainManager.getAllBalances({
        eth: walletData.addresses.ethereum,
        btc: walletData.addresses.bitcoin,
      })

      const balances = (await Promise.race([balancesPromise, timeoutPromise])) as BlockchainBalance[]

      console.log("Soldes chargés:", balances)
      setBlockchainBalances(balances)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Erreur lors du chargement des données blockchain:", error)

      if (blockchainBalances.length === 0) {
        const defaultBalances: BlockchainBalance[] = [
          { symbol: "ETH", balance: "0.000000", balanceUSD: "0.00", address: walletData.addresses.ethereum },
          { symbol: "BTC", balance: "0.00000000", balanceUSD: "0.00", address: walletData.addresses.bitcoin },
          { symbol: "USDT", balance: "0.00", balanceUSD: "0.00", address: walletData.addresses.ethereum },
        ]
        setBlockchainBalances(defaultBalances)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBlockchainData()
    const interval = setInterval(loadBlockchainData, 30000)
    return () => clearInterval(interval)
  }, [walletData])

  // Calculer le solde total
  const totalBalance = blockchainBalances.reduce((sum, balance) => {
    return sum + Number.parseFloat(balance.balanceUSD || "0")
  }, 0)

  const recentTransactions = [
    { type: "received", crypto: "ETH", amount: "+0.5", value: "$987.50", time: "2h ago" },
    { type: "sent", crypto: "BTC", amount: "-0.01", value: "$430.00", time: "1d ago" },
    { type: "received", crypto: "USDT", amount: "+100", value: "$100.00", time: "3d ago" },
  ]

  const copyAddress = (address: string, symbol: string) => {
    navigator.clipboard.writeText(address)
    alert(`Adresse ${symbol} copiée !`)
  }

  // Ouvrir Mt Pelerin avec une action spécifique
  const openMtPelerin = (action: "buy" | "sell" | "swap") => {
    setMtPelerinAction(action)
    setShowMtPelerin(true)
  }

  return (
    <>
      <div className="min-h-screen p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bonjour !</h1>
            <p className="text-gray-600">{walletData.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onNavigate("settings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Solde total</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingFallback message="Chargement des soldes..." />
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {showBalance ? `$${totalBalance.toLocaleString()}` : "••••••"}
                </div>
                {lastUpdate && (
                  <div className="text-xs text-gray-400">Dernière mise à jour: {lastUpdate.toLocaleTimeString()}</div>
                )}
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 text-sm font-medium">+12.5% (24h)</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Wallet Addresses SANS clés publiques */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Adresses du portefeuille</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Ethereum */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Ethereum (EIP-55)</p>
                <p className="font-mono text-sm break-all text-gray-900">
                  {walletData.addresses?.ethereum || "Non disponible"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyAddress(walletData.addresses?.ethereum || "", "ETH")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Bitcoin */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Bitcoin (P2PKH Legacy)</p>
                <p className="font-mono text-sm break-all text-gray-900">
                  {walletData.addresses?.bitcoin || "Non disponible"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyAddress(walletData.addresses?.bitcoin || "", "BTC")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Algorand */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Algorand (Base32)</p>
                <p className="font-mono text-sm break-all text-gray-900">
                  {walletData.addresses?.algorand || "Non disponible"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyAddress(walletData.addresses?.algorand || "", "ALGO")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          <Button onClick={() => onNavigate("send")} className="h-16 flex-col space-y-2">
            <Send className="h-6 w-6" />
            <span>Envoyer</span>
          </Button>
          <Button onClick={() => onNavigate("receive")} variant="outline" className="h-16 flex-col space-y-2">
            <Download className="h-6 w-6" />
            <span>Recevoir</span>
          </Button>
          <Button
            onClick={() => openMtPelerin("buy")}
            variant="outline"
            className="h-16 flex-col space-y-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
          >
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            <span className="text-blue-600 font-medium">Mt Pelerin</span>
          </Button>
          <Button
            onClick={() => onNavigate("tpe")}
            variant="outline"
            className="h-16 flex-col space-y-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100"
          >
            <CreditCard className="h-6 w-6 text-green-600" />
            <span className="text-green-600 font-medium">Mode TPE</span>
          </Button>
        </div>

        {/* Crypto Holdings */}
        <CryptoList walletData={walletData} onSend={(crypto) => onNavigate("send")} />

        {/* Prix du marché */}
        <RealTimePrices />

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Transactions récentes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("history")}>
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === "received" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {tx.type === "received" ? (
                      <Download className="h-4 w-4 text-green-600" />
                    ) : (
                      <Send className="h-4 w-4 text-red-600" />
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
                  <p className={`font-medium ${tx.type === "received" ? "text-green-600" : "text-red-600"}`}>
                    {tx.amount} {tx.crypto}
                  </p>
                  <p className="text-sm text-gray-600">{tx.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex justify-around max-w-md mx-auto">
            <Button variant="ghost" size="sm" className="flex-col space-y-1">
              <Wallet className="h-5 w-5" />
              <span className="text-xs">Portefeuille</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col space-y-1" onClick={() => onNavigate("history")}>
              <History className="h-5 w-5" />
              <span className="text-xs">Historique</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col space-y-1" onClick={() => openMtPelerin("buy")}>
              <ShoppingCart className="h-5 w-5" />
              <span className="text-xs">Acheter</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col space-y-1" onClick={() => onNavigate("tpe")}>
              <CreditCard className="h-5 w-5" />
              <span className="text-xs">TPE</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col space-y-1" onClick={() => onNavigate("settings")}>
              <Settings className="h-5 w-5" />
              <span className="text-xs">Paramètres</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mt Pelerin Widget Modal */}
      <MtPelerinWidget
        isOpen={showMtPelerin}
        onClose={() => setShowMtPelerin(false)}
        walletData={walletData}
        defaultAction={mtPelerinAction}
      />
    </>
  )
}
