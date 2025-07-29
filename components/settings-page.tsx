"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Shield, Bell, Globe, Smartphone, Key, Trash2, AlertTriangle, HelpCircle } from "lucide-react"
import type { AppState } from "@/app/page"
import { SeedPhraseModal } from "./seed-phrase-modal"
import { ThemeToggle } from "./theme-toggle"
import { useTheme } from "next-themes"
import { notify } from "@/lib/notifications"
import { SecureStorage } from "@/lib/secure-storage"

interface SettingsPageProps {
  onNavigate: (page: AppState) => void
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(false)
  const [autoLock, setAutoLock] = useState("5")
  const [currency, setCurrency] = useState("USD")
  const [language, setLanguage] = useState("fr")
  const [showSeedModal, setShowSeedModal] = useState(false)

  // Vérifier si la seed phrase a déjà été montrée
  const seedPhraseShown = localStorage.getItem("seedPhraseShown") === "true"

  const handleShowSeedPhrase = () => {
    if (seedPhraseShown) {
      return // Ne rien faire si déjà montrée
    }
    setShowSeedModal(true)
  }

  const handleSeedPhraseConfirmed = () => {
    // La seed phrase a été confirmée comme sauvegardée
    console.log("Seed phrase confirmée comme sauvegardée")
  }

  const handleChangePin = () => {
    notify.info("Redirection vers le changement de PIN", "Cette fonctionnalité sera disponible prochainement")
  }

  const handleDeleteWallet = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce portefeuille ? Cette action est irréversible.")) {
      try {
        localStorage.clear()
        await SecureStorage.clear()
        notify.success("Portefeuille supprimé", "Toutes les données ont été effacées")
        onNavigate("onboarding")
      } catch (error) {
        notify.error("Erreur lors de la suppression", "Certaines données n'ont pas pu être effacées")
      }
    }
  }

  const handleContactSupport = () => {
    notify.info(
      "Support technique",
      "Contactez-nous à : support@cryptowallet.com\n\nNote: Le support ne peut pas récupérer les phrases de récupération perdues."
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        {/* Header moderne */}
        <div className="mobile-header">
          <div className="flex items-center space-x-4 p-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onNavigate("dashboard")}
              className="h-10 w-10 rounded-xl hover:bg-accent/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="heading-2">Paramètres</h1>
          </div>
        </div>

        <div className="mobile-content p-4 space-y-6">
          {/* Thème et Apparence */}
          <div className="modern-card p-6 fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="heading-3">Apparence</h3>
                <p className="caption-text">Personnalisez l'interface</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Thème de l'application</p>
                  <p className="caption-text">Choisissez votre thème préféré</p>
                </div>
                <ThemeToggle />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Devise par défaut</label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="rounded-xl border-border/50 bg-accent/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 bg-card/95 backdrop-blur-md">
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Langue</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="rounded-xl border-border/50 bg-accent/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 bg-card/95 backdrop-blur-md">
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Security Settings avec design moderne */}
          <div className="modern-card p-6 fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="heading-3">Sécurité</h3>
                <p className="caption-text">Gérez la sécurité de votre portefeuille</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
              <div>
                <p className="text-sm font-medium text-foreground">Authentification biométrique</p>
                <p className="caption-text">Utilisez votre empreinte ou Face ID</p>
              </div>
              <Switch 
                checked={biometric} 
                onCheckedChange={setBiometric}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Verrouillage automatique</label>
              <Select value={autoLock} onValueChange={setAutoLock}>
                <SelectTrigger className="rounded-xl border-border/50 bg-accent/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 bg-card/95 backdrop-blur-md">
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="never">Jamais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              onClick={handleChangePin} 
              className="w-full rounded-xl border-border/50 bg-accent/30 hover:bg-accent/50"
            >
              <Key className="h-4 w-4 mr-2" />
              Changer le PIN
            </Button>
            </div>
          </div>

          {/* Notifications avec design moderne */}
          <div className="modern-card p-6 fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="heading-3">Notifications</h3>
                <p className="caption-text">Gérez vos alertes</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
              <div>
                <p className="text-sm font-medium text-foreground">Notifications push</p>
                <p className="caption-text">Recevez des alertes pour les transactions</p>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* Wallet Management avec design moderne */}
          <div className="modern-card p-6 fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="heading-3">Gestion du portefeuille</h3>
                <p className="caption-text">Sauvegarde et récupération</p>
              </div>
            </div>
            
            <div className="space-y-4">
            {!seedPhraseShown ? (
              <Button 
                variant="outline" 
                onClick={handleShowSeedPhrase} 
                className="w-full rounded-xl border-border/50 bg-accent/30 hover:bg-accent/50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Afficher la phrase de récupération (1 fois seulement)
              </Button>
            ) : (
              <div className="rounded-xl bg-accent/30 p-4 border border-border/50">
                <div className="flex items-start space-x-2">
                  <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Phrase de récupération non disponible</p>
                    <p className="caption-text mt-1">
                      Votre phrase de récupération a déjà été affichée une fois pour des raisons de sécurité.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleContactSupport}
                      className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
                    >
                      Contactez le support si nécessaire
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl bg-red-500/10 p-4 border border-red-500/20">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-500">Zone dangereuse</p>
                  <p className="text-sm text-red-500/80 mt-1">
                    La suppression du portefeuille est irréversible. Assurez-vous d'avoir sauvegardé votre phrase de
                    récupération.
                  </p>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDeleteWallet} 
                    className="mt-3 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer le portefeuille
                  </Button>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* App Info avec design moderne */}
          <div className="modern-card p-6 fade-in">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-foreground">CryptoPayPro</p>
              <p className="caption-text">Version 1.0.0</p>
              <p className="caption-text">© 2024 - Tous droits réservés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de seed phrase */}
      <SeedPhraseModal
        isOpen={showSeedModal}
        onClose={() => setShowSeedModal(false)}
        onConfirm={handleSeedPhraseConfirmed}
      />
    </>
  )
}