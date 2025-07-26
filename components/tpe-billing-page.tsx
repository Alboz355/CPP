"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calculator, QrCode, Send, Bitcoin, Smartphone, CheckCircle, AlertTriangle } from "lucide-react"
import type { AppState } from "@/app/page"

interface TPEBillingPageProps {
  onNavigate: (page: AppState) => void
  walletData: any
}

interface PaymentRequest {
  id: string
  amount: number
  currency: string
  description: string
  customerEmail: string
  vatEnabled: boolean
  vatRate: number
  vatAmount: number
  netAmount: number
  cryptoOptions: any
  status: string
  expiresAt: Date
}

export function TPEBillingPage({ onNavigate, walletData }: TPEBillingPageProps) {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("CHF")
  const [description, setDescription] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("crypto")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSent, setPaymentSent] = useState(false)

  const currencies = [
    { code: "CHF", name: "Franc Suisse", symbol: "CHF" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "USD", name: "Dollar US", symbol: "$" },
  ]

  const cryptoRates = {
    BTC: 43250,
    ETH: 2650,
    USDT: 1.0,
    CHFM: 1.0, // Stablecoin CHF
  }

  const calculateCryptoAmount = (fiatAmount: string, crypto: string) => {
    if (!fiatAmount || !crypto) return "0"
    const amount = Number.parseFloat(fiatAmount)
    const rate = cryptoRates[crypto as keyof typeof cryptoRates]
    return (amount / rate).toFixed(crypto === "BTC" ? 8 : 6)
  }

  const handleSendPayment = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) return

    setIsProcessing(true)

    // Calculer la TVA si activée
    const vatSettings = JSON.parse(localStorage.getItem("tpe-vat-settings") || '{"enabled": false, "rate": 7.7}')
    const amountFloat = Number.parseFloat(amount)

    let vatAmount = 0
    let netAmount = amountFloat

    if (vatSettings.enabled) {
      // Calcul TVA depuis prix TTC
      vatAmount = (amountFloat * vatSettings.rate) / (100 + vatSettings.rate)
      netAmount = amountFloat - vatAmount
    }

    // Générer les options de paiement crypto
    const cryptoOptions = {
      BTC: {
        amount: (amountFloat / cryptoRates.BTC).toFixed(8),
        address: walletData?.addresses?.bitcoin || "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
        qr: "",
      },
      ETH: {
        amount: (amountFloat / cryptoRates.ETH).toFixed(6),
        address: walletData?.addresses?.ethereum || "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C",
        qr: "",
      },
      USDT: {
        amount: amountFloat.toFixed(2),
        address: walletData?.addresses?.ethereum || "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C",
        qr: "",
      },
      lightning: {
        invoice: `lnbc${Math.floor(amountFloat * 100000)}u1p${Math.random().toString(36).substr(2, 9)}`,
        qr: "",
      },
    }

    // Créer la demande de paiement
    const paymentRequest: PaymentRequest = {
      id: Date.now().toString(),
      amount: amountFloat,
      currency,
      description,
      customerEmail,
      vatEnabled: vatSettings.enabled,
      vatRate: vatSettings.rate,
      vatAmount,
      netAmount,
      cryptoOptions,
      status: "pending",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    }

    // Sauvegarder la demande
    localStorage.setItem("current-payment-request", JSON.stringify(paymentRequest))

    setIsProcessing(false)

    // Naviguer vers la page de paiement
    onNavigate("tpe-payment")
  }

  if (paymentSent) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-800 mb-2">Demande envoyée !</h2>
            <p className="text-gray-600 mb-4">
              La demande de paiement de {amount} {currency} a été envoyée au client.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Le client recevra un QR code pour payer</p>
              <p>• Vous serez notifié lors du paiement</p>
              <p>• Conversion automatique en CHFM disponible</p>
            </div>
            <Button onClick={() => onNavigate("tpe")} className="mt-6 w-full">
              Retour au menu TPE
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("tpe")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nouvelle Facture</h1>
          <p className="text-gray-600">Créer une demande de paiement crypto</p>
        </div>
      </div>

      {/* Formulaire de facturation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Détails de la facture</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Montant et devise */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label>Devise</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.name} ({curr.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              placeholder="Description de la transaction..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Email client */}
          <div className="space-y-2">
            <Label htmlFor="email">Email client (optionnel)</Label>
            <Input
              id="email"
              type="email"
              placeholder="client@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <p className="text-sm text-gray-600">Le client recevra un lien de paiement par email</p>
          </div>

          {/* Méthode de paiement */}
          <div className="space-y-2">
            <Label>Méthode de paiement acceptée</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crypto">
                  <div className="flex items-center space-x-2">
                    <Bitcoin className="h-4 w-4" />
                    <span>Cryptomonnaies</span>
                  </div>
                </SelectItem>
                <SelectItem value="qr">
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-4 w-4" />
                    <span>QR Code</span>
                  </div>
                </SelectItem>
                <SelectItem value="mobile">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Paiement mobile</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu des montants crypto */}
      {amount && Number.parseFloat(amount) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Équivalents crypto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Bitcoin</p>
                <p className="font-bold text-orange-600">{calculateCryptoAmount(amount, "BTC")} BTC</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Ethereum</p>
                <p className="font-bold text-blue-600">{calculateCryptoAmount(amount, "ETH")} ETH</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">USDT</p>
                <p className="font-bold text-green-600">{calculateCryptoAmount(amount, "USDT")} USDT</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">CHFM</p>
                <p className="font-bold text-purple-600">{amount} CHFM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="space-y-4">
        <Button
          onClick={handleSendPayment}
          disabled={!amount || Number.parseFloat(amount) <= 0 || isProcessing}
          className="w-full h-12"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Envoyer la demande de paiement
            </>
          )}
        </Button>

        <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Information importante</p>
              <p className="mt-1">
                Le client pourra payer avec n'importe quelle crypto supportée. La conversion en CHFM sera disponible
                après réception du paiement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
