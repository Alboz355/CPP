"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StandardizedHeader } from "@/components/standardized-header"
import {
  CreditCard,
  Search,
  Calculator,
  ArrowLeftRight,
  History,
  Wifi,
  WifiOff,
  TrendingUp,
  Euro,
  Clock,
} from "lucide-react"
import type { AppState } from "@/app/page"
import { useState, useEffect } from "react"

interface TPEMainPageProps {
  onNavigate: (page: AppState) => void
  walletData: any
}

export function TPEMainPage({ onNavigate, walletData }: TPEMainPageProps) {
  const [tpeConnected, setTpeConnected] = useState(false)
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null)
  const [todayStats, setTodayStats] = useState({
    transactions: 0,
    volume: "0.00",
    converted: "0.00",
  })

  // Simuler la connexion TPE
  useEffect(() => {
    const savedTPE = localStorage.getItem("tpe-device")
    if (savedTPE) {
      setTpeConnected(true)
      setConnectedDevice(JSON.parse(savedTPE).name)
    }

    // Charger les stats du jour
    const savedStats = localStorage.getItem("tpe-today-stats")
    if (savedStats) {
      setTodayStats(JSON.parse(savedStats))
    }
  }, [])

  const quickActions = [
    {
      title: "Rechercher TPE",
      description: "Scanner et connecter un terminal",
      icon: Search,
      action: () => onNavigate("tpe-search"),
      color: "bg-primary",
      disabled: false,
    },
    {
      title: "Nouvelle Facture",
      description: "Créer une facture client",
      icon: Calculator,
      action: () => onNavigate("tpe-billing"),
      color: "bg-green-500 dark:bg-green-600",
      disabled: !tpeConnected,
    },
    {
      title: "Conversion CHFM",
      description: "Convertir en stablecoin CHF",
      icon: ArrowLeftRight,
      action: () => onNavigate("tpe-conversion"),
      color: "bg-purple-500 dark:bg-purple-600",
      disabled: false,
    },
    {
      title: "Historique",
      description: "Transactions et statistiques",
      icon: History,
      action: () => onNavigate("tpe-history"),
      color: "bg-orange-500 dark:bg-orange-600",
      disabled: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <StandardizedHeader
        title="Mode TPE"
        subtitle="Terminal de Paiement Électronique"
        backPage="dashboard"
        onNavigate={onNavigate}
        onSettings={() => onNavigate("tpe-settings")}
      />
      
      <div className="p-4 space-y-6">
        {/* Statut de connexion */}
        <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Statut TPE</span>
            </CardTitle>
            <Badge
              variant={tpeConnected ? "default" : "secondary"}
              className={tpeConnected ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" : ""}
            >
              {tpeConnected ? (
                <div className="flex items-center space-x-1">
                  <Wifi className="h-3 w-3" />
                  <span>Connecté</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <WifiOff className="h-3 w-3" />
                  <span>Déconnecté</span>
                </div>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {tpeConnected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Terminal connecté:</span>
                <span className="font-medium text-foreground">{connectedDevice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type de connexion:</span>
                <Badge variant="outline">Bluetooth</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Statut:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Prêt pour paiements</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Aucun terminal connecté</p>
              <Button onClick={() => onNavigate("tpe-search")} className="bg-primary hover:bg-primary/90">
                <Search className="h-4 w-4 mr-2" />
                Rechercher un TPE
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques du jour */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Aujourd'hui</span>
            <Badge variant="outline" className="ml-2">
              <Clock className="h-3 w-3 mr-1" />
              {new Date().toLocaleDateString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{todayStats.transactions}</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{todayStats.volume} CHF</p>
              <p className="text-sm text-muted-foreground">Volume</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{todayStats.converted} CHFM</p>
              <p className="text-sm text-muted-foreground">Converti</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all hover:shadow-lg ${action.disabled ? "opacity-50" : "hover:scale-105"}`}
            onClick={action.disabled ? undefined : action.action}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                </div>
                {action.disabled && (
                  <Badge variant="secondary" className="text-xs">
                    TPE requis
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions récentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Transactions récentes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("tpe-history")}>
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Exemple de transactions */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Euro className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Paiement reçu</p>
                  <p className="text-sm text-muted-foreground">il y a 2h</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600 dark:text-green-400">+25.50 CHF</p>
                <p className="text-sm text-muted-foreground">ETH → CHFM</p>
              </div>
            </div>

            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">Aucune transaction aujourd'hui</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-accent/50 border-accent">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Mode TPE Professionnel</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Acceptez les paiements crypto via votre terminal physique. Conversion automatique en CHFM pour une
                stabilité maximale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
