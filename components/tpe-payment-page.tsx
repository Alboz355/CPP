"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Zap,
  Bitcoin,
  Smartphone,
  QrCode,
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  RefreshCw,
} from "lucide-react"
import type { AppState } from "@/app/page"

interface PaymentRequest {
  id: string
  amount: number
  currency: string
  description: string
  customerEmail?: string
  vatEnabled: boolean
  vatRate: number
  vatAmount: number
  netAmount: number
  cryptoOptions: {
    BTC: { amount: string; address: string; qr: string }
    ETH: { amount: string; address: string; qr: string }
    USDT: { amount: string; address: string; qr: string }
    lightning: { invoice: string; qr: string }
  }
  status: "pending" | "paid" | "expired"
  expiresAt: Date
}

interface TPEPaymentPageProps {
  onNavigate: (page: AppState) => void
  paymentRequest: PaymentRequest
  walletData: any
}

export function TPEPaymentPage({ onNavigate, paymentRequest, walletData }: TPEPaymentPageProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"BTC" | "ETH" | "USDT" | "lightning">("lightning")
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [paymentStatus, setPaymentStatus] = useState<"waiting" | "confirming" | "confirmed" | "expired">("waiting")

  // Calculer le temps restant
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const expires = paymentRequest.expiresAt.getTime()
      const remaining = Math.max(0, expires - now)

      setTimeRemaining(remaining)

      if (remaining === 0) {
        setPaymentStatus("expired")
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [paymentRequest.expiresAt])

  // Simuler la détection de paiement
  useEffect(() => {
    if (paymentStatus === "waiting") {
      // Simuler un paiement après 10 secondes pour la démo
      const timer = setTimeout(() => {
        setPaymentStatus("confirming")

        setTimeout(() => {
          setPaymentStatus("confirmed")
          handlePaymentConfirmed()
        }, 3000)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [paymentStatus])

  const handlePaymentConfirmed = () => {
    // Sauvegarder la transaction
    const transaction = {
      id: paymentRequest.id,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      netAmount: paymentRequest.netAmount,
      vatAmount: paymentRequest.vatAmount,
      vatRate: paymentRequest.vatRate,
      vatEnabled: paymentRequest.vatEnabled,
      description: paymentRequest.description,
      customerEmail: paymentRequest.customerEmail,
      paymentMethod: selectedPaymentMethod,
      cryptoAmount: paymentRequest.cryptoOptions[selectedPaymentMethod].amount,
      status: "completed",
      timestamp: new Date().toISOString(),
      type: "payment",
    }

    // Sauvegarder dans l'historique TPE
    const existingTransactions = JSON.parse(localStorage.getItem("tpe-transactions") || "[]")
    existingTransactions.unshift(transaction)
    localStorage.setItem("tpe-transactions", JSON.stringify(existingTransactions))

    // Si TVA activée, traiter le transfert automatique
    if (paymentRequest.vatEnabled && paymentRequest.vatAmount > 0) {
      handleVATTransfer(transaction)
    }

    // Mettre à jour les stats du jour
    const todayStats = JSON.parse(
      localStorage.getItem("tpe-today-stats") || '{"transactions": 0, "volume": "0.00", "converted": "0.00"}',
    )
    todayStats.transactions += 1
    todayStats.volume = (Number.parseFloat(todayStats.volume) + paymentRequest.amount).toFixed(2)
    localStorage.setItem("tpe-today-stats", JSON.stringify(todayStats))

    // Retourner au menu principal après 3 secondes
    setTimeout(() => {
      onNavigate("tpe")
    }, 3000)
  }

  const handleVATTransfer = (transaction: any) => {
    // Simuler le transfert automatique de TVA vers le compte USDC Polygon
    const vatTransfer = {
      id: `vat-${transaction.id}`,
      originalTransactionId: transaction.id,
      amount: transaction.vatAmount,
      currency: "USDC",
      network: "Polygon",
      toAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C", // Adresse TVA
      status: "completed",
      timestamp: new Date().toISOString(),
      type: "vat_transfer",
    }

    // Sauvegarder le transfert TVA
    const existingVATTransfers = JSON.parse(localStorage.getItem("tpe-vat-transfers") || "[]")
    existingVATTransfers.unshift(vatTransfer)
    localStorage.setItem("tpe-vat-transfers", JSON.stringify(existingVATTransfers))

    console.log("Transfert TVA automatique effectué:", vatTransfer)
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    alert(`${label} copié dans le presse-papiers !`)
  }

  const refreshPayment = () => {
    // Simuler un rafraîchissement
    setPaymentStatus("waiting")
  }

  if (paymentStatus === "confirmed") {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-green-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-800 mb-2">Paiement confirmé !</h2>
            <p className="text-gray-600 mb-4">
              {paymentRequest.amount} {paymentRequest.currency} reçu avec succès
            </p>

            {/* Détails du paiement */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Montant brut:</span>
                  <span className="font-medium">
                    {paymentRequest.amount} {paymentRequest.currency}
                  </span>
                </div>
                {paymentRequest.vatEnabled && (
                  <>
                    <div className="flex justify-between">
                      <span>TVA ({paymentRequest.vatRate}%):</span>
                      <span className="font-medium">
                        {paymentRequest.vatAmount.toFixed(2)} {paymentRequest.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Montant net:</span>
                      <span className="font-medium">
                        {paymentRequest.netAmount.toFixed(2)} {paymentRequest.currency}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span>Méthode:</span>
                  <span className="font-medium">
                    {selectedPaymentMethod === "lightning" ? "Lightning Network" : selectedPaymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {paymentRequest.vatEnabled && (
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800">✅ TVA transférée automatiquement vers le compte USDC Polygon</p>
              </div>
            )}

            <Button onClick={() => onNavigate("tpe")} className="w-full">
              Retour au menu TPE
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === "expired") {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-red-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Paiement expiré</h2>
            <p className="text-gray-600 mb-4">La demande de paiement a expiré. Veuillez créer une nouvelle facture.</p>
            <Button onClick={() => onNavigate("tpe-billing")} className="w-full">
              Nouvelle facture
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("tpe-billing")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Paiement en cours</h1>
            <p className="text-gray-600">En attente du paiement client</p>
          </div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{formatTime(timeRemaining)}</div>
          <p className="text-xs text-gray-600">Temps restant</p>
        </div>
      </div>

      {/* Statut du paiement */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {paymentStatus === "waiting" && (
              <>
                <Clock className="h-6 w-6 text-orange-600 animate-pulse" />
                <span className="text-lg font-medium">En attente du paiement...</span>
              </>
            )}
            {paymentStatus === "confirming" && (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-lg font-medium text-blue-600">Confirmation en cours...</span>
              </>
            )}
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {paymentRequest.amount} {paymentRequest.currency}
            </div>
            {paymentRequest.description && <p className="text-gray-600 mb-4">{paymentRequest.description}</p>}

            {/* Détails TVA */}
            {paymentRequest.vatEnabled && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Montant HT:</span>
                    <span>
                      {paymentRequest.netAmount.toFixed(2)} {paymentRequest.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA ({paymentRequest.vatRate}%):</span>
                    <span>
                      {paymentRequest.vatAmount.toFixed(2)} {paymentRequest.currency}
                    </span>
                  </div>
                  <div className="border-t pt-1 flex justify-between font-medium">
                    <span>Total TTC:</span>
                    <span>
                      {paymentRequest.amount} {paymentRequest.currency}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Options de paiement */}
      <Card>
        <CardHeader>
          <CardTitle>Choisir la méthode de paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPaymentMethod} onValueChange={(value: any) => setSelectedPaymentMethod(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="lightning" className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Lightning</span>
              </TabsTrigger>
              <TabsTrigger value="BTC">BTC</TabsTrigger>
              <TabsTrigger value="ETH">ETH</TabsTrigger>
              <TabsTrigger value="USDT">USDT</TabsTrigger>
            </TabsList>

            {/* Lightning Network */}
            <TabsContent value="lightning" className="space-y-4">
              <div className="text-center">
                <Badge className="bg-yellow-100 text-yellow-800 mb-4">
                  <Zap className="h-3 w-3 mr-1" />
                  Paiement instantané
                </Badge>

                <div className="bg-white p-4 rounded-lg border-2 border-yellow-200 mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentRequest.cryptoOptions.lightning.invoice)}`}
                    alt="Lightning Invoice QR"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Facture Lightning:</p>
                    <p className="font-mono text-xs break-all">{paymentRequest.cryptoOptions.lightning.invoice}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(paymentRequest.cryptoOptions.lightning.invoice, "Facture Lightning")
                      }
                      className="mt-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copier
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>• Paiement instantané et frais réduits</p>
                    <p>• Scannez avec un wallet Lightning</p>
                    <p>• Confirmation en quelques secondes</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Bitcoin */}
            <TabsContent value="BTC" className="space-y-4">
              <div className="text-center">
                <Badge className="bg-orange-100 text-orange-800 mb-4">
                  <Bitcoin className="h-3 w-3 mr-1" />
                  {paymentRequest.cryptoOptions.BTC.amount} BTC
                </Badge>

                <div className="bg-white p-4 rounded-lg border-2 border-orange-200 mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${paymentRequest.cryptoOptions.BTC.address}?amount=${paymentRequest.cryptoOptions.BTC.amount}`}
                    alt="Bitcoin QR"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Adresse Bitcoin:</p>
                    <p className="font-mono text-sm break-all">{paymentRequest.cryptoOptions.BTC.address}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(paymentRequest.cryptoOptions.BTC.address, "Adresse Bitcoin")}
                      className="mt-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copier
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>• Confirmation: 10-60 minutes</p>
                    <p>• Frais de réseau variables</p>
                    <p>• Sécurité maximale</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Ethereum */}
            <TabsContent value="ETH" className="space-y-4">
              <div className="text-center">
                <Badge className="bg-blue-100 text-blue-800 mb-4">{paymentRequest.cryptoOptions.ETH.amount} ETH</Badge>

                <div className="bg-white p-4 rounded-lg border-2 border-blue-200 mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ethereum:${paymentRequest.cryptoOptions.ETH.address}?value=${paymentRequest.cryptoOptions.ETH.amount}`}
                    alt="Ethereum QR"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Adresse Ethereum:</p>
                    <p className="font-mono text-sm break-all">{paymentRequest.cryptoOptions.ETH.address}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(paymentRequest.cryptoOptions.ETH.address, "Adresse Ethereum")}
                      className="mt-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copier
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>• Confirmation: 1-5 minutes</p>
                    <p>• Frais de gas variables</p>
                    <p>• Compatible DeFi</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* USDT */}
            <TabsContent value="USDT" className="space-y-4">
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800 mb-4">
                  {paymentRequest.cryptoOptions.USDT.amount} USDT
                </Badge>

                <div className="bg-white p-4 rounded-lg border-2 border-green-200 mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ethereum:${paymentRequest.cryptoOptions.USDT.address}?value=${paymentRequest.cryptoOptions.USDT.amount}`}
                    alt="USDT QR"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Adresse USDT (ERC-20):</p>
                    <p className="font-mono text-sm break-all">{paymentRequest.cryptoOptions.USDT.address}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(paymentRequest.cryptoOptions.USDT.address, "Adresse USDT")}
                      className="mt-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copier
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>• Stablecoin (1 USDT = 1 USD)</p>
                    <p>• Confirmation: 1-5 minutes</p>
                    <p>• Idéal pour éviter la volatilité</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button variant="outline" onClick={refreshPayment} className="flex-1 bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
        <Button variant="outline" onClick={() => onNavigate("tpe-billing")} className="flex-1">
          Annuler
        </Button>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h3 className="font-medium text-blue-900">Instructions pour le client</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-start space-x-2">
                <Smartphone className="h-4 w-4 mt-0.5" />
                <span>Ouvrez votre wallet crypto sur votre téléphone</span>
              </div>
              <div className="flex items-start space-x-2">
                <QrCode className="h-4 w-4 mt-0.5" />
                <span>Scannez le QR code ou copiez l'adresse</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 mt-0.5" />
                <span>Confirmez le paiement dans votre wallet</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
