"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, QrCode, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import type { AppState } from "@/app/page"
import { BlockchainManager, type NetworkFees } from "@/lib/blockchain-apis"

interface SendPageProps {
  onNavigate: (page: AppState) => void
}

export function SendPage({ onNavigate }: SendPageProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [usdValue, setUsdValue] = useState("")
  const [networkFees, setNetworkFees] = useState<{ eth: NetworkFees; btc: NetworkFees } | null>(null)
  const [selectedFeeLevel, setSelectedFeeLevel] = useState<"slow" | "standard" | "fast">("standard")

  const cryptos = [
    { symbol: "ETH", name: "Ethereum", balance: "1.234", rate: 1987.5 },
    { symbol: "BTC", name: "Bitcoin", balance: "0.05", rate: 43000.0 },
    { symbol: "USDT", name: "Tether", balance: "500.00", rate: 1.0 },
  ]

  const selectedCryptoData = cryptos.find((c) => c.symbol === selectedCrypto)

  const blockchainManager = new BlockchainManager()

  useEffect(() => {
    const loadFees = async () => {
      try {
        const fees = await blockchainManager.getNetworkFees()
        setNetworkFees(fees)
      } catch (error) {
        console.error("Erreur lors du chargement des frais:", error)
      }
    }

    loadFees()
  }, [])

  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (selectedCryptoData && value) {
      const usd = (Number.parseFloat(value) * selectedCryptoData.rate).toFixed(2)
      setUsdValue(usd)
    } else {
      setUsdValue("")
    }
  }

  const handleMaxClick = () => {
    if (selectedCryptoData) {
      setAmount(selectedCryptoData.balance)
      const usd = (Number.parseFloat(selectedCryptoData.balance) * selectedCryptoData.rate).toFixed(2)
      setUsdValue(usd)
    }
  }

  const handleSend = () => {
    // Simuler l'envoi
    toast.success("Transaction envoyée avec succès !")
    onNavigate("dashboard")
  }

  const isValid = selectedCrypto && recipient && amount && Number.parseFloat(amount) > 0

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Envoyer</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Envoyer des cryptomonnaies</CardTitle>
          <CardDescription>Sélectionnez la cryptomonnaie et entrez les détails de la transaction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Crypto Selection */}
          <div className="space-y-2">
            <Label>Cryptomonnaie</Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une cryptomonnaie" />
              </SelectTrigger>
              <SelectContent>
                {cryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {crypto.name} ({crypto.symbol})
                      </span>
                      <span className="text-sm text-gray-500 ml-4">
                        {crypto.balance} {crypto.symbol}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCryptoData && (
              <p className="text-sm text-gray-600">
                Solde disponible: {selectedCryptoData.balance} {selectedCryptoData.symbol}
              </p>
            )}
          </div>

          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Adresse du destinataire</Label>
            <div className="flex space-x-2">
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleMaxClick}>
                  MAX
                </Button>
              </div>
              {usdValue && <p className="text-sm text-gray-600">≈ ${usdValue} USD</p>}
            </div>
          </div>

          {/* Transaction Fee */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Frais de réseau</span>
                <Select
                  value={selectedFeeLevel}
                  onValueChange={(value: "slow" | "standard" | "fast") => setSelectedFeeLevel(value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Lent</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="fast">Rapide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {networkFees && selectedCrypto && (
                <div className="text-sm text-gray-600">
                  {selectedCrypto === "ETH" && <p>Frais: {networkFees.eth[selectedFeeLevel]} (~$2-10)</p>}
                  {selectedCrypto === "BTC" && <p>Frais: {networkFees.btc[selectedFeeLevel]} (~$1-5)</p>}
                  {selectedCrypto === "USDT" && <p>Frais: {networkFees.eth[selectedFeeLevel]} (~$2-10)</p>}
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Attention !</p>
                <p>
                  Vérifiez soigneusement l'adresse du destinataire. Les transactions en cryptomonnaies sont
                  irréversibles.
                </p>
              </div>
            </div>
          </div>

          <Button onClick={handleSend} className="w-full" disabled={!isValid}>
            <Send className="h-4 w-4 mr-2" />
            Envoyer la transaction
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
