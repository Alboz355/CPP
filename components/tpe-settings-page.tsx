"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Settings,
  Printer,
  Wifi,
  Volume2,
  Shield,
  Store,
  Receipt,
  FileText,
  Palette,
  Save,
  RotateCcw,
} from "lucide-react"
import { TPEPrinterTestModal } from "@/components/tpe-printer-test-modal"
import type { AppState } from "@/app/page"

interface TPESettingsPageProps {
  onNavigate: (page: AppState) => void
  onBack: () => void
}

export function TPESettingsPage({ onNavigate, onBack }: TPESettingsPageProps) {
  const [showPrinterTest, setShowPrinterTest] = useState(false)
  const [settings, setSettings] = useState({
    // Informations du commerce
    merchantName: "Crypto Store Lausanne",
    merchantId: "CSL001",
    merchantAddress: "Rue de la Paix 15, 1003 Lausanne",
    merchantPhone: "+41 21 123 45 67",
    merchantEmail: "contact@cryptostore-lausanne.ch",

    // Paramètres de transaction
    autoConfirm: true,
    requireSignature: false,
    maxTransactionAmount: 5000,
    minTransactionAmount: 1,
    defaultCurrency: "CHF",
    taxRate: 7.7,

    // Paramètres d'impression
    printReceipts: true,
    printCustomerCopy: true,
    printMerchantCopy: true,
    receiptHeader: "CRYPTO STORE LAUSANNE",
    receiptFooter: "Merci de votre visite !",
    includeQRCode: true,
    includeLogo: true,
    receiptFormat: "thermal", // thermal ou a4

    // Paramètres audio et notifications
    soundEnabled: true,
    soundVolume: 75,
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,

    // Paramètres de connectivité
    wifiEnabled: true,
    wifiSSID: "CryptoStore_WiFi",
    bluetoothEnabled: false,
    nfcEnabled: true,

    // Paramètres de sécurité
    securityPin: true,
    pinCode: "1234",
    sessionTimeout: 30,
    requirePinForSettings: true,
    requirePinForRefunds: true,

    // Paramètres d'interface
    language: "fr",
    theme: "light",
    fontSize: "medium",
    screenTimeout: 300,

    // Paramètres de sauvegarde
    autoBackup: true,
    backupFrequency: "daily",
    cloudSync: false,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    localStorage.setItem("tpe-settings", JSON.stringify(settings))
    alert("Paramètres sauvegardés avec succès !")
  }

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")) {
      localStorage.removeItem("tpe-settings")
      // Reset to default values
      setSettings({
        merchantName: "Crypto Store Lausanne",
        merchantId: "CSL001",
        merchantAddress: "Rue de la Paix 15, 1003 Lausanne",
        merchantPhone: "+41 21 123 45 67",
        merchantEmail: "contact@cryptostore-lausanne.ch",
        autoConfirm: true,
        requireSignature: false,
        maxTransactionAmount: 5000,
        minTransactionAmount: 1,
        defaultCurrency: "CHF",
        taxRate: 7.7,
        printReceipts: true,
        printCustomerCopy: true,
        printMerchantCopy: true,
        receiptHeader: "CRYPTO STORE LAUSANNE",
        receiptFooter: "Merci de votre visite !",
        includeQRCode: true,
        includeLogo: true,
        receiptFormat: "thermal",
        soundEnabled: true,
        soundVolume: 75,
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        wifiEnabled: true,
        wifiSSID: "CryptoStore_WiFi",
        bluetoothEnabled: false,
        nfcEnabled: true,
        securityPin: true,
        pinCode: "1234",
        sessionTimeout: 30,
        requirePinForSettings: true,
        requirePinForRefunds: true,
        language: "fr",
        theme: "light",
        fontSize: "medium",
        screenTimeout: 300,
        autoBackup: true,
        backupFrequency: "daily",
        cloudSync: false,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Header avec bouton retour */}
      <div className="bg-card dark:bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour au TPE</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Settings className="mr-2 h-6 w-6" />
                Paramètres TPE
              </h1>
              <p className="text-muted-foreground">Configuration complète du terminal de paiement</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline" onClick={handleReset} className="bg-background dark:bg-background">
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <Tabs defaultValue="merchant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-muted dark:bg-muted">
            <TabsTrigger value="merchant">Commerce</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="printing">Impression</TabsTrigger>
            <TabsTrigger value="connectivity">Connectivité</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
          </TabsList>

          {/* Informations du commerce */}
          <TabsContent value="merchant" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Store className="h-5 w-5" />
                  Informations du commerce
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="merchantName">Nom du commerce</Label>
                    <Input
                      id="merchantName"
                      value={settings.merchantName}
                      onChange={(e) => handleSettingChange("merchantName", e.target.value)}
                      className="bg-background dark:bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="merchantId">ID Commerçant</Label>
                    <Input
                      id="merchantId"
                      value={settings.merchantId}
                      onChange={(e) => handleSettingChange("merchantId", e.target.value)}
                      className="bg-background dark:bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="merchantAddress">Adresse</Label>
                  <Textarea
                    id="merchantAddress"
                    value={settings.merchantAddress}
                    onChange={(e) => handleSettingChange("merchantAddress", e.target.value)}
                    className="bg-background dark:bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="merchantPhone">Téléphone</Label>
                    <Input
                      id="merchantPhone"
                      value={settings.merchantPhone}
                      onChange={(e) => handleSettingChange("merchantPhone", e.target.value)}
                      className="bg-background dark:bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="merchantEmail">Email</Label>
                    <Input
                      id="merchantEmail"
                      type="email"
                      value={settings.merchantEmail}
                      onChange={(e) => handleSettingChange("merchantEmail", e.target.value)}
                      className="bg-background dark:bg-background"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paramètres de transaction */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Receipt className="h-5 w-5" />
                  Paramètres de transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Confirmation automatique</Label>
                    <p className="text-sm text-muted-foreground">Confirmer automatiquement les paiements</p>
                  </div>
                  <Switch
                    checked={settings.autoConfirm}
                    onCheckedChange={(checked) => handleSettingChange("autoConfirm", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Signature requise</Label>
                    <p className="text-sm text-muted-foreground">Demander une signature pour les transactions</p>
                  </div>
                  <Switch
                    checked={settings.requireSignature}
                    onCheckedChange={(checked) => handleSettingChange("requireSignature", checked)}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                    <Select
                      value={settings.defaultCurrency}
                      onValueChange={(value) => handleSettingChange("defaultCurrency", value)}
                    >
                      <SelectTrigger className="bg-background dark:bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="USD">Dollar US (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Montant minimum</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      value={settings.minTransactionAmount}
                      onChange={(e) => handleSettingChange("minTransactionAmount", Number(e.target.value))}
                      className="bg-background dark:bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Montant maximum</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      value={settings.maxTransactionAmount}
                      onChange={(e) => handleSettingChange("maxTransactionAmount", Number(e.target.value))}
                      className="bg-background dark:bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Taux de TVA (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) => handleSettingChange("taxRate", Number(e.target.value))}
                    className="bg-background dark:bg-background"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paramètres d'impression */}
          <TabsContent value="printing" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Printer className="h-5 w-5" />
                  Configuration d'impression
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Impression automatique</Label>
                    <p className="text-sm text-muted-foreground">Imprimer automatiquement les reçus</p>
                  </div>
                  <Switch
                    checked={settings.printReceipts}
                    onCheckedChange={(checked) => handleSettingChange("printReceipts", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Copies à imprimer</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="printCustomerCopy"
                        checked={settings.printCustomerCopy}
                        onCheckedChange={(checked) => handleSettingChange("printCustomerCopy", checked)}
                      />
                      <Label htmlFor="printCustomerCopy">Copie client</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="printMerchantCopy"
                        checked={settings.printMerchantCopy}
                        onCheckedChange={(checked) => handleSettingChange("printMerchantCopy", checked)}
                      />
                      <Label htmlFor="printMerchantCopy">Copie commerçant</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiptFormat">Format de reçu</Label>
                    <Select
                      value={settings.receiptFormat}
                      onValueChange={(value) => handleSettingChange("receiptFormat", value)}
                    >
                      <SelectTrigger className="bg-background dark:bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thermal">Ticket thermique (58mm)</SelectItem>
                        <SelectItem value="thermal-wide">Ticket thermique (80mm)</SelectItem>
                        <SelectItem value="a4">Feuille A4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiptHeader">En-tête du reçu</Label>
                    <Input
                      id="receiptHeader"
                      value={settings.receiptHeader}
                      onChange={(e) => handleSettingChange("receiptHeader", e.target.value)}
                      className="bg-background dark:bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiptFooter">Pied de page du reçu</Label>
                    <Textarea
                      id="receiptFooter"
                      value={settings.receiptFooter}
                      onChange={(e) => handleSettingChange("receiptFooter", e.target.value)}
                      className="bg-background dark:bg-background"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Éléments à inclure</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeLogo"
                        checked={settings.includeLogo}
                        onCheckedChange={(checked) => handleSettingChange("includeLogo", checked)}
                      />
                      <Label htmlFor="includeLogo">Logo du commerce</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeQRCode"
                        checked={settings.includeQRCode}
                        onCheckedChange={(checked) => handleSettingChange("includeQRCode", checked)}
                      />
                      <Label htmlFor="includeQRCode">Code QR de vérification</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <Button onClick={() => setShowPrinterTest(true)} className="w-full">
                  <Printer className="h-4 w-4 mr-2" />
                  Tester l'imprimante
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paramètres de connectivité */}
          <TabsContent value="connectivity" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Wifi className="h-5 w-5" />
                  Connectivité et réseau
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Wi-Fi activé</Label>
                    <p className="text-sm text-muted-foreground">Utiliser la connexion Wi-Fi</p>
                  </div>
                  <Switch
                    checked={settings.wifiEnabled}
                    onCheckedChange={(checked) => handleSettingChange("wifiEnabled", checked)}
                  />
                </div>

                {settings.wifiEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="wifiSSID">Réseau Wi-Fi</Label>
                    <Input
                      id="wifiSSID"
                      value={settings.wifiSSID}
                      onChange={(e) => handleSettingChange("wifiSSID", e.target.value)}
                      className="bg-background dark:bg-background"
                    />
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bluetooth activé</Label>
                    <p className="text-sm text-muted-foreground">Connexion Bluetooth pour périphériques</p>
                  </div>
                  <Switch
                    checked={settings.bluetoothEnabled}
                    onCheckedChange={(checked) => handleSettingChange("bluetoothEnabled", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>NFC activé</Label>
                    <p className="text-sm text-muted-foreground">Paiements sans contact NFC</p>
                  </div>
                  <Switch
                    checked={settings.nfcEnabled}
                    onCheckedChange={(checked) => handleSettingChange("nfcEnabled", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Volume2 className="h-5 w-5" />
                  Audio et notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sons activés</Label>
                    <p className="text-sm text-muted-foreground">Jouer des sons pour les événements</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
                  />
                </div>

                {settings.soundEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="soundVolume">Volume ({settings.soundVolume}%)</Label>
                    <Input
                      id="soundVolume"
                      type="range"
                      min="0"
                      max="100"
                      value={settings.soundVolume}
                      onChange={(e) => handleSettingChange("soundVolume", Number(e.target.value))}
                      className="bg-background dark:bg-background"
                    />
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications push</Label>
                    <p className="text-sm text-muted-foreground">Afficher les notifications à l'écran</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications email</Label>
                    <p className="text-sm text-muted-foreground">Envoyer des notifications par email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">Envoyer des notifications par SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paramètres de sécurité */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Shield className="h-5 w-5" />
                  Sécurité et authentification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Code PIN requis</Label>
                    <p className="text-sm text-muted-foreground">Activer la protection par code PIN</p>
                  </div>
                  <Switch
                    checked={settings.securityPin}
                    onCheckedChange={(checked) => handleSettingChange("securityPin", checked)}
                  />
                </div>

                {settings.securityPin && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pinCode">Code PIN (4 chiffres)</Label>
                      <Input
                        id="pinCode"
                        type="password"
                        maxLength={4}
                        value={settings.pinCode}
                        onChange={(e) => handleSettingChange("pinCode", e.target.value)}
                        className="bg-background dark:bg-background"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="requirePinForSettings"
                          checked={settings.requirePinForSettings}
                          onCheckedChange={(checked) => handleSettingChange("requirePinForSettings", checked)}
                        />
                        <Label htmlFor="requirePinForSettings">PIN requis pour les paramètres</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="requirePinForRefunds"
                          checked={settings.requirePinForRefunds}
                          onCheckedChange={(checked) => handleSettingChange("requirePinForRefunds", checked)}
                        />
                        <Label htmlFor="requirePinForRefunds">PIN requis pour les remboursements</Label>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                  <Select
                    value={settings.sessionTimeout.toString()}
                    onValueChange={(value) => handleSettingChange("sessionTimeout", Number(value))}
                  >
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                      <SelectItem value="0">Jamais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paramètres d'interface */}
          <TabsContent value="interface" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Palette className="h-5 w-5" />
                  Interface utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                      <SelectTrigger className="bg-background dark:bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="it">Italiano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Thème</Label>
                    <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                      <SelectTrigger className="bg-background dark:bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Clair</SelectItem>
                        <SelectItem value="dark">Sombre</SelectItem>
                        <SelectItem value="auto">Automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Taille de police</Label>
                    <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange("fontSize", value)}>
                      <SelectTrigger className="bg-background dark:bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Petite</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenTimeout">Mise en veille écran (secondes)</Label>
                    <Select
                      value={settings.screenTimeout.toString()}
                      onValueChange={(value) => handleSettingChange("screenTimeout", Number(value))}
                    >
                      <SelectTrigger className="bg-background dark:bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                        <SelectItem value="600">10 minutes</SelectItem>
                        <SelectItem value="1800">30 minutes</SelectItem>
                        <SelectItem value="0">Jamais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5" />
                  Sauvegarde et synchronisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sauvegarde automatique</Label>
                    <p className="text-sm text-muted-foreground">Sauvegarder automatiquement les données</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
                  />
                </div>

                {settings.autoBackup && (
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                    >
                      <SelectTrigger className="bg-background dark:bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Synchronisation cloud</Label>
                    <p className="text-sm text-muted-foreground">Synchroniser avec le cloud</p>
                  </div>
                  <Switch
                    checked={settings.cloudSync}
                    onCheckedChange={(checked) => handleSettingChange("cloudSync", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TPEPrinterTestModal isOpen={showPrinterTest} onClose={() => setShowPrinterTest(false)} />
    </div>
  )
}
