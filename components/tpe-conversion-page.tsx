"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowUpDown,
  Calculator,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  DollarSign,
  Euro,
  Banknote,
} from "lucide-react"
import type { AppState } from "@/app/page"
import { cryptoService, type CryptoPrice } from "@/lib/crypto-prices"

interface TPEConversionPageProps {
  onNavigate: (page: AppState) => void
}

export function TPEConversionPage({ onNavigate }: TPEConversionPageProps) {
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState<"CHF" | "EUR" | "USD" | "BTC" | "ETH" | "ALGO">("CHF")
  const [toCurrency, setToCurrency] = useState<"CHF" | "EUR" | "USD" | "BTC" | "ETH" | "ALGO">("BTC")
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [conversionHistory, setConversionHistory] = useState<
    Array<{
      id: string
      from: string
      to: string
      fromAmount: number
      toAmount: number
      rate: number
      timestamp: Date
    }>
  >([])

  // Taux de change fiat (simulation)
  const fiatRates = {
    CHF: 1,
    EUR: 1.08,
    USD: 1.12,
  }

  useEffect(() => {
    loadCryptoPrices()
    loadConversionHistory()
  }, [])

  useEffect(() => {
    if (fromAmount && cryptoPrices.length > 0) {
      calculateConversion()
    }
  }, [fromAmount, fromCurrency, toCurrency, cryptoPrices])

  const loadCryptoPrices = async () => {
    setIsLoading(true)
    try {
      const prices = await cryptoService.getCryptoPrices()
      setCryptoPrices(prices)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Erreur chargement prix:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadConversionHistory = () => {
    try {
      const saved = localStorage.getItem("tpe-conversion-history")
      if (saved) {
        const history = JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        setConversionHistory(history.slice(0, 5)) // Garder seulement les 5 dernières
      }
    } catch (error) {
      console.error("Erreur chargement historique:", error)
    }
  }

  const saveConversionToHistory = (from: string, to: string, fromAmt: number, toAmt: number, rate: number) => {
    const newConversion = {
      id: Date.now().toString(),
      from,
      to,
      fromAmount: fromAmt,
      toAmount: toAmt,
      rate,
      timestamp: new Date(),
    }

    const updatedHistory = [newConversion, ...conversionHistory].slice(0, 10)
    setConversionHistory(updatedHistory)

    try {
      localStorage.setItem("tpe-conversion-history", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Erreur sauvegarde historique:", error)
    }
  }

  const calculateConversion = () => {
    const amount = Number.parseFloat(fromAmount)
    if (isNaN(amount) || amount <= 0) {
      setToAmount("")
      return
    }

    let result = 0
    let rate = 0

    // Conversion crypto vers fiat
    if (["BTC", "ETH", "ALGO"].includes(fromCurrency) && ["CHF", "EUR", "USD"].includes(toCurrency)) {
      const cryptoPrice = cryptoPrices.find((p) => p.symbol.toUpperCase() === fromCurrency)
      if (cryptoPrice) {
        const chfValue = amount * cryptoPrice.current_price
        result = chfValue * fiatRates[toCurrency as keyof typeof fiatRates]
        rate = cryptoPrice.current_price * fiatRates[toCurrency as keyof typeof fiatRates]
      }
    }
    // Conversion fiat vers crypto
    else if (["CHF", "EUR", "USD"].includes(fromCurrency) && ["BTC", "ETH", "ALGO"].includes(toCurrency)) {
      const cryptoPrice = cryptoPrices.find((p) => p.symbol.toUpperCase() === toCurrency)
      if (cryptoPrice) {
        const chfValue = amount / fiatRates[fromCurrency as keyof typeof fiatRates]
        result = chfValue / cryptoPrice.current_price
        rate = 1 / (cryptoPrice.current_price / fiatRates[fromCurrency as keyof typeof fiatRates])
      }
    }
    // Conversion fiat vers fiat
    else if (["CHF", "EUR", "USD"].includes(fromCurrency) && ["CHF", "EUR", "USD"].includes(toCurrency)) {
      result =
        (amount / fiatRates[fromCurrency as keyof typeof fiatRates]) * fiatRates[toCurrency as keyof typeof fiatRates]
      rate = fiatRates[toCurrency as keyof typeof fiatRates] / fiatRates[fromCurrency as keyof typeof fiatRates]
    }
    // Conversion crypto vers crypto
    else if (["BTC", "ETH", "ALGO"].includes(fromCurrency) && ["BTC", "ETH", "ALGO"].includes(toCurrency)) {
      const fromPrice = cryptoPrices.find((p) => p.symbol.toUpperCase() === fromCurrency)
      const toPrice = cryptoPrices.find((p) => p.symbol.toUpperCase() === toCurrency)
      if (fromPrice && toPrice) {
        result = (amount * fromPrice.current_price) / toPrice.current_price
        rate = fromPrice.current_price / toPrice.current_price
      }
    }

    setToAmount(result.toFixed(["BTC", "ETH", "ALGO"].includes(toCurrency) ? 8 : 2))

    // Sauvegarder dans l'historique si c'est une conversion valide
    if (result > 0) {
      saveConversionToHistory(fromCurrency, toCurrency, amount, result, rate)
    }
  }

  const swapCurrencies = () => {
    const tempCurrency = fromCurrency
    const tempAmount = fromAmount

    setFromCurrency(toCurrency)
    setToCurrency(tempCurrency)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case "CHF":
        return <Banknote className="h-4 w-4" />
      case "EUR":
        return <Euro className="h-4 w-4" />
      case "USD":
        return <DollarSign className="h-4 w-4" />
      default:
        return <div className="w-4 h-4 bg-orange-500 rounded-full" />
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (["BTC", "ETH", "ALGO"].includes(currency)) {
      return `${amount.toFixed(8)} ${currency}`
    }
    return new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency: currency === "CHF" ? "CHF" : currency === "EUR" ? "EUR" : "USD",
    }).format(amount)
  }

  const quickAmounts = [10, 50, 100, 500, 1000]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => onNavigate("tpe")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Convertisseur</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Conversion crypto/fiat en temps réel</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={loadCryptoPrices} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
            {lastUpdate && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {lastUpdate.toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" })}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Convertisseur principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Convertisseur de devises
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Montant source */}
            <div className="space-y-2">
              <Label htmlFor="fromAmount">De</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    id="fromAmount"
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="CHF">CHF</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="ALGO">ALGO</option>
                </select>
              </div>
            </div>

            {/* Bouton d'échange */}
            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={swapCurrencies}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Montant destination */}
            <div className="space-y-2">
              <Label htmlFor="toAmount">Vers</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    id="toAmount"
                    type="text"
                    placeholder="0.00"
                    value={toAmount}
                    readOnly
                    className="text-lg bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="CHF">CHF</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="ALGO">ALGO</option>
                </select>
              </div>
            </div>

            {/* Montants rapides */}
            <div className="space-y-2">
              <Label>Montants rapides ({fromCurrency})</Label>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((amount) => (
                  <Button key={amount} variant="outline" size="sm" onClick={() => setFromAmount(amount.toString())}>
                    {amount}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prix des cryptos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prix des cryptomonnaies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cryptoPrices.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{cryptoService.formatPrice(crypto.current_price)}</p>
                    <div className="flex items-center space-x-1">
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={`text-sm ${
                          crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historique des conversions */}
        {conversionHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historique des conversions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversionHistory.map((conversion) => (
                  <div
                    key={conversion.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        {getCurrencyIcon(conversion.from)}
                        <ArrowUpDown className="h-3 w-3 text-gray-400" />
                        {getCurrencyIcon(conversion.to)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {formatCurrency(conversion.fromAmount, conversion.from)} →{" "}
                          {formatCurrency(conversion.toAmount, conversion.to)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {conversion.timestamp.toLocaleString("fr-CH", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Taux: {conversion.rate.toFixed(6)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom spacing for navigation */}
      <div className="h-20"></div>
    </div>
  )
}
