"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, ShoppingCart, ArrowLeftRight, DollarSign } from "lucide-react"

interface MtPelerinWidgetProps {
  isOpen: boolean
  onClose: () => void
  walletData: any
  defaultAction?: "buy" | "sell" | "swap"
}

// Déclarer le type pour la fonction Mt Pelerin
declare global {
  interface Window {
    showMtpModal: (options: any) => void
  }
}

export function MtPelerinWidget({ isOpen, onClose, walletData, defaultAction = "buy" }: MtPelerinWidgetProps) {
  const [selectedAction, setSelectedAction] = useState(defaultAction)
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [selectedFiat, setSelectedFiat] = useState("EUR")

  if (!isOpen) return null

  // Configuration Mt Pelerin
  const API_KEY = "bec6626e-8913-497d-9835-6e6ae9edb144"

  // Cryptos supportées par Mt Pelerin
  const supportedCryptos = [
    { symbol: "BTC", name: "Bitcoin", network: "bitcoin" },
    { symbol: "ETH", name: "Ethereum", network: "ethereum" },
    { symbol: "USDT", name: "Tether", network: "ethereum" },
    { symbol: "USDC", name: "USD Coin", network: "ethereum" },
    { symbol: "ALGO", name: "Algorand", network: "algorand" },
    { symbol: "MATIC", name: "Polygon", network: "polygon" },
  ]

  // Devises fiat supportées
  const supportedFiats = [
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "GBP", name: "British Pound", symbol: "£" },
  ]

  // Obtenir l'adresse du portefeuille pour la crypto sélectionnée
  const getWalletAddress = (crypto: string) => {
    switch (crypto) {
      case "BTC":
        return walletData?.addresses?.bitcoin || ""
      case "ETH":
      case "USDT":
      case "USDC":
      case "MATIC":
        return walletData?.addresses?.ethereum || ""
      case "ALGO":
        return walletData?.addresses?.algorand || ""
      default:
        return ""
    }
  }

  // Ouvrir Mt Pelerin avec la méthode popup/modal
  const openMtPelerinModal = (action: string) => {
    try {
      if (typeof window !== "undefined" && window.showMtpModal) {
        const options = {
          lang: "fr",
          apiKey: API_KEY,
          type: action, // buy, sell, swap
          bsc: selectedCrypto, // Buy/Sell Currency
          bdc: selectedFiat, // Buy/Sell Display Currency
          net: supportedCryptos.find((c) => c.symbol === selectedCrypto)?.network || "ethereum",
          addr: getWalletAddress(selectedCrypto), // Adresse de destination
          theme: "light",
          primaryColor: "#3B82F6",
          secondaryColor: "#1E40AF",
          tab: action, // Onglet par défaut
          onClose: () => {
            console.log("Mt Pelerin modal fermée")
          },
          onSuccess: (data: any) => {
            console.log("Transaction Mt Pelerin réussie:", data)
            alert("Transaction réussie !")
          },
          onError: (error: any) => {
            console.error("Erreur Mt Pelerin:", error)
            alert("Erreur lors de la transaction")
          },
        }

        console.log("Ouverture Mt Pelerin modal avec options:", options)
        window.showMtpModal(options)
        onClose() // Fermer notre modal
      } else {
        console.error("Mt Pelerin widget non chargé")
        alert("Le widget Mt Pelerin n'est pas encore chargé. Veuillez réessayer dans quelques secondes.")
      }
    } catch (error) {
      console.error("Erreur ouverture Mt Pelerin:", error)
      alert("Erreur lors de l'ouverture de Mt Pelerin")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Mt Pelerin</CardTitle>
                <p className="text-sm text-gray-600">Achat/Vente sans KYC</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Configuration rapide */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cryptomonnaie</label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedCryptos.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      <div className="flex items-center space-x-2">
                        <span>{crypto.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {crypto.symbol}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Devise</label>
              <Select value={selectedFiat} onValueChange={setSelectedFiat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedFiats.map((fiat) => (
                    <SelectItem key={fiat.code} value={fiat.code}>
                      <div className="flex items-center space-x-2">
                        <span>{fiat.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {fiat.symbol}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Adresse de destination */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Adresse de destination:</p>
              <p className="text-xs font-mono text-gray-600 mt-1 break-all">
                {getWalletAddress(selectedCrypto) || "Adresse non disponible"}
              </p>
            </div>
          </div>

          {/* Actions Mt Pelerin */}
          <div className="space-y-3">
            <Button onClick={() => openMtPelerinModal("buy")} className="w-full h-12 bg-green-600 hover:bg-green-700">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Acheter {selectedCrypto}
            </Button>

            <Button
              onClick={() => openMtPelerinModal("sell")}
              variant="outline"
              className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Vendre {selectedCrypto}
            </Button>

            <Button
              onClick={() => openMtPelerinModal("swap")}
              variant="outline"
              className="w-full h-12 border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <ArrowLeftRight className="h-5 w-5 mr-2" />
              Échanger {selectedCrypto}
            </Button>
          </div>

          {/* Informations */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">🔒 Mt Pelerin Modal:</p>
              <ul className="space-y-1 text-xs">
                <li>• Interface native Mt Pelerin</li>
                <li>• Pas de KYC pour petits montants</li>
                <li>• Réglementé en Suisse</li>
                <li>• Frais transparents</li>
                <li>• Paiement par carte/virement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
