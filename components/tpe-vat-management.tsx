"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calculator,
  Building,
  CreditCard,
  FileText,
  Download,
  TrendingUp,
  AlertTriangle,
  Settings,
} from "lucide-react"
import type { AppState } from "@/app/page"

interface VATSettings {
  enabled: boolean
  rate: number
  companyName: string
  vatNumber: string
  address: string
  autoTransfer: boolean
  transferAddress: string
  transferNetwork: "Polygon" | "Ethereum" | "BSC"
  transferToken: "USDC" | "USDT" | "DAI"
  minimumAmount: number
  transferFrequency: "immediate" | "daily" | "weekly" | "monthly"
}

interface VATTransaction {
  id: string
  originalTransactionId: string
  amount: number
  vatAmount: number
  vatRate: number
  currency: string
  transferAmount: number
  transferToken: string
  transferNetwork: string
  transferAddress: string
  status: "pending" | "completed" | "failed"
  timestamp: string
}

interface TPEVATManagementProps {
  onNavigate: (page: AppState) => void
}

export function TPEVATManagement({ onNavigate }: TPEVATManagementProps) {
  const [vatSettings, setVATSettings] = useState<VATSettings>({
    enabled: false,
    rate: 7.7, // TVA suisse standard
    companyName: "",
    vatNumber: "",
    address: "",
    autoTransfer: true,
    transferAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C",
    transferNetwork: "Polygon",
    transferToken: "USDC",
    minimumAmount: 10,
    transferFrequency: "daily",
  })

  const [vatTransactions, setVATTransactions] = useState<VATTransaction[]>([])
  const [vatStats, setVATStats] = useState({
    totalCollected: 0,
    totalTransferred: 0,
    pendingTransfer: 0,
    transactionsCount: 0,
  })

  const vatRates = [
    { value: 7.7, label: "7.7% - Taux normal (Suisse)" },
    { value: 2.5, label: "2.5% - Taux réduit (Suisse)" },
    { value: 3.7, label: "3.7% - Taux spécial (Suisse)" },
    { value: 20, label: "20% - TVA France" },
    { value: 19, label: "19% - TVA Allemagne" },
    { value: 21, label: "21% - TVA Belgique" },
  ]

  const networks = [
    { value: "Polygon", label: "Polygon (MATIC)", fees: "Très faibles" },
    { value: "Ethereum", label: "Ethereum", fees: "Variables" },
    { value: "BSC", label: "Binance Smart Chain", fees: "Faibles" },
  ]

  const tokens = [
    { value: "USDC", label: "USD Coin (USDC)" },
    { value: "USDT", label: "Tether (USDT)" },
    { value: "DAI", label: "Dai Stablecoin (DAI)" },
  ]

  useEffect(() => {
    // Charger les paramètres TVA
    const savedSettings = localStorage.getItem("tpe-vat-settings")
    if (savedSettings) {
      setVATSettings(JSON.parse(savedSettings))
    }

    // Charger les transactions TVA
    const savedTransactions = localStorage.getItem("tpe-vat-transfers") || "[]"
    const transactions = JSON.parse(savedTransactions)
    setVATTransactions(transactions)

    // Calculer les statistiques
    calculateVATStats(transactions)
  }, [])

  const calculateVATStats = (transactions: VATTransaction[]) => {
    const stats = transactions.reduce(
      (acc, tx) => {
        acc.totalCollected += tx.vatAmount
        if (tx.status === "completed") {
          acc.totalTransferred += tx.transferAmount
        } else {
          acc.pendingTransfer += tx.transferAmount
        }
        acc.transactionsCount += 1
        return acc
      },
      {
        totalCollected: 0,
        totalTransferred: 0,
        pendingTransfer: 0,
        transactionsCount: 0,
      },
    )

    setVATStats(stats)
  }

  const handleSettingChange = (key: keyof VATSettings, value: any) => {
    const newSettings = { ...vatSettings, [key]: value }
    setVATSettings(newSettings)
    localStorage.setItem("tpe-vat-settings", JSON.stringify(newSettings))
  }

  const testVATTransfer = async () => {
    // Simuler un transfert de test
    const testTransfer: VATTransaction = {
      id: `test-${Date.now()}`,
      originalTransactionId: "test-transaction",
      amount: 100,
      vatAmount: 7.7,
      vatRate: 7.7,
      currency: "CHF",
      transferAmount: 7.7,
      transferToken: vatSettings.transferToken,
      transferNetwork: vatSettings.transferNetwork,
      transferAddress: vatSettings.transferAddress,
      status: "pending",
      timestamp: new Date().toISOString(),
    }

    // Simuler le processus de transfert
    setTimeout(() => {
      testTransfer.status = "completed"
      const updatedTransactions = [testTransfer, ...vatTransactions]
      setVATTransactions(updatedTransactions)
      localStorage.setItem("tpe-vat-transfers", JSON.stringify(updatedTransactions))
      calculateVATStats(updatedTransactions)
      alert("Test de transfert TVA réussi !")
    }, 2000)

    alert("Test de transfert TVA en cours...")
  }

  const exportVATReport = () => {
    const csvContent = [
      ["Date", "Transaction ID", "Montant HT", "TVA", "Taux TVA", "Statut Transfert"].join(","),
      ...vatTransactions.map((tx) =>
        [
          new Date(tx.timestamp).toLocaleDateString(),
          tx.originalTransactionId,
          (tx.amount - tx.vatAmount).toFixed(2),
          tx.vatAmount.toFixed(2),
          `${tx.vatRate}%`,
          tx.status === "completed" ? "Transféré" : "En attente",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rapport-tva-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("tpe-settings")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gestion TVA</h1>
            <p className="text-gray-600">Configuration et suivi automatique de la TVA</p>
          </div>
        </div>
        <Button variant="outline" onClick={exportVATReport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Configuration</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Configuration */}
        <TabsContent value="settings" className="space-y-6">
          {/* Activation TVA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Activation TVA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Gestion automatique de la TVA</Label>
                  <p className="text-sm text-gray-600">
                    Calculer et transférer automatiquement la TVA pour chaque paiement
                  </p>
                </div>
                <Switch
                  checked={vatSettings.enabled}
                  onCheckedChange={(checked) => handleSettingChange("enabled", checked)}
                />
              </div>

              {vatSettings.enabled && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Taux de TVA</Label>
                    <Select
                      value={vatSettings.rate.toString()}
                      onValueChange={(value) => handleSettingChange("rate", Number.parseFloat(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vatRates.map((rate) => (
                          <SelectItem key={rate.value} value={rate.value.toString()}>
                            {rate.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Exemple de calcul:</p>
                        <p>
                          Prix TTC: 100 CHF → TVA ({vatSettings.rate}%):{" "}
                          {((100 * vatSettings.rate) / (100 + vatSettings.rate)).toFixed(2)} CHF
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations entreprise */}
          {vatSettings.enabled && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Informations entreprise</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom de l'entreprise</Label>
                    <Input
                      value={vatSettings.companyName}
                      onChange={(e) => handleSettingChange("companyName", e.target.value)}
                      placeholder="Mon Entreprise SA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Numéro TVA</Label>
                    <Input
                      value={vatSettings.vatNumber}
                      onChange={(e) => handleSettingChange("vatNumber", e.target.value)}
                      placeholder="CHE-123.456.789 TVA"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    value={vatSettings.address}
                    onChange={(e) => handleSettingChange("address", e.target.value)}
                    placeholder="Rue de la Paix 123, 1000 Lausanne"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configuration transfert automatique */}
          {vatSettings.enabled && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Transfert automatique</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Transfert automatique</Label>
                    <p className="text-sm text-gray-600">Transférer automatiquement la TVA vers un compte dédié</p>
                  </div>
                  <Switch
                    checked={vatSettings.autoTransfer}
                    onCheckedChange={(checked) => handleSettingChange("autoTransfer", checked)}
                  />
                </div>

                {vatSettings.autoTransfer && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Réseau blockchain</Label>
                        <Select
                          value={vatSettings.transferNetwork}
                          onValueChange={(value) => handleSettingChange("transferNetwork", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {networks.map((network) => (
                              <SelectItem key={network.value} value={network.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{network.label}</span>
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {network.fees}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Token de transfert</Label>
                        <Select
                          value={vatSettings.transferToken}
                          onValueChange={(value) => handleSettingChange("transferToken", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {tokens.map((token) => (
                              <SelectItem key={token.value} value={token.value}>
                                {token.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Adresse de destination TVA</Label>
                      <Input
                        value={vatSettings.transferAddress}
                        onChange={(e) => handleSettingChange("transferAddress", e.target.value)}
                        placeholder="0x..."
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-600">
                        Adresse {vatSettings.transferNetwork} pour recevoir les transferts TVA automatiques
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Montant minimum (CHF)</Label>
                        <Input
                          type="number"
                          value={vatSettings.minimumAmount}
                          onChange={(e) => handleSettingChange("minimumAmount", Number.parseFloat(e.target.value))}
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fréquence de transfert</Label>
                        <Select
                          value={vatSettings.transferFrequency}
                          onValueChange={(value) => handleSettingChange("transferFrequency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immédiat</SelectItem>
                            <SelectItem value="daily">Quotidien</SelectItem>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="monthly">Mensuel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button onClick={testVATTransfer} variant="outline" className="flex-1 bg-transparent">
                        <Settings className="h-4 w-4 mr-2" />
                        Tester le transfert
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Statistiques */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">TVA collectée</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{vatStats.totalCollected.toFixed(2)} CHF</div>
                <p className="text-sm text-gray-600">{vatStats.transactionsCount} transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">TVA transférée</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {vatStats.totalTransferred.toFixed(2)} {vatSettings.transferToken}
                </div>
                <p className="text-sm text-gray-600">Vers {vatSettings.transferNetwork}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">En attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {vatStats.pendingTransfer.toFixed(2)} {vatSettings.transferToken}
                </div>
                <p className="text-sm text-gray-600">Transfert en cours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Taux effectif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{vatSettings.rate}%</div>
                <p className="text-sm text-gray-600">Taux configuré</p>
              </CardContent>
            </Card>
          </div>

          {/* Graphique simulé */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Évolution TVA (7 derniers jours)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-center space-x-4 bg-gray-50 rounded-lg p-4">
                {[12, 8, 15, 10, 18, 22, 16].map((height, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className="w-8 bg-blue-500 rounded-t" style={{ height: `${height * 3}px` }}></div>
                    <span className="text-xs text-gray-600">
                      {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR", {
                        weekday: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center mt-4">TVA collectée par jour (CHF)</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des transferts TVA</CardTitle>
            </CardHeader>
            <CardContent>
              {vatTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Aucun transfert TVA enregistré</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vatTransactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calculator className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">Transfert TVA</p>
                            <Badge
                              className={
                                tx.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : tx.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {tx.status === "completed" ? "Terminé" : tx.status === "pending" ? "En cours" : "Échoué"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{new Date(tx.timestamp).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Transaction: {tx.originalTransactionId}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">{tx.vatAmount.toFixed(2)} CHF</p>
                        <p className="text-sm text-gray-600">
                          → {tx.transferAmount.toFixed(2)} {tx.transferToken}
                        </p>
                        <p className="text-xs text-gray-500">{tx.transferNetwork}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Avertissement */}
      {vatSettings.enabled && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-900">Important</h3>
                <div className="text-sm text-yellow-700 mt-2 space-y-1">
                  <p>• Cette fonctionnalité facilite la gestion de la TVA mais ne remplace pas un conseil fiscal</p>
                  <p>• Vérifiez la conformité avec la législation locale</p>
                  <p>• Conservez tous les justificatifs pour votre comptabilité</p>
                  <p>• Les transferts automatiques sont irréversibles</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
