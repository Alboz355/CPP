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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Bell, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Trash2 } from "lucide-react"

interface PriceAlertModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PriceAlert {
  id: string
  crypto: string
  cryptoName: string
  type: "above" | "below"
  targetPrice: number
  currentPrice: number
  isActive: boolean
  createdAt: Date
  triggered?: boolean
}

const cryptoOptions = [
  { value: "bitcoin", label: "Bitcoin", symbol: "BTC", currentPrice: 42000, icon: "₿" },
  { value: "ethereum", label: "Ethereum", symbol: "ETH", currentPrice: 2500, icon: "Ξ" },
  { value: "algorand", label: "Algorand", symbol: "ALGO", currentPrice: 0.18, icon: "Ⱥ" },
]

export function PriceAlertModal({ isOpen, onClose }: PriceAlertModalProps) {
  const [activeTab, setActiveTab] = useState("create")
  const [selectedCrypto, setSelectedCrypto] = useState("")
  const [alertType, setAlertType] = useState<"above" | "below">("above")
  const [targetPrice, setTargetPrice] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: "1",
      crypto: "bitcoin",
      cryptoName: "Bitcoin",
      type: "above",
      targetPrice: 45000,
      currentPrice: 42000,
      isActive: true,
      createdAt: new Date("2024-01-15T10:30:00"),
      triggered: false,
    },
    {
      id: "2",
      crypto: "ethereum",
      cryptoName: "Ethereum",
      type: "below",
      targetPrice: 2300,
      currentPrice: 2500,
      isActive: true,
      createdAt: new Date("2024-01-14T15:20:00"),
      triggered: false,
    },
    {
      id: "3",
      crypto: "algorand",
      cryptoName: "Algorand",
      type: "above",
      targetPrice: 0.2,
      currentPrice: 0.18,
      isActive: false,
      createdAt: new Date("2024-01-13T09:15:00"),
      triggered: true,
    },
  ])

  const selectedCryptoData = cryptoOptions.find((crypto) => crypto.value === selectedCrypto)

  const handleCreateAlert = () => {
    setError("")
    setSuccess("")

    if (!selectedCrypto) {
      setError("Veuillez sélectionner une cryptomonnaie")
      return
    }

    if (!targetPrice || Number.parseFloat(targetPrice) <= 0) {
      setError("Veuillez entrer un prix cible valide")
      return
    }

    const price = Number.parseFloat(targetPrice)
    const currentPrice = selectedCryptoData?.currentPrice || 0

    if (alertType === "above" && price <= currentPrice) {
      setError("Le prix cible doit être supérieur au prix actuel pour une alerte à la hausse")
      return
    }

    if (alertType === "below" && price >= currentPrice) {
      setError("Le prix cible doit être inférieur au prix actuel pour une alerte à la baisse")
      return
    }

    // Créer la nouvelle alerte
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      crypto: selectedCrypto,
      cryptoName: selectedCryptoData?.label || "",
      type: alertType,
      targetPrice: price,
      currentPrice: currentPrice,
      isActive: true,
      createdAt: new Date(),
      triggered: false,
    }

    setAlerts((prev) => [newAlert, ...prev])

    // Demander la permission pour les notifications
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    setSuccess("Alerte créée avec succès !")

    // Reset form
    setSelectedCrypto("")
    setTargetPrice("")
    setAlertType("above")

    // Switch to alerts tab after 2 seconds
    setTimeout(() => {
      setActiveTab("alerts")
      setSuccess("")
    }, 2000)
  }

  const toggleAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert)))
  }

  const deleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const getCryptoIcon = (crypto: string) => {
    const cryptoData = cryptoOptions.find((c) => c.value === crypto)
    return cryptoData?.icon || "₿"
  }

  const formatPrice = (price: number, crypto: string) => {
    if (crypto === "algorand") {
      return `$${price.toFixed(4)}`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center">
            <DialogTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <span>Alertes de Prix</span>
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Créer Alerte</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Mes Alertes ({alerts.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="crypto-select">Cryptomonnaie</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une crypto" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoOptions.map((crypto) => (
                      <SelectItem key={crypto.value} value={crypto.value}>
                        <div className="flex items-center space-x-2">
                          <span>{crypto.icon}</span>
                          <span>{crypto.label}</span>
                          <Badge variant="outline" className="ml-auto">
                            {formatPrice(crypto.currentPrice, crypto.value)}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="alert-type">Type d'alerte</Label>
                <Select value={alertType} onValueChange={(value: "above" | "below") => setAlertType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>Prix au-dessus de</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="below">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span>Prix en-dessous de</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target-price">Prix cible (USD)</Label>
                <Input
                  id="target-price"
                  type="number"
                  placeholder="0.00"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  step={selectedCrypto === "algorand" ? "0.0001" : "1"}
                />
              </div>

              {selectedCryptoData && targetPrice && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Prix actuel:</span>
                    <span className="font-semibold">
                      {formatPrice(selectedCryptoData.currentPrice, selectedCrypto)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Prix cible:</span>
                    <span className="font-semibold">{formatPrice(Number.parseFloat(targetPrice), selectedCrypto)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Différence:</span>
                    <span className={`font-semibold ${alertType === "above" ? "text-green-600" : "text-red-600"}`}>
                      {alertType === "above" ? "+" : "-"}
                      {Math.abs(
                        ((Number.parseFloat(targetPrice) - selectedCryptoData.currentPrice) /
                          selectedCryptoData.currentPrice) *
                          100,
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                </div>
              )}

              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  Vous recevrez une notification lorsque le prix atteindra votre seuil. Assurez-vous d'avoir autorisé
                  les notifications dans votre navigateur.
                </AlertDescription>
              </Alert>
            </div>

            {error && (
              <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-600 dark:text-green-400">{success}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleCreateAlert}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              disabled={!selectedCrypto || !targetPrice}
            >
              Créer l'alerte
            </Button>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4 mt-6">
            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Aucune alerte configurée
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  Créez votre première alerte de prix pour être notifié des mouvements importants
                </p>
                <Button
                  onClick={() => setActiveTab("create")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  Créer une alerte
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Card key={alert.id} className={`${alert.triggered ? "bg-gray-50 dark:bg-gray-800" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {getCryptoIcon(alert.crypto)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{alert.cryptoName}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {alert.type === "above" ? "Au-dessus de" : "En-dessous de"}{" "}
                              {formatPrice(alert.targetPrice, alert.crypto)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              Créée le {alert.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Prix actuel</div>
                            <div className="font-semibold">{formatPrice(alert.currentPrice, alert.crypto)}</div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {alert.triggered ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Déclenchée
                              </Badge>
                            ) : (
                              <Badge
                                className={
                                  alert.isActive
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                }
                              >
                                {alert.isActive ? "Active" : "Inactive"}
                              </Badge>
                            )}

                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={() => toggleAlert(alert.id)}
                              disabled={alert.triggered}
                            />

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAlert(alert.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {alerts.length > 0 && (
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {alerts.filter((a) => a.isActive && !a.triggered).length} alertes actives
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("create")}
                  className="flex items-center space-x-2"
                >
                  <Bell className="h-4 w-4" />
                  <span>Nouvelle alerte</span>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
