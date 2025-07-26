"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ArrowLeftRight, TrendingUp, Clock, Settings, CheckCircle } from "lucide-react"
import type { AppState } from "@/app/page"

interface ConversionRule {
  id: string
  fromCrypto: string
  toCrypto: string
  threshold: number
  autoConvert: boolean
  schedule: "immediate" | "daily" | "weekly" | "manual"
}

interface TPEConversionPageProps {
  onNavigate: (page: AppState) => void
  walletData: any
}

export function TPEConversionPage({ onNavigate, walletData }: TPEConversionPageProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("ETH")
  const [conversionAmount, setConversionAmount] = useState("")
  const [conversionRules, setConversionRules] = useState<ConversionRule[]>([])
  const [isConverting, setIsConverting] = useState(false)

  // Soldes simulés des cryptos reçues via TPE
  const [tpeBalances] = useState({
    BTC: "0.00125000",
    ETH: "0.234500",
    USDT: "156.75",
    CHFM: "89.25",
  })

  const cryptoRates = {
    BTC: 43250,
    ETH: 2650,
    USDT: 1.0,
    CHFM: 1.0,
  }

  const cryptos = [
    { symbol: "BTC", name: "Bitcoin", color: "text-orange-600" },
    { symbol: "ETH", name: "Ethereum", color: "text-blue-600" },
    { symbol: "USDT", name: "Tether", color: "text-green-600" },
  ]

  useEffect(() => {
    // Charger les règles de conversion sauvegardées
    const savedRules = localStorage.getItem("tpe-conversion-rules")
    if (savedRules) {
      setConversionRules(JSON.parse(savedRules))
    } else {
      // Règles par défaut
      const defaultRules: ConversionRule[] = [
        {
          id: "1",
          fromCrypto: "ETH",
          toCrypto: "CHFM",
          threshold: 100,
          autoConvert: true,
          schedule: "daily",
        },
        {
          id: "2",
          fromCrypto: "BTC",
          toCrypto: "CHFM",
          threshold: 200,
          autoConvert: false,
          schedule: "manual",
        },
      ]
      setConversionRules(defaultRules)
    }
  }, [])

  const calculateCHFMAmount = (crypto: string, amount: string) => {
    if (!amount || !crypto) return "0.00"
    const cryptoAmount = Number.parseFloat(amount)
    const rate = cryptoRates[crypto as keyof typeof cryptoRates]
    return (cryptoAmount * rate).toFixed(2)
  }

  const handleManualConversion = async () => {
    if (!conversionAmount || Number.parseFloat(conversionAmount) <= 0) return

    setIsConverting(true)

    // Simuler la conversion
    setTimeout(() => {
      const chfmAmount = calculateCHFMAmount(selectedCrypto, conversionAmount)

      // Sauvegarder la conversion
      const conversion = {
        id: Date.now().toString(),
        fromCrypto: selectedCrypto,
        fromAmount: conversionAmount,
        toCrypto: "CHFM",
        toAmount: chfmAmount,
        rate: cryptoRates[selectedCrypto as keyof typeof cryptoRates],
        timestamp: new Date().toISOString(),
        type: "manual",
      }

      const existingConversions = JSON.parse(localStorage.getItem("tpe-conversions") || "[]")
      existingConversions.unshift(conversion)
      localStorage.setItem("tpe-conversions", JSON.stringify(existingConversions))

      // Mettre à jour les stats
      const todayStats = JSON.parse(
        localStorage.getItem("tpe-today-stats") || '{"transactions": 0, "volume": "0.00", "converted": "0.00"}',
      )
      todayStats.converted = (Number.parseFloat(todayStats.converted) + Number.parseFloat(chfmAmount)).toFixed(2)
      localStorage.setItem("tpe-today-stats", JSON.stringify(todayStats))

      setIsConverting(false)
      setConversionAmount("")

      alert(`Conversion réussie ! ${conversionAmount} ${selectedCrypto} → ${chfmAmount} CHFM`)
    }, 2000)
  }

  const toggleAutoConversion = (ruleId: string) => {
    const updatedRules = conversionRules.map((rule) =>
      rule.id === ruleId ? { ...rule, autoConvert: !rule.autoConvert } : rule,
    )
    setConversionRules(updatedRules)
    localStorage.setItem("tpe-conversion-rules", JSON.stringify(updatedRules))
  }

  const updateConversionRule = (ruleId: string, field: string, value: any) => {
    const updatedRules = conversionRules.map((rule) => (rule.id === ruleId ? { ...rule, [field]: value } : rule))
    setConversionRules(updatedRules)
    localStorage.setItem("tpe-conversion-rules", JSON.stringify(updatedRules))
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("tpe")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Conversion CHFM</h1>
          <p className="text-gray-600">Convertir les cryptos reçues en stablecoin CHF</p>
        </div>
      </div>

      {/* Soldes TPE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Soldes TPE disponibles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {cryptos.map((crypto) => {
              const balance = tpeBalances[crypto.symbol as keyof typeof tpeBalances]
              const chfValue = calculateCHFMAmount(crypto.symbol, balance)

              return (
                <div key={crypto.symbol} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{crypto.name}</span>
                    <Badge variant="outline">{crypto.symbol}</Badge>
                  </div>
                  <p className={`text-lg font-bold ${crypto.color}`}>
                    {balance} {crypto.symbol}
                  </p>
                  <p className="text-sm text-gray-600">≈ {chfValue} CHF</p>
                </div>
              )
            })}

            <div className="p-4 border rounded-lg bg-purple-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">CHFM</span>
                <Badge className="bg-purple-100 text-purple-800">Stable</Badge>
              </div>
              <p className="text-lg font-bold text-purple-600">{tpeBalances.CHFM} CHFM</p>
              <p className="text-sm text-gray-600">= {tpeBalances.CHFM} CHF</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion manuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5" />
            <span>Conversion manuelle</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label>Montant</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={conversionAmount}
                onChange={(e) => setConversionAmount(e.target.value)}
              />
            </div>
          </div>

          {conversionAmount && Number.parseFloat(conversionAmount) > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Vous recevrez:</span>
                <span className="font-bold text-purple-600">
                  {calculateCHFMAmount(selectedCrypto, conversionAmount)} CHFM
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Taux: 1 {selectedCrypto} = {cryptoRates[selectedCrypto as keyof typeof cryptoRates].toLocaleString()}{" "}
                CHF
              </p>
            </div>
          )}

          <Button
            onClick={handleManualConversion}
            disabled={!conversionAmount || Number.parseFloat(conversionAmount) <= 0 || isConverting}
            className="w-full"
          >
            {isConverting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Conversion en cours...
              </>
            ) : (
              <>
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Convertir en CHFM
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Règles de conversion automatique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Conversion automatique</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {conversionRules.map((rule) => (
            <div key={rule.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {rule.fromCrypto} → {rule.toCrypto}
                  </h3>
                  <p className="text-sm text-gray-600">Seuil: {rule.threshold} CHF</p>
                </div>
                <Switch checked={rule.autoConvert} onCheckedChange={() => toggleAutoConversion(rule.id)} />
              </div>

              {rule.autoConvert && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Seuil (CHF)</Label>
                    <Input
                      type="number"
                      value={rule.threshold}
                      onChange={(e) => updateConversionRule(rule.id, "threshold", Number.parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fréquence</Label>
                    <Select
                      value={rule.schedule}
                      onValueChange={(value) => updateConversionRule(rule.id, "schedule", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immédiat</SelectItem>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="manual">Manuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Avantages CHFM */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-900">Avantages du CHFM</h3>
              <div className="text-sm text-green-700 mt-2 space-y-1">
                <p>• Stabilité garantie 1:1 avec le Franc Suisse</p>
                <p>• Protection contre la volatilité crypto</p>
                <p>• Conversion instantanée et frais réduits</p>
                <p>• Idéal pour les commerçants</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique des conversions récentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Conversions récentes</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("tpe-history")}>
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ArrowLeftRight className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">ETH → CHFM</p>
                  <p className="text-sm text-gray-600">il y a 2h</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">0.05 ETH</p>
                <p className="text-sm text-green-600">+132.50 CHFM</p>
              </div>
            </div>

            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">Aucune conversion aujourd'hui</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
