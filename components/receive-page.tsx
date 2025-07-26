"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Copy, Share } from "lucide-react"
import type { AppState } from "@/app/page"

interface ReceivePageProps {
  walletData: any
  onNavigate: (page: AppState) => void
}

export function ReceivePage({ walletData, onNavigate }: ReceivePageProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("ETH")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")

  const cryptos = [
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "USDT", name: "Tether" },
  ]

  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.address)
    alert("Adresse copiée !")
  }

  const shareAddress = () => {
    if (navigator.share) {
      navigator.share({
        title: "Mon adresse de portefeuille",
        text: `Voici mon adresse ${selectedCrypto}: ${walletData.address}`,
      })
    }
  }

  // Générer un QR code simple (placeholder)
  const qrCodeUrl = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(walletData.address)}`

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Recevoir</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recevoir des cryptomonnaies</CardTitle>
          <CardDescription>Partagez votre adresse pour recevoir des paiements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Crypto Selection */}
          <div className="space-y-2">
            <Label>Cryptomonnaie</Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    {crypto.name} ({crypto.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>Votre adresse {selectedCrypto}</Label>
            <div className="flex space-x-2">
              <Input value={walletData.address} readOnly className="flex-1 font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={shareAddress}>
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Optional Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (optionnel)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-sm text-gray-600">Spécifiez un montant pour faciliter le paiement</p>
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (optionnel)</Label>
            <Input
              id="message"
              placeholder="Pour quoi est ce paiement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={copyAddress}>
              <Copy className="h-4 w-4 mr-2" />
              Copier l'adresse
            </Button>
            <Button onClick={shareAddress}>
              <Share className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-sm text-blue-800">
              <p className="font-medium">Information importante :</p>
              <p className="mt-1">
                Envoyez uniquement des {selectedCrypto} à cette adresse. L'envoi d'autres cryptomonnaies pourrait
                entraîner une perte permanente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
