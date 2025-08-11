"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Copy, Download, Share2, QrCode } from 'lucide-react'
import { formatBalance } from "@/lib/wallet-utils"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { AppState } from "@/app/page"
import { generateQrDataUrl } from "@/lib/qr"

interface ReceivePageProps {
  onNavigate: (page: AppState) => void
  walletData: any
}

export function ReceivePage({ onNavigate, walletData }: ReceivePageProps) {
  const { t } = useLanguage()
  const [selectedCrypto, setSelectedCrypto] = useState<"bitcoin" | "ethereum" | "algorand" | "solana" | "usdc">("bitcoin")
  const [amount, setAmount] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const { toast } = useToast()

  // Configuration des cryptos supportées avec USDC complet
  const cryptoInfo = {
    bitcoin: {
      name: "Bitcoin",
      symbol: "BTC",
      color: "bg-orange-500",
      icon: "₿",
      address: walletData?.addresses?.bitcoin || "Adresse Bitcoin non disponible",
      network: "Bitcoin"
    },
    ethereum: {
      name: "Ethereum",
      symbol: "ETH",
      color: "bg-blue-500",
      icon: "Ξ",
      address: walletData?.addresses?.ethereum || "Adresse Ethereum non disponible",
      network: "Ethereum"
    },
    algorand: {
      name: "Algorand",
      symbol: "ALGO",
      color: "bg-black",
      icon: "Ⱥ",
      address: walletData?.addresses?.algorand || "Adresse Algorand non disponible",
      network: "Algorand"
    },
    solana: {
      name: "Solana",
      symbol: "SOL",
      color: "bg-purple-600",
      icon: "◎",
      address: walletData?.addresses?.solana || "Adresse Solana non disponible",
      network: "Solana"
    },
    usdc: {
      name: "USD Coin",
      symbol: "USDC",
      color: "bg-green-600",
      icon: "$",
      address: walletData?.addresses?.ethereum || "Adresse USDC (ERC-20) non disponible", // USDC sur Ethereum
      network: "Ethereum (ERC-20)"
    },
  }

  useEffect(() => {
    generateQRCode()
  }, [selectedCrypto, amount])

  const generateQRCode = () => {
    const crypto = cryptoInfo[selectedCrypto]
    let qrData = crypto.address

    // Créer une URI standard pour chaque crypto avec montant optionnel
    if (amount && Number.parseFloat(amount) > 0) {
      switch (selectedCrypto) {
        case "bitcoin":
          qrData = `bitcoin:${crypto.address}?amount=${amount}&label=CryptoPay%20Pro`
          break
        case "ethereum":
          qrData = `ethereum:${crypto.address}?value=${amount}&label=CryptoPay%20Pro`
          break
        case "algorand":
          qrData = `algorand://${crypto.address}?amount=${amount}&label=CryptoPay%20Pro`
          break
        case "solana":
          qrData = `solana:${crypto.address}?amount=${amount}&label=CryptoPay%20Pro`
          break
        case "usdc":
          // USDC comme token ERC-20 sur Ethereum
          qrData = `ethereum:${crypto.address}?value=${amount}&label=CryptoPay%20Pro%20USDC`
          break
      }
    }

    // Génération locale (data URL)
    generateQrDataUrl(qrData, 300).then(setQrCodeUrl)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copié !",
        description: `${label} copié dans le presse-papiers`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier dans le presse-papiers",
        variant: "destructive",
      })
    }
  }

  const downloadQRCode = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qr-${selectedCrypto}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "QR Code téléchargé",
      description: "Le QR code a été sauvegardé dans vos téléchargements",
    })
  }

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Adresse ${cryptoInfo[selectedCrypto].name}`,
          text: `Mon adresse ${cryptoInfo[selectedCrypto].name}: ${cryptoInfo[selectedCrypto].address}`,
          url: qrCodeUrl,
        })
      } catch (error) {
        console.log("Partage annulé")
      }
    } else {
      copyToClipboard(cryptoInfo[selectedCrypto].address, "Adresse")
    }
  }

  const currentCrypto = cryptoInfo[selectedCrypto]

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] ios-content-safe">
      <div className="max-w-md mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA] dark:border-[#38383A]">
          <button
            onClick={() => onNavigate("dashboard")}
            className="btn-icon"
            aria-label="Retour au tableau de bord"
          >
            <ArrowLeft className="h-5 w-5 text-[#007AFF]" />
          </button>
          <h1 className="text-xl font-semibold text-[#000000] dark:text-[#FFFFFF]">Recevoir des Cryptos</h1>
          <div className="w-11" />
        </div>

        {/* Sélecteur de Crypto amélioré */}
        <Card className="apple-card">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title">Choisir la Cryptomonnaie</CardTitle>
          </CardHeader>
          <CardContent className="apple-card-content">
            <Select value={selectedCrypto} onValueChange={(value) => setSelectedCrypto(value as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une cryptomonnaie" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(cryptoInfo).map(([key, crypto]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${crypto.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{crypto.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{crypto.name}</span>
                        <span className="text-sm text-[#8E8E93]">{crypto.symbol} - {crypto.network}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Crypto Info sélectionnée */}
        <Card className="apple-card">
          <CardHeader className="text-center apple-card-header">
            <div className={`w-20 h-20 ${currentCrypto.color} rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-2xl">{currentCrypto.icon}</span>
            </div>
            <CardTitle className="apple-card-title">{currentCrypto.name}</CardTitle>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="font-medium">{currentCrypto.symbol}</Badge>
              <Badge variant="outline" className="text-xs">{currentCrypto.network}</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Montant optionnel */}
        <Card className="apple-card">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title">Montant (Optionnel)</CardTitle>
          </CardHeader>
          <CardContent className="apple-card-content">
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-sm font-medium">
                Montant en {currentCrypto.symbol}
              </Label>
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder={`ex: 0.1 ${currentCrypto.symbol}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-center text-lg font-medium"
              />
              <p className="text-xs text-[#8E8E93] text-center">
                Le montant sera inclus dans le QR code pour faciliter le paiement
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="apple-card">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5 text-[#007AFF]" />
              QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center apple-card-content space-y-4">
            <div className="bg-white p-6 rounded-2xl inline-block shadow-inner">
              <img
                src={qrCodeUrl || "/placeholder.svg"}
                alt={`QR Code pour ${currentCrypto.name}`}
                className="w-64 h-64 mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=256&width=256&text=QR+Code`
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                className="btn-secondary"
                onClick={downloadQRCode}
              >
                <Download className="h-4 w-4" />
                <span>Télécharger</span>
              </button>
              <button
                className="btn-secondary"
                onClick={shareQRCode}
              >
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Adresse */}
        <Card className="apple-card">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title">Adresse de Réception</CardTitle>
          </CardHeader>
          <CardContent className="apple-card-content">
            <div className="space-y-4">
              <div className="p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl break-all text-sm font-mono text-[#000000] dark:text-[#FFFFFF] border">
                {currentCrypto.address}
              </div>
              <button
                className="btn-primary w-full"
                onClick={() => copyToClipboard(currentCrypto.address, "Adresse")}
              >
                <Copy className="h-4 w-4" />
                <span>Copier l'Adresse</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Avertissement de sécurité */}
        <Card className="border-[#FF9500] bg-[#FF9500]/10 dark:bg-[#FF9500]/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#FF9500] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#FF9500] mb-1">Important</h4>
                <p className="text-sm text-[#8E8E93]">
                  Envoyez uniquement du <strong>{currentCrypto.name} ({currentCrypto.symbol})</strong> sur le réseau <strong>{currentCrypto.network}</strong> à cette adresse. 
                  L'envoi d'autres cryptomonnaies ou d'un mauvais réseau entraînera une perte définitive de vos fonds.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
