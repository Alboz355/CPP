"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, CreditCard, Shield, CheckCircle, AlertTriangle, ArrowRight, Banknote, Smartphone } from "lucide-react"

interface MtPelerinWidgetProps {
  isOpen: boolean
  onClose: () => void
  walletData: {
    addresses?: {
      bitcoin?: string
      ethereum?: string
      algorand?: string
    }
  } | null
}

type PurchaseStep = "amount" | "payment" | "verification" | "processing" | "complete"

export function MtPelerinWidget({ isOpen, onClose, walletData }: MtPelerinWidgetProps) {
  const [currentStep, setCurrentStep] = useState<PurchaseStep>("amount")
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")
  const [fiatAmount, setFiatAmount] = useState("")
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  // Vérification de sécurité pour walletData
  if (!walletData || !walletData.addresses) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Erreur</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Impossible d'accéder aux données du portefeuille.</p>
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const cryptoOptions = [
    {
      value: "bitcoin",
      label: "Bitcoin (BTC)",
      symbol: "₿",
      rate: 42000,
      address: walletData.addresses.bitcoin || "Adresse non disponible",
    },
    {
      value: "ethereum",
      label: "Ethereum (ETH)",
      symbol: "Ξ",
      rate: 2500,
      address: walletData.addresses.ethereum || "Adresse non disponible",
    },
    {
      value: "algorand",
      label: "Algorand (ALGO)",
      symbol: "Ⱥ",
      rate: 0.18,
      address: walletData.addresses.algorand || "Adresse non disponible",
    },
  ]

  const selectedCryptoData = cryptoOptions.find((crypto) => crypto.value === selectedCrypto)

  const handleFiatAmountChange = (value: string) => {
    setFiatAmount(value)
    if (value && selectedCryptoData) {
      const crypto = Number.parseFloat(value) / selectedCryptoData.rate
      setCryptoAmount(crypto.toFixed(8))
    } else {
      setCryptoAmount("")
    }
  }

  const handleCryptoAmountChange = (value: string) => {
    setCryptoAmount(value)
    if (value && selectedCryptoData) {
      const fiat = Number.parseFloat(value) * selectedCryptoData.rate
      setFiatAmount(fiat.toFixed(2))
    } else {
      setFiatAmount("")
    }
  }

  const handleNextStep = () => {
    setError("")

    switch (currentStep) {
      case "amount":
        if (!fiatAmount || Number.parseFloat(fiatAmount) < 10) {
          setError("Le montant minimum est de 10 CHF")
          return
        }
        setCurrentStep("payment")
        break
      case "payment":
        if (!paymentMethod) {
          setError("Veuillez sélectionner un moyen de paiement")
          return
        }
        setCurrentStep("verification")
        break
      case "verification":
        setCurrentStep("processing")
        simulateProcessing()
        break
      case "processing":
        setCurrentStep("complete")
        break
      case "complete":
        onClose()
        resetWidget()
        break
    }
  }

  const simulateProcessing = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setCurrentStep("complete")
    }, 3000)
  }

  const resetWidget = () => {
    setCurrentStep("amount")
    setSelectedCrypto("bitcoin")
    setFiatAmount("")
    setCryptoAmount("")
    setPaymentMethod("")
    setError("")
    setIsProcessing(false)
  }

  const getStepProgress = () => {
    const steps = ["amount", "payment", "verification", "processing", "complete"]
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "amount":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="crypto-select">Cryptomonnaie</Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cryptoOptions.map((crypto) => (
                    <SelectItem key={crypto.value} value={crypto.value}>
                      <div className="flex items-center space-x-2">
                        <span>{crypto.symbol}</span>
                        <span>{crypto.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fiat-amount">Montant (CHF)</Label>
                <Input
                  id="fiat-amount"
                  type="number"
                  placeholder="100.00"
                  value={fiatAmount}
                  onChange={(e) => handleFiatAmountChange(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="crypto-amount">
                  Montant ({selectedCryptoData?.label.split(" ")[1]?.replace("(", "").replace(")", "")})
                </Label>
                <Input
                  id="crypto-amount"
                  type="number"
                  placeholder="0.00000000"
                  value={cryptoAmount}
                  onChange={(e) => handleCryptoAmountChange(e.target.value)}
                />
              </div>
            </div>

            {selectedCryptoData && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Taux de change actuel:</div>
                <div className="font-semibold">
                  1 {selectedCryptoData.label.split(" ")[1]?.replace("(", "").replace(")", "")} ={" "}
                  {selectedCryptoData.rate.toLocaleString()} CHF
                </div>
              </div>
            )}

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>Montant minimum: 10 CHF • Montant maximum: 5'000 CHF par jour</AlertDescription>
            </Alert>
          </div>
        )

      case "payment":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Vous achetez:</span>
                <span className="font-semibold">
                  {cryptoAmount} {selectedCryptoData?.label.split(" ")[1]?.replace("(", "").replace(")", "")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Montant total:</span>
                <span className="font-bold text-lg">{fiatAmount} CHF</span>
              </div>
            </div>

            <div>
              <Label>Moyen de paiement</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                <Card
                  className={`cursor-pointer transition-all ${paymentMethod === "card" ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-semibold">Carte de crédit/débit</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Visa, Mastercard</div>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        Instantané
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${paymentMethod === "bank" ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setPaymentMethod("bank")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Banknote className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-semibold">Virement bancaire</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">SEPA, Virement suisse</div>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        1-2 jours
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${paymentMethod === "twint" ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setPaymentMethod("twint")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-6 w-6 text-purple-600" />
                      <div>
                        <div className="font-semibold">TWINT</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Paiement mobile suisse</div>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        Instantané
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case "verification":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Vérification de la commande</h3>
              <p className="text-gray-600 dark:text-gray-400">Veuillez vérifier les détails de votre achat</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cryptomonnaie:</span>
                <span className="font-semibold">{selectedCryptoData?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Quantité:</span>
                <span className="font-semibold">
                  {cryptoAmount} {selectedCryptoData?.label.split(" ")[1]?.replace("(", "").replace(")", "")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Montant:</span>
                <span className="font-semibold">{fiatAmount} CHF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Frais:</span>
                <span className="font-semibold">{(Number.parseFloat(fiatAmount) * 0.015).toFixed(2)} CHF</span>
              </div>
              <hr className="border-gray-300 dark:border-gray-600" />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">{(Number.parseFloat(fiatAmount) * 1.015).toFixed(2)} CHF</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Adresse de réception:</div>
              <div className="font-mono text-sm break-all">{selectedCryptoData?.address}</div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Les cryptomonnaies seront envoyées à votre adresse dans les 10 minutes suivant la confirmation du
                paiement.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "processing":
        return (
          <div className="text-center space-y-6">
            <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Traitement en cours...</h3>
              <p className="text-gray-600 dark:text-gray-400">Votre commande est en cours de traitement</p>
            </div>
            <Progress value={66} className="w-full" />
            <div className="text-sm text-gray-500 dark:text-gray-400">Cela peut prendre quelques minutes</div>
          </div>
        )

      case "complete":
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-green-600">Achat réussi !</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vos {cryptoAmount} {selectedCryptoData?.label.split(" ")[1]?.replace("(", "").replace(")", "")} ont été
                envoyés à votre portefeuille
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transaction ID:</div>
              <div className="font-mono text-sm">mt_pelerin_tx_123456789</div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">MP</span>
              </div>
              <span>Mt Pelerin - Achat de Crypto</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Étape {["amount", "payment", "verification", "processing", "complete"].indexOf(currentStep) + 1} sur 5
              </span>
              <span>{Math.round(getStepProgress())}%</span>
            </div>
            <Progress value={getStepProgress()} className="w-full" />
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === "amount") {
                  onClose()
                } else {
                  const steps: PurchaseStep[] = ["amount", "payment", "verification", "processing", "complete"]
                  const currentIndex = steps.indexOf(currentStep)
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1])
                  }
                }
              }}
              disabled={isProcessing}
            >
              {currentStep === "amount" ? "Annuler" : "Retour"}
            </Button>

            <Button onClick={handleNextStep} disabled={isProcessing} className="flex items-center space-x-2">
              <span>
                {currentStep === "complete"
                  ? "Terminer"
                  : currentStep === "verification"
                    ? "Confirmer l'achat"
                    : "Continuer"}
              </span>
              {currentStep !== "complete" && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
