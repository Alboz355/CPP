"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Store, Wallet, Shield, Zap, Globe } from 'lucide-react'
import { useLanguage } from "@/contexts/language-context"
import type { UserType } from "@/components/onboarding-page"

interface UserTypeSelectionProps {
  onUserTypeSelected: (userType: UserType) => void
}

export function UserTypeSelection({ onUserTypeSelected }: UserTypeSelectionProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 ios-safe-area">
      <div className="w-full max-w-6xl ios-content-safe">
        {/* Header */}
        <div className="text-center mb-12 ios-header-safe">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.onboarding.title}
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.onboarding.subtitle}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Badge variant="outline" className="bg-white/70 dark:bg-gray-800/70">
              🇨🇭 Développé en Suisse
            </Badge>
            <Badge variant="outline" className="bg-white/70 dark:bg-gray-800/70">
              🔒 Sécurisé
            </Badge>
            <Badge variant="outline" className="bg-white/70 dark:bg-gray-800/70">
              ⚡ Rapide
            </Badge>
          </div>
        </div>

        {/* User Type Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-100">
            {t.onboarding.userTypeSelection.title}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            {t.onboarding.userTypeSelection.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-105 card-ios">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-gray-800 dark:text-gray-100">
                {t.onboarding.userTypeSelection.client.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {t.onboarding.userTypeSelection.client.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>Portefeuille personnel sécurisé</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span>Transactions rapides et simples</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span>Support multi-cryptomonnaies</span>
                </div>
              </div>

              <Button
                onClick={() => onUserTypeSelected("client")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 btn-ios ios-touch-target"
              >
                <User className="h-5 w-5 mr-2" />
                Choisir ce profil
              </Button>
            </CardContent>
          </Card>

          {/* Merchant Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-105 card-ios">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Store className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl text-gray-800 dark:text-gray-100">
                {t.onboarding.userTypeSelection.merchant.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {t.onboarding.userTypeSelection.merchant.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <span>Terminal de paiement intégré</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span>Accepter les paiements crypto</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Globe className="h-4 w-4 text-purple-500" />
                  <span>Gestion des ventes et statistiques</span>
                </div>
              </div>

              <Button
                onClick={() => onUserTypeSelected("merchant")}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 btn-ios ios-touch-target"
              >
                <Store className="h-5 w-5 mr-2" />
                Choisir ce profil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400 ios-bottom-safe">
          <p>🔒 Vos données restent privées et sécurisées sur votre appareil</p>
        </div>
      </div>
    </div>
  )
}
