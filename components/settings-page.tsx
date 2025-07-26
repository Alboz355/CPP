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

interface SettingsPageProps {
  onNavigate: (page: AppState) => void
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
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
    alert("Redirection vers le changement de PIN")
  }

  const handleDeleteWallet = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce portefeuille ? Cette action est irréversible.")) {
      localStorage.clear()
      alert("Portefeuille supprimé")
      onNavigate("onboarding")
    }
  }

  const handleContactSupport = () => {
    alert(
      "Contactez le support à : support@cryptowallet.com\n\nNote: Le support ne peut pas récupérer les phrases de récupération perdues.",
    )
  }

  return (
    <>
      <div className="min-h-screen p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Paramètres</h1>
        </div>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Sécurité</span>
            </CardTitle>
            <CardDescription>Gérez la sécurité de votre portefeuille</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Authentification biométrique</Label>
                <p className="text-sm text-gray-600">Utilisez votre empreinte ou Face ID</p>
              </div>
              <Switch checked={biometric} onCheckedChange={setBiometric} />
            </div>

            <div className="space-y-2">
              <Label>Verrouillage automatique</Label>
              <Select value={autoLock} onValueChange={setAutoLock}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="never">Jamais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={handleChangePin} className="w-full bg-transparent">
              <Key className="h-4 w-4 mr-2" />
              Changer le PIN
            </Button>
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
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Notifications push</Label>
                <p className="text-sm text-gray-600">Recevez des alertes pour les transactions</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Général</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Devise par défaut</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Langue</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Gestion du portefeuille</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!seedPhraseShown ? (
              <Button variant="outline" onClick={handleShowSeedPhrase} className="w-full bg-transparent">
                <Shield className="h-4 w-4 mr-2" />
                Afficher la phrase de récupération (1 fois seulement)
              </Button>
            ) : (
              <div className="rounded-lg bg-gray-50 p-4 border">
                <div className="flex items-start space-x-2">
                  <HelpCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Phrase de récupération non disponible</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Votre phrase de récupération a déjà été affichée une fois pour des raisons de sécurité.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleContactSupport}
                      className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-700"
                    >
                      Contactez le support si nécessaire
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Zone dangereuse</p>
                  <p className="text-sm text-red-700 mt-1">
                    La suppression du portefeuille est irréversible. Assurez-vous d'avoir sauvegardé votre phrase de
                    récupération.
                  </p>
                  <Button variant="destructive" size="sm" onClick={handleDeleteWallet} className="mt-3">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer le portefeuille
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">CryptoWallet App</p>
              <p className="text-xs text-gray-500">Version 1.0.0</p>
              <p className="text-xs text-gray-500">© 2024 - Tous droits réservés</p>
            </div>
          </CardContent>
        </Card>
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
