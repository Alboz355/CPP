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
import { RealTimePrices } from "@/components/real-time-prices"
import { LoadingFallback } from "@/components/loading-fallback"
import { CryptoList } from "@/components/crypto-list"
import { MtPelerinWidget } from "@/components/mt-pelerin-widget"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import { useWalletStore, useTotalBalance } from "@/lib/wallet-store"

interface MainDashboardProps {
  walletData: any
  onNavigate: (page: AppState) => void
}

export function MainDashboard({ walletData, onNavigate }: MainDashboardProps) {
  const [showMtPelerin, setShowMtPelerin] = useState(false)
  const [mtPelerinAction, setMtPelerinAction] = useState<"buy" | "sell" | "swap">("buy")

  // Use Zustand store for state management
  const {
    blockchainBalances,
    isLoadingBalances,
    lastBalanceUpdate,
    showBalance,
    setShowBalance,
    loadBlockchainData,
    refreshBalances,
  } = useWalletStore()

  // Use computed total balance from store
  const totalBalance = useTotalBalance()

  // Load blockchain data on component mount
  useEffect(() => {
    loadBlockchainData()
    const interval = setInterval(refreshBalances, 30000)
    return () => clearInterval(interval)
  }, [loadBlockchainData, refreshBalances])

  const recentTransactions = [
    { type: "received", crypto: "ETH", amount: "+0.5", value: "$987.50", time: "2h ago" },
    { type: "sent", crypto: "BTC", amount: "-0.01", value: "$430.00", time: "1d ago" },
    { type: "received", crypto: "USDT", amount: "+100", value: "$100.00", time: "3d ago" },
  ]

  const copyAddress = (address: string, symbol: string) => {
    navigator.clipboard.writeText(address)
    toast.success(`Adresse ${symbol} copiée !`)
  }

  // Ouvrir Mt Pelerin avec une action spécifique
  const openMtPelerin = (action: "buy" | "sell" | "swap") => {
    setMtPelerinAction(action)
    setShowMtPelerin(true)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        {/* Header moderne avec safe area */}
        <div className="mobile-header">
          <div className="flex items-center justify-between p-4">
            <div className="fade-in">
              <h1 className="heading-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Bonjour !
              </h1>
              <p className="caption-text">{walletData.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onNavigate("settings")}
                className="h-10 w-10 rounded-xl hover:bg-accent/50"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        {/* Contenu principal */}
        <div className="mobile-content p-4 space-y-6">
          {/* Balance Card moderne */}
          <div className="modern-card p-6 slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-3">Solde total</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowBalance(!showBalance)}
                className="h-8 w-8 rounded-lg hover:bg-accent/50"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {isLoadingBalances ? (
              <div className="space-y-3">
                <div className="h-8 bg-muted/50 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-muted/30 rounded-lg animate-pulse w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {showBalance ? `$${totalBalance.toLocaleString()}` : "••••••"}
                </div>
                {lastBalanceUpdate && (
                  <div className="caption-text">
                    Dernière mise à jour: {lastBalanceUpdate.toLocaleTimeString()}
                  </div>
                )}
                <div className="flex items-center space-x-2 text-green-500">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+12.5% (24h)</span>
                </div>
              </div>
            )}
          </div>

          {/* Wallet Addresses avec design moderne */}
          <div className="modern-card p-6 fade-in">
            <h3 className="heading-3 mb-4">Adresses du portefeuille</h3>
            <div className="space-y-4">
            {/* Ethereum */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Ethereum (EIP-55)</p>
                <p className="font-mono text-xs break-all text-muted-foreground truncate">
                  {walletData.addresses?.ethereum || "Non disponible"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyAddress(walletData.addresses?.ethereum || "", "ETH")}
                className="ml-2 h-8 w-8 rounded-lg hover:bg-accent"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Bitcoin */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Bitcoin (P2PKH Legacy)</p>
                <p className="font-mono text-xs break-all text-muted-foreground truncate">
                  {walletData.addresses?.bitcoin || "Non disponible"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyAddress(walletData.addresses?.bitcoin || "", "BTC")}
                className="ml-2 h-8 w-8 rounded-lg hover:bg-accent"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Algorand */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Algorand (Base32)</p>
                <p className="font-mono text-xs break-all text-muted-foreground truncate">
                  {walletData.addresses?.algorand || "Non disponible"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyAddress(walletData.addresses?.algorand || "", "ALGO")}
                className="ml-2 h-8 w-8 rounded-lg hover:bg-accent"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            </div>
          </div>

          {/* Quick Actions avec design iOS moderne */}
          <div className="grid grid-cols-2 gap-4 fade-in">
            <button 
              onClick={() => onNavigate("send")} 
              className="ios-button-primary h-20 flex-col space-y-2 hover-lift"
            >
              <Send className="h-6 w-6" />
              <span className="text-sm font-medium">Envoyer</span>
            </button>
            <button 
              onClick={() => onNavigate("receive")} 
              className="ios-button-secondary h-20 flex-col space-y-2 hover-lift"
            >
              <Download className="h-6 w-6" />
              <span className="text-sm font-medium">Recevoir</span>
            </button>
            <button
              onClick={() => openMtPelerin("buy")}
              className="ios-button-secondary h-20 flex-col space-y-2 hover-lift bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:from-blue-500/20 hover:to-purple-500/20"
            >
              <ShoppingCart className="h-6 w-6 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Mt Pelerin</span>
            </button>
            <button
              onClick={() => onNavigate("tpe")}
              className="ios-button-secondary h-20 flex-col space-y-2 hover-lift bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 hover:from-green-500/20 hover:to-emerald-500/20"
            >
              <CreditCard className="h-6 w-6 text-green-500" />
              <span className="text-sm font-medium text-green-500">Mode TPE</span>
            </button>
          </div>

          {/* Crypto Holdings */}
          <div className="fade-in">
            <CryptoList walletData={walletData} onSend={(crypto) => onNavigate("send")} />
          </div>

          {/* Prix du marché */}
          <div className="fade-in">
            <RealTimePrices />
          </div>

          {/* Recent Transactions avec design moderne */}
          <div className="modern-card p-6 fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="heading-3">Transactions récentes</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate("history")}
                className="rounded-lg hover:bg-accent/50"
              >
                Voir tout
              </Button>
            </div>
            <div className="space-y-3">
            {recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === "received" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {tx.type === "received" ? (
                      <Download className="h-5 w-5" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {tx.type === "received" ? "Reçu" : "Envoyé"} {tx.crypto}
                    </p>
                    <p className="caption-text">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    tx.type === "received" ? "text-green-500" : "text-red-500"
                  }`}>
                    {tx.amount} {tx.crypto}
                  </p>
                  <p className="caption-text">{tx.value}</p>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation moderne */}
        <div className="mobile-bottom-nav">
          <div className="flex justify-around p-4 max-w-md mx-auto">
            <Button variant="ghost" size="sm" className="flex-col space-y-1 h-16 w-16 rounded-xl hover:bg-accent/50">
              <Wallet className="h-5 w-5" />
              <span className="text-xs font-medium">Portefeuille</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col space-y-1 h-16 w-16 rounded-xl hover:bg-accent/50" 
              onClick={() => onNavigate("history")}
            >
              <History className="h-5 w-5" />
              <span className="text-xs font-medium">Historique</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col space-y-1 h-16 w-16 rounded-xl hover:bg-accent/50" 
              onClick={() => openMtPelerin("buy")}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-xs font-medium">Acheter</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col space-y-1 h-16 w-16 rounded-xl hover:bg-accent/50" 
              onClick={() => onNavigate("tpe")}
            >
              <CreditCard className="h-5 w-5" />
              <span className="text-xs font-medium">TPE</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col space-y-1 h-16 w-16 rounded-xl hover:bg-accent/50" 
              onClick={() => onNavigate("settings")}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Paramètres</span>
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
