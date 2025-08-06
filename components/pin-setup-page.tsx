"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, CheckCircle, AlertTriangle, Lock } from 'lucide-react'

interface PinSetupPageProps {
  onPinCreated: (pin: string) => void
}

export function PinSetupPage({ onPinCreated }: PinSetupPageProps) {
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const validatePin = (pinValue: string) => {
    if (pinValue.length !== 4) {
      return "Le PIN doit contenir exactement 4 chiffres"
    }
    if (!/^\d+$/.test(pinValue)) {
      return "Le PIN ne peut contenir que des chiffres"
    }
    // Vérifier les patterns faibles
    if (/^(\d)\1+$/.test(pinValue)) {
      return "Le PIN ne peut pas être composé du même chiffre répété"
    }
    if (pinValue === "1234" || pinValue === "0000" || pinValue === "1111") {
      return "Ce PIN est trop simple, choisissez-en un autre"
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    const pinError = validatePin(pin)
    if (pinError) {
      setError(pinError)
      return
    }

    if (pin !== confirmPin) {
      setError("Les PINs ne correspondent pas")
      return
    }

    setIsCreating(true)

    try {
      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onPinCreated(pin)
    } catch (error) {
      setError("Erreur lors de la création du PIN")
    } finally {
      setIsCreating(false)
    }
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setPin(value)
    setError("")
  }

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setConfirmPin(value)
    setError("")
  }

  const isPinValid = pin.length === 4 && validatePin(pin) === ""
  const isPinMatching = pin === confirmPin && confirmPin.length === 4

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sécuriser votre portefeuille
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Créez un PIN à 4 chiffres pour protéger l'accès à votre portefeuille</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Configuration du PIN
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Choisissez un PIN sécurisé de 4 chiffres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PIN Input */}
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nouveau PIN (4 chiffres)
                </Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={handlePinChange}
                    placeholder="••••"
                    className="pr-12 text-center text-2xl font-mono tracking-[0.5em] h-14"
                    maxLength={4}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {pin.length}/4 chiffres
                  </p>
                </div>
                {pin.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    {isPinValid ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                    )}
                    <span
                      className={
                        isPinValid ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                      }
                    >
                      {isPinValid ? "PIN valide" : validatePin(pin)}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm PIN Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmer le PIN
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPin"
                    type={showPin ? "text" : "password"}
                    value={confirmPin}
                    onChange={handleConfirmPinChange}
                    placeholder="••••"
                    className="pr-12 text-center text-2xl font-mono tracking-[0.5em] h-14"
                    maxLength={4}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {confirmPin.length}/4 chiffres
                  </p>
                </div>
                {confirmPin.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    {isPinMatching ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={
                        isPinMatching ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }
                    >
                      {isPinMatching ? "PINs identiques" : "Les PINs ne correspondent pas"}
                    </span>
                  </div>
                )}
              </div>

              {/* Security Tips */}
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Conseils de sécurité :</h4>
                <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Utilisez un PIN unique de 4 chiffres</li>
                  <li>• Évitez les séquences simples (1234, 0000)</li>
                  <li>• Ne partagez jamais votre PIN avec personne</li>
                  <li>• Mémorisez-le plutôt que de l'écrire</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isPinValid || !isPinMatching || isCreating}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 touch-target"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Configuration en cours...
                  </div>
                ) : (
                  "🔒 Sécuriser mon portefeuille"
                )}
              </Button>
            </form>

            {/* Error Message */}
            {error && (
              <Alert className="mt-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-400">
          <p>🔐 Votre PIN est stocké localement et chiffré sur votre appareil</p>
        </div>
      </div>
    </div>
  )
}
