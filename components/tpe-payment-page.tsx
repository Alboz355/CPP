"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, QrCode, Copy, Printer, RefreshCw, CheckCircle, Clock } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cryptoService } from "@/lib/crypto-prices"
import type { AppState } from "@/app/page"

interface TPEPaymentPageProps {
  onNavigate: (page: AppState) => void
  onBack: () => void
  walletData: any
}

interface CryptoOption {
  id: string
  name: string
  symbol: string
  color: string
  address: string
  qrPrefix: string
}

export function TPEPaymentPage({ onNavigate, onBack, walletData }: TPEPaymentPageProps) {
  const [amount, setAmount] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [cryptoPrices, setCryptoPrices] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"waiting" | "received" | "confirmed">("waiting")
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "nfc">("qr")

  const cryptoOptions: Record<string, CryptoOption> = {
    bitcoin: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      color: "bg-orange-500",
      address: walletData?.addresses?.bitcoin || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      qrPrefix: "bitcoin:",
    },
    ethereum: {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      color: "bg-blue-500",
      address: walletData?.addresses?.ethereum || "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
      qrPrefix: "ethereum:",
    },
    algorand: {
      id: "algorand",
      name: "Algorand",
      symbol: "ALGO",
      color: "bg-black",
      address: walletData?.addresses?.algorand || "ALGORANDADDRESSEXAMPLE234567890ABCDEFGHIJK",
      qrPrefix: "algorand:",
    },
  }

  useEffect(() => {
    fetchCryptoPrices()
    const interval = setInterval(fetchCryptoPrices, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (amount && cryptoPrices[selectedCrypto]) {
      calculateCryptoAmount()
      generateQRCode()
    }
  }, [amount, selectedCrypto, cryptoPrices])

  const fetchCryptoPrices = async () => {
    try {
      const prices = await cryptoService.getCryptoPrices()
      const priceMap = prices.reduce((acc: any, crypto: any) => {
        acc[crypto.id] = crypto.current_price
        return acc
      }, {})
      setCryptoPrices(priceMap)
    } catch (error) {
      console.error("Error fetching crypto prices:", error)
      // Fallback prices
      setCryptoPrices({
        bitcoin: 45000,
        ethereum: 2800,
        algorand: 0.25,
      })
    }
  }

  const calculateCryptoAmount = () => {
    const chfAmount = Number.parseFloat(amount)
    const cryptoPrice = cryptoPrices[selectedCrypto]

    if (chfAmount && cryptoPrice) {
      // Convert CHF to USD (approximate rate)
      const usdAmount = chfAmount * 1.1 // 1 CHF ≈ 1.1 USD
      const cryptoValue = usdAmount / cryptoPrice
      setCryptoAmount(cryptoValue.toFixed(8))
    }
  }

  const generateQRCode = () => {
    const crypto = cryptoOptions[selectedCrypto]
    let qrData = crypto.address

    if (amount && Number.parseFloat(amount) > 0) {
      const cryptoValue = Number.parseFloat(cryptoAmount)

      switch (selectedCrypto) {
        case "bitcoin":
          qrData = `${crypto.qrPrefix}${crypto.address}?amount=${cryptoValue}`
          break
        case "ethereum":
          // Ethereum uses wei (1 ETH = 10^18 wei)
          const weiAmount = Math.floor(cryptoValue * Math.pow(10, 18))
          qrData = `${crypto.qrPrefix}${crypto.address}?value=${weiAmount}`
          break
        case "algorand":
          // Algorand uses microAlgos (1 ALGO = 10^6 microAlgos)
          const microAlgos = Math.floor(cryptoValue * Math.pow(10, 6))
          qrData = `${crypto.qrPrefix}${crypto.address}?amount=${microAlgos}`
          break
      }
    }

    // Generate QR code with proper crypto URI
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&bgcolor=FFFFFF&color=000000&margin=10`
    setQrCodeUrl(qrUrl)
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

  const printReceipt = () => {
    const crypto = cryptoOptions[selectedCrypto]
    const receiptContent = `
      CRYPTO STORE LAUSANNE
      Terminal de Paiement
      =====================
      
      Montant: ${amount} CHF
      Crypto: ${cryptoAmount} ${crypto.symbol}
      Taux: ${cryptoPrices[selectedCrypto]?.toFixed(2)} USD
      
      Adresse:
      ${crypto.address}
      
      ${new Date().toLocaleString("fr-CH")}
      =====================
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Reçu de Paiement</title>
            <style>
              body { font-family: monospace; font-size: 12px; margin: 20px; }
              .receipt { width: 300px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <pre>${receiptContent}</pre>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const simulatePaymentReceived = () => {
    setPaymentStatus("received")
    toast({
      title: "Paiement reçu !",
      description: "Transaction en cours de confirmation...",
    })

    setTimeout(() => {
      setPaymentStatus("confirmed")
      toast({
        title: "Paiement confirmé !",
        description: "Transaction validée sur la blockchain",
      })
    }, 3000)
  }

  const currentCrypto = cryptoOptions[selectedCrypto]
  const currentPrice = cryptoPrices[selectedCrypto]

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="bg-background dark:bg-background">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au TPE
          </Button>
          <h1 className="text-2xl font-bold text-foreground">💳 Nouveau Paiement</h1>
          <div className="w-32" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Payment Setup */}
          <div className="space-y-6">
            {/* Amount Input */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Montant à encaisser</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount" className="text-foreground">
                    Montant en CHF
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl font-bold text-center bg-background dark:bg-background text-foreground"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {["10", "50", "100", "500"].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount)}
                      className="bg-background dark:bg-background"
                    >
                      {quickAmount}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crypto Selection */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Cryptomonnaie</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <TabsList className="grid w-full grid-cols-3 bg-muted dark:bg-muted">
                    <TabsTrigger value="bitcoin">BTC</TabsTrigger>
                    <TabsTrigger value="ethereum">ETH</TabsTrigger>
                    <TabsTrigger value="algorand">ALGO</TabsTrigger>
                  </TabsList>

                  {Object.entries(cryptoOptions).map(([key, crypto]) => (
                    <TabsContent key={key} value={key} className="mt-4">
                      <div className="flex items-center space-x-4 p-4 bg-muted dark:bg-muted rounded-lg">
                        <div className={`w-12 h-12 ${crypto.color} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-bold text-lg">{crypto.symbol.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{crypto.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Prix actuel: {currentPrice ? `$${currentPrice.toFixed(2)}` : "Chargement..."}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchCryptoPrices}
                          disabled={loading}
                          className="bg-background dark:bg-background"
                        >
                          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Conversion Display */}
            {amount && cryptoAmount && (
              <Card className="bg-card dark:bg-card">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-bold text-foreground">{amount} CHF</p>
                    <p className="text-muted-foreground">≈</p>
                    <p className="text-2xl font-bold text-primary">
                      {cryptoAmount} {currentCrypto.symbol}
                    </p>
                    <p className="text-sm text-muted-foreground">Taux: ${currentPrice?.toFixed(2)} USD</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - QR Code & Payment */}
          <div className="space-y-6">
            {/* QR Code */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "qr" | "nfc")} className="w-full max-w-xs">
                      <TabsList className="grid w-full grid-cols-2 bg-muted dark:bg-muted">
                        <TabsTrigger value="qr" className="flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          QR Code
                        </TabsTrigger>
                        <TabsTrigger value="nfc" className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          </div>
                          NFC
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <CardTitle className="text-foreground flex items-center justify-center">
                    {paymentMethod === "qr" ? (
                      <>
                        <QrCode className="mr-2 h-5 w-5" />
                        Code QR de Paiement
                      </>
                    ) : (
                      <>
                        <div className="mr-2 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                        </div>
                        Paiement NFC
                      </>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {paymentMethod === "qr" ? (
                  // QR Code Content
                  <>
                    {qrCodeUrl ? (
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <img
                          src={qrCodeUrl || "/placeholder.svg"}
                          alt="QR Code de paiement"
                          className="w-64 h-64 mx-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `/placeholder.svg?height=256&width=256&text=QR+Code`
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-64 h-64 bg-muted dark:bg-muted rounded-lg flex items-center justify-center mx-auto">
                        <p className="text-muted-foreground">Saisissez un montant</p>
                      </div>
                    )}
                  </>
                ) : (
                  // NFC Content
                  <div className="space-y-6">
                    <div className="w-64 h-64 flex items-center justify-center mx-auto relative">
                      {/* NFC Logo with proper design */}
                      <div className="relative">
                        {/* Pulsation rings */}
                        {paymentStatus === "waiting" && (
                          <>
                            <div className="absolute inset-0 -m-8 rounded-full border-2 border-blue-500/30 animate-ping"></div>
                            <div className="absolute inset-0 -m-12 rounded-full border-2 border-blue-500/20 animate-ping" style={{animationDelay: '0.5s'}}></div>
                            <div className="absolute inset-0 -m-16 rounded-full border-2 border-blue-500/10 animate-ping" style={{animationDelay: '1s'}}></div>
                          </>
                        )}
                        
                        {/* Green charging rings when payment received */}
                        {(paymentStatus === "received" || paymentStatus === "confirmed") && (
                          <>
                            <div className="absolute inset-0 -m-8 rounded-full border-2 border-green-500/50 animate-pulse"></div>
                            <div className="absolute inset-0 -m-12 rounded-full border-2 border-green-500/30 animate-pulse" style={{animationDelay: '0.3s'}}></div>
                            <div className="absolute inset-0 -m-16 rounded-full border-2 border-green-500/20 animate-pulse" style={{animationDelay: '0.6s'}}></div>
                          </>
                        )}

                        {/* Main NFC Logo */}
                        <div className={`relative transition-all duration-500 ${
                          paymentStatus === "received" ? "text-green-500 scale-110" : 
                          paymentStatus === "confirmed" ? "text-green-600 scale-110" : 
                          "text-gray-800 dark:text-gray-200"
                        }`}>
                          <svg 
                            width="100" 
                            height="100" 
                            viewBox="0 0 100 100" 
                            fill="none"
                            className="drop-shadow-lg"
                          >
                            {/* NFC Symbol Base */}
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="45" 
                              stroke="currentColor" 
                              strokeWidth="3" 
                              fill="none"
                              className="opacity-20"
                            />
                            
                            {/* Inner NFC Waves */}
                            <path 
                              d="M30 35 Q35 30 40 35 Q45 40 50 35 Q55 30 60 35 Q65 40 70 35" 
                              stroke="currentColor" 
                              strokeWidth="4" 
                              fill="none"
                              strokeLinecap="round"
                              className="animate-pulse"
                            />
                            
                            <path 
                              d="M25 50 Q35 40 45 50 Q55 60 65 50 Q75 40 85 50" 
                              stroke="currentColor" 
                              strokeWidth="4" 
                              fill="none"
                              strokeLinecap="round"
                              className="animate-pulse"
                              style={{animationDelay: '0.5s'}}
                            />
                            
                            <path 
                              d="M30 65 Q35 70 40 65 Q45 60 50 65 Q55 70 60 65 Q65 60 70 65" 
                              stroke="currentColor" 
                              strokeWidth="4" 
                              fill="none"
                              strokeLinecap="round"
                              className="animate-pulse"
                              style={{animationDelay: '1s'}}
                            />
                            
                            {/* NFC Text */}
                            <text 
                              x="50" 
                              y="85" 
                              textAnchor="middle" 
                              className="text-xs font-bold fill-current"
                            >
                              NFC
                            </text>
                          </svg>
                        </div>
                        
                        {/* Charging effect overlay */}
                        {paymentStatus === "received" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 animate-ping"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-muted dark:bg-muted rounded-lg p-4">
                      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          paymentStatus === "waiting" ? "bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50" :
                          paymentStatus === "received" ? "bg-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50" :
                          "bg-green-500 shadow-lg shadow-green-500/50"
                        }`}></div>
                        <span className="font-medium">Terminal NFC activé pour {currentCrypto.name}</span>
                      </div>
                      <p className="text-xs text-center mt-2 text-muted-foreground">
                        Approchez votre portefeuille crypto compatible NFC
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Status - same for both methods */}
                <div className="space-y-2">
                  {paymentStatus === "waiting" && (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      En attente de paiement {paymentMethod === "nfc" ? "NFC" : "QR"}
                    </Badge>
                  )}
                  {paymentStatus === "received" && (
                    <Badge
                      variant="outline"
                      className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                    >
                      <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      Paiement reçu - Confirmation...
                    </Badge>
                  )}
                  {paymentStatus === "confirmed" && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Paiement confirmé
                    </Badge>
                  )}
                </div>

                {/* Action Buttons - conditional based on payment method */}
                <div className="flex gap-2 justify-center">
                  {paymentMethod === "qr" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(currentCrypto.address, "Adresse")}
                        className="bg-background dark:bg-background"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copier adresse
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={printReceipt}
                        disabled={!amount}
                        className="bg-background dark:bg-background"
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "NFC activé",
                            description: "Terminal prêt à recevoir les paiements NFC",
                          })
                        }}
                        className="bg-background dark:bg-background"
                      >
                        <div className="mr-2 h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                        Activer NFC
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={printReceipt}
                        disabled={!amount}
                        className="bg-background dark:bg-background"
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Address Display */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Adresse de réception</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted dark:bg-muted rounded-lg break-all text-sm font-mono text-foreground">
                    {currentCrypto.address}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Envoyez uniquement du {currentCrypto.name} ({currentCrypto.symbol}) à cette adresse
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Test Button (for demo) */}
            <Card className="bg-card dark:bg-card border-dashed">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Mode démonstration</p>
                <Button
                  onClick={simulatePaymentReceived}
                  disabled={paymentStatus !== "waiting" || !amount}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Simuler réception paiement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
