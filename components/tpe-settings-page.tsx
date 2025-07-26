"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Settings,
  Store,
  Bell,
  Shield,
  Wifi,
  CreditCard,
  Mail,
  Smartphone,
  Save,
  RotateCcw,
  Calculator,
} from "lucide-react"
import type { AppState } from "@/app/page"

interface TPESettings {
  // Informations commerciales
  businessName: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  taxNumber: string

  // Paramètres de paiement
  defaultCurrency: string
  acceptedCryptos: string[]
  autoConvertThreshold: number
  autoConvertEnabled: boolean

  // Notifications
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean

  // Sécurité
  requirePin: boolean
  sessionTimeout: number

  // TPE
  tpeConnectionType: string
  tpeAutoReconnect: boolean
  tpeSoundEnabled: boolean
}

interface TPESettingsPageProps {
  onNavigate: (page: AppState) => void
}

export function TPESettingsPage({ onNavigate }: TPESettingsPageProps) {
  const [settings, setSettings] = useState<TPESettings>({
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    taxNumber: "",
    defaultCurrency: "CHF",
    acceptedCryptos: ["BTC", "ETH", "USDT"],
    autoConvertThreshold: 100,
    autoConvertEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    requirePin: true,
    sessionTimeout: 15,
    tpeConnectionType: "bluetooth",
    tpeAutoReconnect: true,
    tpeSoundEnabled: true,
  })

  const [hasChanges, setHasChanges] = useState(false)

  const currencies = [
    { code: "CHF", name: "Franc Suisse" },
    { code: "EUR", name: "Euro" },
    { code: "USD", name: "Dollar US" },
  ]

  const cryptos = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "USDT", name: "Tether" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "CHFM", name: "Swiss Franc Token" },
  ]

  useEffect(() => {
    // Charger les paramètres sauvegardés
    const savedSettings = localStorage.getItem("tpe-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSettingChange = (key: keyof TPESettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleCryptoToggle = (crypto: string) => {
    const newAcceptedCryptos = settings.acceptedCryptos.includes(crypto)
      ? settings.acceptedCryptos.filter((c) => c !== crypto)
      : [...settings.acceptedCryptos, crypto]

    handleSettingChange("acceptedCryptos", newAcceptedCryptos)
  }

  const saveSettings = () => {
    localStorage.setItem("tpe-settings", JSON.stringify(settings))
    setHasChanges(false)
    alert("Paramètres sauvegardés avec succès !")
  }

  const resetSettings = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")) {
      localStorage.removeItem("tpe-settings")
      setSettings({
        businessName: "",
        businessAddress: "",
        businessPhone: "",
        businessEmail: "",
        taxNumber: "",
        defaultCurrency: "CHF",
        acceptedCryptos: ["BTC", "ETH", "USDT"],
        autoConvertThreshold: 100,
        autoConvertEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        requirePin: true,
        sessionTimeout: 15,
        tpeConnectionType: "bluetooth",
        tpeAutoReconnect: true,
        tpeSoundEnabled: true,
      })
      setHasChanges(false)
    }
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("tpe")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Paramètres TPE</h1>
            <p className="text-gray-600">Configuration du terminal de paiement</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={saveSettings} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Informations commerciales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <span>Informations commerciales</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nom de l'entreprise</Label>
              <Input
                id="businessName"
                value={settings.businessName}
                onChange={(e) => handleSettingChange("businessName", e.target.value)}
                placeholder="Mon Commerce"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessEmail">Email professionnel</Label>
              <Input
                id="businessEmail"
                type="email"
                value={settings.businessEmail}
                onChange={(e) => handleSettingChange("businessEmail", e.target.value)}
                placeholder="contact@moncommerce.ch"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress">Adresse</Label>
            <Textarea
              id="businessAddress"
              value={settings.businessAddress}
              onChange={(e) => handleSettingChange("businessAddress", e.target.value)}
              placeholder="Rue de la Paix 123, 1000 Lausanne"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Téléphone</Label>
              <Input
                id="businessPhone"
                value={settings.businessPhone}
                onChange={(e) => handleSettingChange("businessPhone", e.target.value)}
                placeholder="+41 21 123 45 67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxNumber">Numéro TVA</Label>
              <Input
                id="taxNumber"
                value={settings.taxNumber}
                onChange={(e) => handleSettingChange("taxNumber", e.target.value)}
                placeholder="CHE-123.456.789"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres de paiement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Paramètres de paiement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Devise par défaut</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) => handleSettingChange("defaultCurrency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Seuil de conversion auto (CHF)</Label>
              <Input
                type="number"
                value={settings.autoConvertThreshold}
                onChange={(e) => handleSettingChange("autoConvertThreshold", Number.parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Conversion automatique en CHFM</Label>
              <p className="text-sm text-gray-600">Convertir automatiquement les cryptos reçues</p>
            </div>
            <Switch
              checked={settings.autoConvertEnabled}
              onCheckedChange={(checked) => handleSettingChange("autoConvertEnabled", checked)}
            />
          </div>

          <div className="space-y-3">
            <Label>Cryptomonnaies acceptées</Label>
            <div className="grid grid-cols-2 gap-3">
              {cryptos.map((crypto) => (
                <div key={crypto.symbol} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={crypto.symbol}
                    checked={settings.acceptedCryptos.includes(crypto.symbol)}
                    onChange={() => handleCryptoToggle(crypto.symbol)}
                    className="rounded"
                  />
                  <Label htmlFor={crypto.symbol} className="text-sm">
                    {crypto.name} ({crypto.symbol})
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={() => onNavigate("tpe-vat")} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Gestion TVA automatique
            </Button>
            <p className="text-sm text-gray-600 mt-2">Configurer le calcul et transfert automatique de la TVA</p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <div>
                <Label className="text-base">Notifications email</Label>
                <p className="text-sm text-gray-600">Recevoir les confirmations par email</p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <div>
                <Label className="text-base">Notifications SMS</Label>
                <p className="text-sm text-gray-600">Recevoir les alertes par SMS</p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <div>
                <Label className="text-base">Notifications push</Label>
                <p className="text-sm text-gray-600">Notifications dans l'application</p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Sécurité</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Exiger un PIN</Label>
              <p className="text-sm text-gray-600">Demander le PIN pour chaque transaction</p>
            </div>
            <Switch
              checked={settings.requirePin}
              onCheckedChange={(checked) => handleSettingChange("requirePin", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Timeout de session (minutes)</Label>
            <Select
              value={settings.sessionTimeout.toString()}
              onValueChange={(value) => handleSettingChange("sessionTimeout", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres TPE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5" />
            <span>Terminal de paiement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Type de connexion préféré</Label>
            <Select
              value={settings.tpeConnectionType}
              onValueChange={(value) => handleSettingChange("tpeConnectionType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bluetooth">Bluetooth</SelectItem>
                <SelectItem value="usb">USB</SelectItem>
                <SelectItem value="wifi">WiFi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Reconnexion automatique</Label>
              <p className="text-sm text-gray-600">Se reconnecter automatiquement au TPE</p>
            </div>
            <Switch
              checked={settings.tpeAutoReconnect}
              onCheckedChange={(checked) => handleSettingChange("tpeAutoReconnect", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Sons du terminal</Label>
              <p className="text-sm text-gray-600">Activer les bips de confirmation</p>
            </div>
            <Switch
              checked={settings.tpeSoundEnabled}
              onCheckedChange={(checked) => handleSettingChange("tpeSoundEnabled", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sauvegarde */}
      {hasChanges && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">Vous avez des modifications non sauvegardées</span>
              </div>
              <Button onClick={saveSettings} className="bg-yellow-600 hover:bg-yellow-700">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
