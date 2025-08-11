"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, Download, Share2, QrCode } from 'lucide-react'
import { generateCryptoAddress, formatBalance, formatCryptoAmount } from "@/lib/wallet-utils"
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
  const [selectedCrypto, setSelectedCrypto] = useState<"bitcoin" | "ethereum" | "algorand" | "solana" | "usdc_spl">("bitcoin")
  const [amount, setAmount] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const { toast } = useToast()
  const [usdcMint, setUsdcMint] = useState("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

  const cryptoInfo = {
    bitcoin: {
      name: t.crypto.bitcoin,
      symbol: "BTC",
      color: "bg-orange-500",
      address: walletData?.addresses?.bitcoin || generateCryptoAddress("bitcoin"),
    },
    ethereum: {
      name: t.crypto.ethereum,
      symbol: "ETH",
      color: "bg-blue-500",
      address: walletData?.addresses?.ethereum || generateCryptoAddress("ethereum"),
    },
    algorand: {
      name: t.crypto.algorand,
      symbol: "ALGO",
      color: "bg-black",
      address: walletData?.addresses?.algorand || generateCryptoAddress("algorand"),
    },
    solana: {
      name: t.crypto.solana,
      symbol: "SOL",
      color: "bg-purple-600",
      address: (walletData as any)?.addresses?.solana || generateCryptoAddress("solana"),
    },
    usdc_spl: {
      name: "USDC (Solana)",
      symbol: "USDC",
      color: "bg-green-600",
      address: (walletData as any)?.addresses?.solana || generateCryptoAddress("solana"),
    },
  }

  useEffect(() => {
    generateQRCode()
  }, [selectedCrypto, amount, usdcMint])

  const generateQRCode = () => {
    const crypto = (cryptoInfo as any)[selectedCrypto]
    let qrData = crypto.address

    // Créer une URI standard pour chaque crypto avec montant optionnel
    if (amount && Number.parseFloat(amount) > 0) {
      switch (selectedCrypto) {
        case "bitcoin":
          qrData = `bitcoin:${crypto.address}?amount=${amount}`
          break
        case "ethereum":
          qrData = `ethereum:${crypto.address}?value=${Number.parseFloat(amount) * 1e18}` // Wei
          break
        case "algorand":
          qrData = `algorand:${crypto.address}?amount=${Number.parseFloat(amount) * 1e6}` // microAlgos
          break
        case "solana":
          // Solana Pay URI pour SOL
          qrData = `solana:${crypto.address}?amount=${amount}&label=CryptoPay%20Pro`
          break
        case "usdc_spl":
          // Solana Pay URI pour USDC SPL (6 décimales)
          qrData = `solana:${crypto.address}?amount=${amount}&spl-token=${usdcMint}&label=CryptoPay%20Pro`
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
        title: t.messages.copied,
        description: `${label} ${t.messages.copiedToClipboard}`,
      })
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.messages.cannotCopy,
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
      description: "Le QR code a été sauvegardé",
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA] dark:border-[#38383A]">
          <button
            onClick={() => onNavigate("dashboard")}
            className="btn-icon"
            aria-label="Retour au tableau de bord"
          >
            <ArrowLeft className="h-5 w-5 text-[#007AFF]" />
          </button>
          <h1 className="text-xl font-semibold text-[#000000] dark:text-[#FFFFFF]">{t.receive.title}</h1>
          <div className="w-11" />
        </div>

        {/* Crypto Selection */}
        <Tabs value={selectedCrypto} onValueChange={(value) => setSelectedCrypto(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bitcoin">BTC</TabsTrigger>
            <TabsTrigger value="ethereum">ETH</TabsTrigger>
            <TabsTrigger value="algorand">ALGO</TabsTrigger>
            <TabsTrigger value="solana">SOL</TabsTrigger>
            <TabsTrigger value="usdc_spl">USDC</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCrypto} className="space-y-6">
            {/* Crypto Info */}
            <Card>
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 ${currentCrypto.color} rounded-full mx-auto mb-2 flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-xl">{currentCrypto.symbol.charAt(0)}</span>
                </div>
                <CardTitle>{currentCrypto.name}</CardTitle>
                <Badge variant="secondary">{currentCrypto.symbol}</Badge>
              </CardHeader>
            </Card>

            {selectedCrypto === 'usdc_spl' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mint USDC</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="mint">Adresse mint (mainnet)</Label>
                    <Input id="mint" value={usdcMint} onChange={(e) => setUsdcMint(e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amount Input (Optional) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.receive.amountOptional}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="amount">{t.receive.amount} en {currentCrypto.symbol}</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="any"
                    placeholder={`${t.receive.amountPlaceholder} ${currentCrypto.symbol}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">{t.receive.amountDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <QrCode className="mr-2 h-5 w-5" />
                  {t.receive.qrCode}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img
                    src={qrCodeUrl || "/placeholder.svg"}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=256&width=256&text=QR+Code`
                    }}
                  />
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    className="btn-secondary flex-1"
                    onClick={downloadQRCode}
                  >
                    <Download className="h-4 w-4" />
                    <span>{t.common.download}</span>
                  </button>
                  <button
                    className="btn-secondary flex-1"
                    onClick={shareQRCode}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>{t.common.share}</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="apple-card">
              <CardHeader className="apple-card-header">
                <CardTitle className="apple-card-title">{t.receive.receiveAddress}</CardTitle>
              </CardHeader>
              <CardContent className="apple-card-content">
                <div className="space-y-4">
                  <div className="p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl break-all text-sm font-mono text-[#000000] dark:text-[#FFFFFF]">
                    {currentCrypto.address}
                  </div>
                  <button
                    className="btn-primary w-full"
                    onClick={() => copyToClipboard(currentCrypto.address, "Adresse")}
                  >
                    <Copy className="h-4 w-4" />
                    <span>{t.receive.copyAddress}</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
              <CardContent className="pt-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {t.receive.warning} Envoyez uniquement du {currentCrypto.name} ({currentCrypto.symbol}) à cette adresse. L'envoi
                  d'autres cryptomonnaies pourrait entraîner une perte définitive.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
