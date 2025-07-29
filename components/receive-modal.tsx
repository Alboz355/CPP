"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Copy, Share, AlertTriangle } from "lucide-react"
import { notify } from "@/lib/notifications"

interface CryptoAsset {
  symbol: string
  name: string
  balance: string
  balanceUSD: string
  change24h: number
  logo: string
  address: string
  network: string
}

interface ReceiveModalProps {
  crypto: CryptoAsset
  onClose: () => void
}

export function ReceiveModal({ crypto, onClose }: ReceiveModalProps) {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  // Générer un vrai QR code
  useEffect(() => {
    const generateQRCode = () => {
      // Créer l'URL du QR code avec les paramètres
      let qrData = crypto.address

      // Ajouter le montant si spécifié
      if (amount) {
        if (crypto.symbol === "BTC") {
          qrData = `bitcoin:${crypto.address}?amount=${amount}`
        } else if (crypto.symbol === "ETH" || crypto.network === "Ethereum") {
          qrData = `ethereum:${crypto.address}?value=${amount}`
        } else {
          qrData = `${crypto.address}?amount=${amount}`
        }
      }

      // Ajouter le message si spécifié
      if (message) {
        qrData += `${amount ? "&" : "?"}message=${encodeURIComponent(message)}`
      }

      // Utiliser l'API QR Server pour générer un vrai QR code
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&format=png&margin=10`
      setQrCodeUrl(qrUrl)
    }

    generateQRCode()
  }, [crypto.address, crypto.symbol, crypto.network, amount, message])

  const copyAddress = async () => {
    await notify.copyToClipboard(crypto.address, "Adresse copiée !")
  }

  const shareAddress = () => {
    if (navigator.share) {
      navigator.share({
        title: `Mon adresse ${crypto.name}`,
        text: `Voici mon adresse ${crypto.symbol}: ${crypto.address}`,
      })
    } else {
      copyAddress()
    }
  }

  const getNetworkWarning = () => {
    switch (crypto.network) {
      case "Ethereum":
        return "Envoyez uniquement des tokens ERC-20 ou ETH à cette adresse."
      case "Bitcoin":
        return "Envoyez uniquement du Bitcoin (BTC) à cette adresse."
      case "Polygon":
        return "Envoyez uniquement des tokens Polygon ou MATIC à cette adresse."
      case "Algorand":
        return "Envoyez uniquement des tokens Algorand ou ALGO à cette adresse."
      default:
        return `Envoyez uniquement des tokens ${crypto.network} à cette adresse.`
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {crypto.logo}
              </div>
              <div>
                <CardTitle className="text-lg">Recevoir {crypto.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {crypto.network}
                  </Badge>
                  <span className="text-sm text-gray-600">{crypto.symbol}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
              {qrCodeUrl ? (
                <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">Génération du QR code...</span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>Votre adresse {crypto.symbol}</Label>
            <div className="flex space-x-2">
              <Input value={crypto.address} readOnly className="flex-1 font-mono text-sm" />
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
              Copier
            </Button>
            <Button onClick={shareAddress}>
              <Share className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>

          {/* Network Warning */}
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Attention au réseau !</p>
                <p>{getNetworkWarning()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
