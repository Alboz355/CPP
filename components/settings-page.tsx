
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
  const [currency, setCurrency] = useState("USD")
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
    } else {
      // Si pas de préférence sauvegardée, s'assurer que le mode focus est désactivé
      setFocusMode(false)
      document.body.classList.remove('focus-mode')
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
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] ios-content-safe">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Header Ultra-Professionnel */}
        <div className="flex items-center justify-between sticky top-0 bg-[#F2F2F7]/95 dark:bg-[#000000]/95 backdrop-blur-xl z-20 py-6 px-6 rounded-2xl ios-header-safe shadow-sm border border-[#E5E5EA]/50 dark:border-[#38383A]/50">
          <Button variant="ghost" onClick={() => onNavigate("dashboard")} className="hover:bg-[#E5E5EA] dark:hover:bg-[#1C1C1E] rounded-xl h-11 px-4 transition-all duration-200">
            <ArrowLeft className="h-5 w-5 mr-2 text-[#007AFF]" />
            <span className="font-medium text-[#007AFF]">{t.common.back}</span>
          </Button>
          <div className="text-center flex-1 px-8">
            <h1 className="text-3xl font-semibold text-[#000000] dark:text-[#FFFFFF] mb-1">
              {t.settings.title}
            </h1>
            <p className="text-sm text-[#8E8E93]">Configuration et personnalisation avancées</p>
          </div>
          <div className="w-20" />
        </div>

        {/* Navigation Tabs Style Apple */}
        <Tabs defaultValue="general" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-[#FFFFFF] dark:bg-[#1C1C1E] backdrop-blur-xl border border-[#E5E5EA] dark:border-[#38383A] shadow-lg rounded-2xl p-2 grid grid-cols-4 w-full max-w-5xl">
              <TabsTrigger 
                value="general" 
                className="!flex !items-center !justify-center !h-[50px] !px-3 !py-0 !leading-none data-[state=active]:bg-[#007AFF] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#8E8E93] rounded-xl font-medium text-sm transition-all duration-300 gap-1.5"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Palette className="h-3.5 w-3.5" />
                  <span>{t.settings.tabs.general}</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="!flex !items-center !justify-center !h-[50px] !px-3 !py-0 !leading-none data-[state=active]:bg-[#007AFF] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#8E8E93] rounded-xl font-medium text-sm transition-all duration-300 gap-1.5"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  <span>{t.settings.tabs.security}</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="!flex !items-center !justify-center !h-[50px] !px-3 !py-0 !leading-none data-[state=active]:bg-[#007AFF] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#8E8E93] rounded-xl font-medium text-sm transition-all duration-300 gap-1.5"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Bell className="h-3.5 w-3.5" />
                  <span>{t.settings.tabs.notifications}</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="!flex !items-center !justify-center !h-[50px] !px-3 !py-0 !leading-none data-[state=active]:bg-[#007AFF] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#8E8E93] rounded-xl font-medium text-sm transition-all duration-300 gap-1.5"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>{t.settings.tabs.advanced}</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Apparence */}
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <Palette className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Apparence
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Thème</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Choisissez votre apparence préférée</p>
                    </div>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-40 h-11 bg-[#F2F2F7] dark:bg-[#2C2C2E] border-0 rounded-xl text-[#007AFF]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#E5E5EA] dark:border-[#38383A] bg-[#FFFFFF] dark:bg-[#1C1C1E]">
                        <SelectItem value="light" className="rounded-lg">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            <span>Clair</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark" className="rounded-lg">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            <span>Sombre</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="system" className="rounded-lg">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            <span>Système</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />

                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Mode automatique</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Basculement selon l'heure (19h-7h)</p>
                    </div>
                    <Switch
                      checked={securitySettings.autoThemeEnabled}
                      onCheckedChange={(checked) => handleSecuritySettingsChange({ autoThemeEnabled: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Devise */}
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <DollarSign className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Devise
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Devise principale</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Affichage des prix et montants</p>
                    </div>
                    <Select value={currency} onValueChange={(value) => {
                      setCurrency(value)
                      localStorage.setItem("currency", value)
                      saveSettings()
                      toast({
                        title: "Devise mise à jour",
                        description: `Les prix seront affichés en ${value}`,
                      })
                    }}>
                      <SelectTrigger className="w-40 h-11 bg-[#F2F2F7] dark:bg-[#2C2C2E] border-0 rounded-xl text-[#007AFF]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#E5E5EA] dark:border-[#38383A] bg-[#FFFFFF] dark:bg-[#1C1C1E]">
                        <SelectItem value="USD" className="rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇺🇸</span>
                            <div className="flex flex-col">
                              <span className="font-medium">Dollar US</span>
                              <span className="text-xs text-[#8E8E93]">USD ($)</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="EUR" className="rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇪🇺</span>
                            <div className="flex flex-col">
                              <span className="font-medium">Euro</span>
                              <span className="text-xs text-[#8E8E93]">EUR (€)</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="CHF" className="rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇨🇭</span>
                            <div className="flex flex-col">
                              <span className="font-medium">Franc Suisse</span>
                              <span className="text-xs text-[#8E8E93]">CHF</span>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Mode Focus */}
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <Eye className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Mode Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Masquer les montants</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Protection de la confidentialité</p>
                    </div>
                    <Switch
                      checked={focusMode}
                      onCheckedChange={handleFocusModeChange}
                    />
                  </div>
                  {focusMode && (
                    <>
                      <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                      <div className="flex items-center gap-3 py-3">
                        <div className="p-2 bg-[#34C759]/10 rounded-lg">
                          <EyeOff className="h-4 w-4 text-[#34C759]" />
                        </div>
                        <p className="text-sm font-medium text-[#000000] dark:text-[#FFFFFF]">
                          Mode Focus activé
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <Zap className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Animations fluides</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Transitions entre les pages</p>
                    </div>
                    <Switch
                      checked={pageTransitions}
                      onCheckedChange={handlePageTransitionsChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Langue */}
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <Globe className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Langue
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Interface</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Langue d'affichage</p>
                    </div>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-40 h-11 bg-[#F2F2F7] dark:bg-[#2C2C2E] border-0 rounded-xl text-[#007AFF]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#E5E5EA] dark:border-[#38383A] bg-[#FFFFFF] dark:bg-[#1C1C1E]">
                        <SelectItem value="fr" className="rounded-lg">🇫🇷 Français</SelectItem>
                        <SelectItem value="en" className="rounded-lg">🇬🇧 English</SelectItem>
                        <SelectItem value="de" className="rounded-lg">🇩🇪 Deutsch</SelectItem>
                        <SelectItem value="it" className="rounded-lg">🇮🇹 Italiano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sécurité Avancée */}
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <Shield className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Sécurité Avancée
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Verrouillage automatique</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Verrouille l'application après inactivité</p>
                    </div>
                    <Switch 
                      checked={securitySettings.autoLockEnabled} 
                      onCheckedChange={(checked) => handleSecuritySettingsChange({ autoLockEnabled: checked })}
                    />
                  </div>
                  
                  <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Floutage d'écran</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Floute l'écran lors du changement d'app</p>
                    </div>
                    <Switch 
                      checked={securitySettings.blurOnInactive} 
                      onCheckedChange={(checked) => handleSecuritySettingsChange({ blurOnInactive: checked })}
                    />
                  </div>
                  
                  {securitySettings.autoLockEnabled && (
                    <>
                      <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                      <div className="py-3">
                        <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF] mb-3 block">Délai de verrouillage</Label>
                        <Select 
                          value={securitySettings.autoLockTime.toString()} 
                          onValueChange={(value) => handleSecuritySettingsChange({ autoLockTime: parseInt(value) })}
                        >
                          <SelectTrigger className="w-40 h-11 bg-[#F2F2F7] dark:bg-[#2C2C2E] border-0 rounded-xl text-[#007AFF]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-[#E5E5EA] dark:border-[#38383A] bg-[#FFFFFF] dark:bg-[#1C1C1E]">
                            <SelectItem value="1" className="rounded-lg">1 minute</SelectItem>
                            <SelectItem value="5" className="rounded-lg">5 minutes</SelectItem>
                            <SelectItem value="10" className="rounded-lg">10 minutes</SelectItem>
                            <SelectItem value="30" className="rounded-lg">30 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Authentification */}
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <Fingerprint className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Authentification
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1 pr-4">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Biométrie</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Empreinte digitale / Face ID</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowBiometricSetup(true)} 
                      className="min-w-[120px] bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl text-[#007AFF] font-medium"
                    >
                      <Fingerprint className="mr-2 h-4 w-4" />
                      {securitySettings.biometricEnabled ? 'Configuré' : 'Configurer'}
                    </Button>
                  </div>
                  
                  <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1 pr-4">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Codes de sauvegarde</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">
                        {remainingBackupCodes > 0 ? `${remainingBackupCodes} codes restants` : 'Générer des codes d\'urgence'}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowBackupCodes(true)} 
                      className="min-w-[120px] bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl text-[#007AFF] font-medium"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      {remainingBackupCodes > 0 ? 'Voir codes' : 'Générer'}
                    </Button>
                  </div>
                  
                  <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1 pr-4">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Code PIN</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Modifier votre code de sécurité</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={onChangePinRequest} 
                      className="min-w-[140px] bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl text-[#007AFF] font-medium"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Modifier PIN
                    </Button>
                  </div>
                  
                  <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1 pr-4">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Phrase de récupération</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Afficher votre seed phrase</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={onShowSeedPhrase} 
                      className="min-w-[120px] bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl text-[#007AFF] font-medium"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Voir phrase
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notifications */}
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <Bell className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Alertes de prix</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Variations importantes des cryptomonnaies</p>
                    </div>
                    <Switch
                      checked={notifications.priceAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, priceAlerts: checked })}
                    />
                  </div>
                  
                  <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Transactions</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Confirmations d'envois et réceptions</p>
                    </div>
                    <Switch
                      checked={notifications.transactions}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, transactions: checked })}
                    />
                  </div>
                  
                  <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Sécurité</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Alertes de sécurité importantes</p>
                    </div>
                    <Switch
                      checked={notifications.security}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
                    />
                  </div>
                  
                  <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Marketing</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Promotions et nouveautés</p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sauvegarde et Export */}
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <Download className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Sauvegarde
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Exporter le portefeuille</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Sauvegarder toutes vos données</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={exportWallet} 
                      className="bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl text-[#007AFF] font-medium"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                  
                  <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Sauvegarde des paramètres</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Exporter votre configuration</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={exportBackup} 
                      className="bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl text-[#007AFF] font-medium"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Support - Agrandi */}
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <Mail className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Support & Assistance
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <Label className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">Contacter le support</Label>
                      <p className="text-sm text-[#8E8E93] mt-2">Équipe d'assistance 24/7 disponible</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={onShowSupport} 
                      className="bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl text-[#007AFF] font-medium h-12 px-6"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Support
                    </Button>
                  </div>
                  
                  <Separator className="bg-[#E5E5EA] dark:bg-[#38383A]" />
                  
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <Label className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">Documentation</Label>
                      <p className="text-sm text-[#8E8E93] mt-2">Guide d'utilisation et FAQ</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open('https://docs.cryptowallet.com', '_blank')} 
                      className="bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl text-[#007AFF] font-medium h-12 px-6"
                    >
                      <FileText className="mr-2 h-5 w-5" />
                      Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* TPE Fiscal Reports */}
            {userType === 'merchant' && (
              <Card className="apple-card">
                <CardHeader className="apple-card-header">
                  <CardTitle className="apple-card-title text-center">
                    <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                      <FileText className="h-5 w-5 text-[#007AFF]" />
                    </div>
                    Rapports Fiscaux
                  </CardTitle>
                </CardHeader>
                <CardContent className="apple-card-content">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">Déclarations automatiques</Label>
                      <p className="text-sm text-[#8E8E93] mt-1">Générer vos rapports fiscaux crypto</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => onNavigate("tpe-settings")} 
                      className="bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl text-[#007AFF] font-medium"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Rapports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Zone de Danger */}
            <Card className="apple-card border-[#FF3B30]/20">
              <CardHeader className="apple-card-header">
                <CardTitle className="apple-card-title text-center">
                  <div className="p-2 bg-[#FF3B30]/10 rounded-lg">
                    <Trash2 className="h-5 w-5 text-[#FF3B30]" />
                  </div>
                  Zone de Danger
                </CardTitle>
              </CardHeader>
              <CardContent className="apple-card-content">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex-1">
                        <Label className="text-base font-medium text-[#FF3B30]">Supprimer le portefeuille</Label>
                        <p className="text-sm text-[#8E8E93] mt-1">Effacer définitivement toutes les données</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        className="bg-[#FF3B30] hover:bg-[#D70015] text-white rounded-xl"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#FFFFFF]/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl border-[#FF3B30]/20 rounded-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-[#FF3B30] text-xl font-semibold">Supprimer définitivement le portefeuille</AlertDialogTitle>
                      <AlertDialogDescription className="text-[#8E8E93] text-base">
                        ⚠️ Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                        Assurez-vous d'avoir sauvegardé votre phrase secrète avant de continuer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                      <AlertDialogCancel className="apple-button-outline">Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteWallet} className="bg-[#FF3B30] hover:bg-[#D70015] rounded-xl">
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
