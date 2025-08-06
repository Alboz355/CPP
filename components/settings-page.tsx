"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Shield, Key, Eye, Bell, Palette, Globe, Smartphone, Trash2, Download, Sun, Moon, Monitor, Languages, DollarSign, Zap, Wifi, WifiOff, Upload, Mail, Fingerprint, FileText, EyeOff } from 'lucide-react'
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { AppState } from "@/app/page"
import type { UserType } from "@/components/onboarding-page"
import { SecurityManager } from "@/lib/security-manager"
import { BackupManager } from "@/lib/backup-manager"
import { OfflineManager } from "@/lib/offline-manager"
import { customThemes, applyCustomTheme, removeCustomTheme } from "@/lib/theme-manager"
import { Badge } from "@/components/ui/badge"
import { BackupCodesModal } from "@/components/backup-codes-modal"
import { BiometricSetupModal } from "@/components/biometric-setup-modal"

interface SettingsPageProps {
  onNavigate: (page: AppState) => void
  onChangePinRequest: () => void
  onShowSeedPhrase: () => void
  onShowSupport: () => void
  userType: UserType | null
  onUserTypeChange: (userType: UserType) => void
}

export function SettingsPage({
  onNavigate,
  onChangePinRequest,
  onShowSeedPhrase,
  onShowSupport,
  userType,
  onUserTypeChange,
}: SettingsPageProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    transactions: true,
    security: true,
    marketing: false,
  })
  const [currency, setCurrency] = useState("CHF")
  const [biometrics, setBiometrics] = useState(false)
  const [autoLock, setAutoLock] = useState("5")
  const [pageTransitions, setPageTransitions] = useState(true)

  const [focusMode, setFocusMode] = useState(false)
  const [customTheme, setCustomTheme] = useState("")
  const [securitySettings, setSecuritySettings] = useState({
    autoLockEnabled: true,
    autoLockTime: 5,
    blurOnInactive: true,
    requirePinOnReturn: true,
    biometricEnabled: false,
    autoThemeEnabled: true
  })
  const [isOnline, setIsOnline] = useState(true)
  const [backupHistory, setBackupHistory] = useState<any[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [showBiometricSetup, setShowBiometricSetup] = useState(false)
  const [remainingBackupCodes, setRemainingBackupCodes] = useState(0)

  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage
    const savedNotifications = localStorage.getItem("notifications")
    const savedCurrency = localStorage.getItem("currency")
    const savedBiometrics = localStorage.getItem("biometrics")
    const savedAutoLock = localStorage.getItem("autoLock")
    const savedPageTransitions = localStorage.getItem("pageTransitions")

    if (savedNotifications) setNotifications(JSON.parse(savedNotifications))
    if (savedCurrency) setCurrency(savedCurrency)
    if (savedBiometrics) setBiometrics(JSON.parse(savedBiometrics))
    if (savedAutoLock) setAutoLock(savedAutoLock)
    if (savedPageTransitions !== null) setPageTransitions(JSON.parse(savedPageTransitions))

    // Load focus mode setting
    const savedFocusMode = localStorage.getItem("focus-mode")
    if (savedFocusMode) {
      const focusModeEnabled = JSON.parse(savedFocusMode)
      setFocusMode(focusModeEnabled)
      // Apply focus mode to body immediately
      if (focusModeEnabled) {
        document.body.classList.add('focus-mode')
      } else {
        document.body.classList.remove('focus-mode')
      }
    }

    // Load other settings
    const savedCustomTheme = localStorage.getItem("custom-theme")
    const savedSecuritySettings = localStorage.getItem("security-settings")

    if (savedCustomTheme) setCustomTheme(savedCustomTheme)
    if (savedSecuritySettings) setSecuritySettings(JSON.parse(savedSecuritySettings))

    // Initialize managers
    const securityManager = SecurityManager.getInstance()
    setSecuritySettings(securityManager.getSettings())
    setRemainingBackupCodes(securityManager.getRemainingBackupCodes())

    const offlineManager = OfflineManager.getInstance()
    setIsOnline(offlineManager.isOnlineStatus())

    const backupManager = BackupManager.getInstance()
    setBackupHistory(backupManager.getBackupHistory())

    // Listen for online/offline changes
    const unsubscribe = offlineManager.onStatusChange(setIsOnline)
    return unsubscribe
  }, [])

  // Save page transitions immediately when changed
  const handlePageTransitionsChange = (checked: boolean) => {
    setPageTransitions(checked)
    localStorage.setItem("pageTransitions", JSON.stringify(checked))
    
    toast({
      title: checked ? "Transitions activées" : "Transitions désactivées",
      description: checked ? "Effet de fondu professionnel activé (200ms)" : "Navigation instantanée activée",
    })
  }

  const handleFocusModeChange = (checked: boolean) => {
    setFocusMode(checked)
    localStorage.setItem("focus-mode", JSON.stringify(checked))
    
    // Apply focus mode styles immediately
    if (checked) {
      document.body.classList.add('focus-mode')
    } else {
      document.body.classList.remove('focus-mode')
    }
    
    toast({
      title: checked ? "Mode Focus activé" : "Mode Focus désactivé",
      description: checked ? "Les soldes sont maintenant masqués" : "Les soldes sont maintenant visibles",
    })
  }

  const handleCustomThemeChange = (themeId: string) => {
    const actualThemeId = themeId === "default" ? "" : themeId
    setCustomTheme(actualThemeId)
    localStorage.setItem("custom-theme", actualThemeId)

    if (actualThemeId) {
      applyCustomTheme(actualThemeId)
    } else {
      removeCustomTheme()
    }

    toast({
      title: "Thème appliqué",
      description: actualThemeId ? `Thème ${customThemes.find(t => t.id === actualThemeId)?.name} activé` : "Thème par défaut restauré",
    })
  }

  const handleSecuritySettingsChange = (newSettings: Partial<typeof securitySettings>) => {
    const updated = { ...securitySettings, ...newSettings }
    setSecuritySettings(updated)
    
    const securityManager = SecurityManager.getInstance()
    securityManager.updateSettings(updated)
    
    toast({
      title: "Paramètres de sécurité mis à jour",
      description: "Vos préférences de sécurité ont été sauvegardées",
    })
  }

  const exportBackup = () => {
    const backupManager = BackupManager.getInstance()
    const backupData = backupManager.exportBackup()
    
    const blob = new Blob([backupData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `crypto-wallet-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Sauvegarde exportée",
      description: "Votre sauvegarde a été téléchargée",
    })
  }

  const restoreBackup = (backup: any) => {
    const backupManager = BackupManager.getInstance()
    const success = backupManager.restoreBackup(backup)
    
    if (success) {
      toast({
        title: "Sauvegarde restaurée",
        description: "Vos paramètres ont été restaurés",
      })
      setTimeout(() => window.location.reload(), 2000)
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de restaurer la sauvegarde",
        variant: "destructive"
      })
    }
  }

  const saveSettings = () => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
    localStorage.setItem("currency", currency)
    localStorage.setItem("biometrics", JSON.stringify(biometrics))
    localStorage.setItem("autoLock", autoLock)
    localStorage.setItem("pageTransitions", JSON.stringify(pageTransitions))

    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour",
    })
  }

  const exportWallet = () => {
    const walletData = localStorage.getItem("wallet-data")
    if (walletData) {
      const blob = new Blob([walletData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `wallet-backup-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Sauvegarde exportée",
        description: "Votre portefeuille a été sauvegardé",
      })
    }
  }

  const deleteWallet = () => {
    // Clear all wallet data
    localStorage.removeItem("wallet-data")
    localStorage.removeItem("onboarding-completed")
    localStorage.removeItem("user-type")
    localStorage.removeItem("presentation-seen")
    localStorage.removeItem("pin-hash")
    localStorage.removeItem("notifications")
    localStorage.removeItem("currency")
    localStorage.removeItem("biometrics")
    localStorage.removeItem("autoLock")
    localStorage.removeItem("pageTransitions")
    localStorage.removeItem("focus-mode")
    localStorage.removeItem("custom-theme")
    localStorage.removeItem("security-settings")
    localStorage.removeItem("backup-codes")
    localStorage.removeItem("backup-codes-viewed")

    toast({
      title: "Portefeuille supprimé",
      description: "Toutes les données ont été effacées",
    })

    // Redirect to onboarding after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background ios-content-safe">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-background dark:bg-background z-10 py-2 ios-header-safe">
          <Button variant="ghost" onClick={() => onNavigate("dashboard")} className="bg-background dark:bg-background">
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t.common.back}
          </Button>
          <h1 className="text-2xl font-bold text-foreground">⚙️ {t.settings.title}</h1>
          <div className="w-20" />
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted dark:bg-muted">
            <TabsTrigger value="general">{t.settings.tabs.general}</TabsTrigger>
            <TabsTrigger value="security">{t.settings.tabs.security}</TabsTrigger>
            <TabsTrigger value="notifications">{t.settings.tabs.notifications}</TabsTrigger>
            <TabsTrigger value="advanced">{t.settings.tabs.advanced}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Theme Settings */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  {t.settings.general.appearance}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Thème</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="h-4 w-4 mr-2" />
                          {t.settings.general.theme.light}
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="h-4 w-4 mr-2" />
                          {t.settings.general.theme.dark}
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center">
                          <Monitor className="h-4 w-4 mr-2" />
                          {t.settings.general.theme.system}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Mode sombre automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Basculer automatiquement selon l'heure (19h-7h)
                    </p>
                  </div>
                  <Switch 
                    checked={securitySettings.autoThemeEnabled} 
                    onCheckedChange={(checked) => handleSecuritySettingsChange({ autoThemeEnabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Focus Mode */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  {focusMode ? <EyeOff className="mr-2 h-5 w-5" /> : <Eye className="mr-2 h-5 w-5" />}
                  Mode Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Masquer les soldes</Label>
                    <p className="text-sm text-muted-foreground">
                      Cache temporairement tous les montants sensibles
                    </p>
                  </div>
                  <Switch 
                    checked={focusMode} 
                    onCheckedChange={handleFocusModeChange}
                  />
                </div>
                {focusMode && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      🔒 Mode Focus activé - Les montants sont maintenant floutés pour protéger votre confidentialité
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Animation Settings */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Animations et Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Transitions de pages</Label>
                    <p className="text-sm text-muted-foreground">
                      Effet de fondu professionnel (200ms)
                    </p>
                  </div>
                  <Switch 
                    checked={pageTransitions} 
                    onCheckedChange={handlePageTransitionsChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Désactiver cette option rend la navigation instantanée pour de meilleures performances
                </p>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Languages className="mr-2 h-5 w-5" />
                  {t.settings.general.language}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t.settings.general.language}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="sq">🇦🇱 Shqip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Currency Settings */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  {t.settings.general.currency}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t.settings.general.currency}</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHF">
                        <div className="flex items-center">
                          <span className="mr-2">🇨🇭</span>
                          CHF - Franc Suisse
                        </div>
                      </SelectItem>
                      <SelectItem value="EUR">
                        <div className="flex items-center">
                          <span className="mr-2">🇪🇺</span>
                          EUR - Euro
                        </div>
                      </SelectItem>
                      <SelectItem value="USD">
                        <div className="flex items-center">
                          <span className="mr-2">🇺🇸</span>
                          USD - Dollar US
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Les prix des cryptomonnaies seront affichés dans cette devise
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Profile */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  {t.settings.general.userType}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t.settings.general.userType}</Label>
                  <Select value={userType || ""} onValueChange={(value) => onUserTypeChange(value as UserType)}>
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue placeholder="Sélectionnez votre profil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">👤 Particulier</SelectItem>
                      <SelectItem value="merchant">🏪 Commerçant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Custom Themes */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Thèmes Personnalisés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Thème personnalisé</Label>
                  <Select value={customTheme || "default"} onValueChange={handleCustomThemeChange}>
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue placeholder="Sélectionner un thème" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Thème par défaut</SelectItem>
                      {customThemes.map(theme => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Connection Status */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  {isOnline ? <Wifi className="mr-2 h-5 w-5 text-green-500" /> : <WifiOff className="mr-2 h-5 w-5 text-red-500" />}
                  État de la connexion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={isOnline ? "default" : "destructive"}>
                    {isOnline ? "🟢 En ligne" : "🔴 Hors ligne"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? "Toutes les fonctionnalités sont disponibles" : "Mode hors ligne - données en cache"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button onClick={saveSettings} className="w-full">
              {t.common.save} les paramètres
            </Button>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Enhanced Security Settings */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Sécurité Avancée
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Verrouillage automatique</Label>
                    <p className="text-sm text-muted-foreground">Verrouiller l'app après inactivité</p>
                  </div>
                  <Switch 
                    checked={securitySettings.autoLockEnabled} 
                    onCheckedChange={(checked) => handleSecuritySettingsChange({ autoLockEnabled: checked })}
                  />
                </div>
                
                {securitySettings.autoLockEnabled && (
                  <div className="space-y-2">
                    <Label className="text-foreground">Délai de verrouillage</Label>
                    <Select 
                      value={securitySettings.autoLockTime.toString()} 
                      onValueChange={(value) => handleSecuritySettingsChange({ autoLockTime: parseInt(value) })}
                    >
                      <SelectTrigger className="bg-background dark:bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Flou d'écran</Label>
                    <p className="text-sm text-muted-foreground">Flouter l'écran lors du verrouillage</p>
                  </div>
                  <Switch 
                    checked={securitySettings.blurOnInactive} 
                    onCheckedChange={(checked) => handleSecuritySettingsChange({ blurOnInactive: checked })}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Authentification biométrique</Label>
                    <p className="text-sm text-muted-foreground">Utiliser empreinte/Face ID</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowBiometricSetup(true)} className="bg-background dark:bg-background">
                    <Fingerprint className="mr-2 h-4 w-4" />
                    {securitySettings.biometricEnabled ? 'Configuré' : 'Configurer'}
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Codes de sauvegarde</Label>
                    <p className="text-sm text-muted-foreground">
                      {remainingBackupCodes > 0 ? `${remainingBackupCodes} codes restants` : 'Générer des codes d\'urgence'}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setShowBackupCodes(true)} className="bg-background dark:bg-background">
                    <Key className="mr-2 h-4 w-4" />
                    {remainingBackupCodes > 0 ? 'Voir codes' : 'Générer'}
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">{t.settings.security.pin}</Label>
                    <p className="text-sm text-muted-foreground">Modifier votre code PIN</p>
                  </div>
                  <Button variant="outline" onClick={onChangePinRequest} className="bg-background dark:bg-background">
                    <Key className="mr-2 h-4 w-4" />
                    Changer PIN
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">{t.settings.security.seedPhrase}</Label>
                    <p className="text-sm text-muted-foreground">Afficher votre phrase secrète</p>
                  </div>
                  <Button variant="outline" onClick={onShowSeedPhrase} className="bg-background dark:bg-background">
                    <Eye className="mr-2 h-4 w-4" />
                    Voir phrase
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Notifications */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  {t.settings.tabs.notifications}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Alertes de prix</Label>
                    <p className="text-sm text-muted-foreground">Notifications des variations de prix</p>
                  </div>
                  <Switch
                    checked={notifications.priceAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, priceAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Transactions</Label>
                    <p className="text-sm text-muted-foreground">Confirmations de transactions</p>
                  </div>
                  <Switch
                    checked={notifications.transactions}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, transactions: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Sécurité</Label>
                    <p className="text-sm text-muted-foreground">Alertes de sécurité</p>
                  </div>
                  <Switch
                    checked={notifications.security}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Marketing</Label>
                    <p className="text-sm text-muted-foreground">Offres et promotions</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            {/* Backup and Export */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Sauvegarde et Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Exporter le portefeuille</Label>
                    <p className="text-sm text-muted-foreground">Sauvegarder vos données</p>
                  </div>
                  <Button variant="outline" onClick={exportWallet} className="bg-background dark:bg-background">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Exporter sauvegarde</Label>
                    <p className="text-sm text-muted-foreground">Sauvegarder les paramètres</p>
                  </div>
                  <Button variant="outline" onClick={exportBackup} className="bg-background dark:bg-background">
                    <Upload className="mr-2 h-4 w-4" />
                    Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* TPE Fiscal Reports */}
            {userType === 'merchant' && (
              <Card className="bg-card dark:bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Rapports Fiscaux TPE
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Rapports fiscaux automatiques</Label>
                      <p className="text-sm text-muted-foreground">
                        Générer des déclarations pour vos transactions crypto
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => onNavigate("tpe-fiscal-reports")} className="bg-background dark:bg-background">
                      <FileText className="mr-2 h-4 w-4" />
                      Voir rapports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Support Section */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Support et Assistance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Contacter le support</Label>
                    <p className="text-sm text-muted-foreground">
                      Obtenez de l'aide de notre équipe d'assistance
                    </p>
                  </div>
                  <Button variant="outline" onClick={onShowSupport} className="bg-background dark:bg-background">
                    <Mail className="mr-2 h-4 w-4" />
                    Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-card dark:bg-card border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center text-red-600">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Zone de Danger
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-foreground text-red-600">Supprimer le portefeuille</Label>
                        <p className="text-sm text-muted-foreground">
                          Effacer définitivement toutes les données
                        </p>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-background dark:bg-background">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">Supprimer le portefeuille</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                        Assurez-vous d'avoir sauvegardé votre phrase secrète.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-background dark:bg-background">Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteWallet} className="bg-red-600 hover:bg-red-700">
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <BackupCodesModal 
        isOpen={showBackupCodes} 
        onClose={() => {
          setShowBackupCodes(false)
          setRemainingBackupCodes(SecurityManager.getInstance().getRemainingBackupCodes())
        }} 
      />
      <BiometricSetupModal 
        isOpen={showBiometricSetup} 
        onClose={() => setShowBiometricSetup(false)} 
      />
    </div>
  )
}
