"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, Download, Share2, QrCode } from 'lucide-react'
import { generateCryptoAddress } from "@/lib/wallet-utils"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { AppState } from "@/app/page"

interface ReceivePageProps {
  onNavigate: (page: AppState) => void
  walletData: any
}

export function ReceivePage({ onNavigate, walletData }: ReceivePageProps) {
  const { t } = useLanguage()
  const [selectedCrypto, setSelectedCrypto] = useState<"bitcoin" | "ethereum" | "algorand">("bitcoin")
  const [amount, setAmount] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const { toast } = useToast()

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
          qrData = `bitcoin:${crypto.address}?amount=${amount}`
          break
        case "ethereum":
          qrData = `ethereum:${crypto.address}?value=${Number.parseFloat(amount) * 1e18}` // Wei
          break
        case "algorand":
          qrData = `algorand:${crypto.address}?amount=${Number.parseFloat(amount) * 1e6}` // microAlgos
          break
      }
    }

    // Utiliser l'API QR Server pour générer un vrai QR code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`
    setQrCodeUrl(qrUrl)
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
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{t.receive.title}</h1>
          <div className="w-10" />
        </div>

        {/* Crypto Selection */}
        <Tabs value={selectedCrypto} onValueChange={(value) => setSelectedCrypto(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bitcoin">BTC</TabsTrigger>
            <TabsTrigger value="ethereum">ETH</TabsTrigger>
            <TabsTrigger value="algorand">ALGO</TabsTrigger>
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

                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={downloadQRCode}>
                    <Download className="mr-2 h-4 w-4" />
                    {t.common.download}
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareQRCode}>
                    <Share2 className="mr-2 h-4 w-4" />
                    {t.common.share}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.receive.receiveAddress}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg break-all text-sm font-mono">{currentCrypto.address}</div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => copyToClipboard(currentCrypto.address, "Adresse")}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {t.receive.copyAddress}
                  </Button>
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
