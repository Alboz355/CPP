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
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Professionnel */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#007AFF] shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-[#000000] dark:text-[#FFFFFF] mb-3">
            Sécuriser votre portefeuille
          </h1>
          <p className="text-[#8E8E93] text-base leading-relaxed">
            Créez un code PIN à 4 chiffres pour protéger l'accès à votre portefeuille crypto
          </p>
        </div>

        {/* Main Card Style Apple */}
        <Card className="bg-[#FFFFFF] dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#38383A] rounded-3xl shadow-sm overflow-hidden">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl font-semibold text-[#000000] dark:text-[#FFFFFF] flex items-center justify-center gap-3">
              <Lock className="h-6 w-6 text-[#007AFF]" />
              Configuration du PIN
            </CardTitle>
            <CardDescription className="text-[#8E8E93] text-base mt-2">
              Choisissez un code PIN sécurisé de 4 chiffres
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* PIN Input */}
              <div className="space-y-4">
                <Label htmlFor="pin" className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">
                  Nouveau PIN (4 chiffres)
                </Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={handlePinChange}
                    placeholder="••••"
                    className="text-center text-3xl font-mono tracking-[1em] h-16 bg-[#F2F2F7] dark:bg-[#2C2C2E] border-0 rounded-2xl text-[#000000] dark:text-[#FFFFFF] focus:ring-2 focus:ring-[#007AFF] focus:bg-[#FFFFFF] dark:focus:bg-[#1C1C1E]"
                    maxLength={4}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-[#E5E5EA] dark:hover:bg-[#2C2C2E] rounded-xl"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="h-5 w-5 text-[#8E8E93]" /> : <Eye className="h-5 w-5 text-[#8E8E93]" />}
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-3 min-h-[24px]">
                  {pin.length > 0 && (
                    <>
                      {isPinValid ? (
                        <CheckCircle className="h-4 w-4 text-[#34C759]" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-[#FF9500]" />
                      )}
                      <span className={`text-sm font-medium ${isPinValid ? "text-[#34C759]" : "text-[#FF9500]"}`}>
                        {isPinValid ? "PIN valide" : validatePin(pin)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Confirm PIN Input */}
              <div className="space-y-4">
                <Label htmlFor="confirmPin" className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">
                  Confirmer le PIN
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPin"
                    type={showPin ? "text" : "password"}
                    value={confirmPin}
                    onChange={handleConfirmPinChange}
                    placeholder="••••"
                    className="text-center text-3xl font-mono tracking-[1em] h-16 bg-[#F2F2F7] dark:bg-[#2C2C2E] border-0 rounded-2xl text-[#000000] dark:text-[#FFFFFF] focus:ring-2 focus:ring-[#007AFF] focus:bg-[#FFFFFF] dark:focus:bg-[#1C1C1E]"
                    maxLength={4}
                  />
                </div>
                <div className="flex items-center justify-center gap-3 min-h-[24px]">
                  {confirmPin.length > 0 && (
                    <>
                      {isPinMatching ? (
                        <CheckCircle className="h-4 w-4 text-[#34C759]" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-[#FF3B30]" />
                      )}
                      <span className={`text-sm font-medium ${isPinMatching ? "text-[#34C759]" : "text-[#FF3B30]"}`}>
                        {isPinMatching ? "PINs identiques" : "Les PINs ne correspondent pas"}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Security Tips */}
              <div className="p-6 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-[#E5E5EA] dark:border-[#38383A]">
                <h4 className="font-semibold text-[#000000] dark:text-[#FFFFFF] mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#007AFF]" />
                  Conseils de sécurité
                </h4>
                <ul className="text-sm text-[#8E8E93] space-y-2 leading-relaxed">
                  <li>• Utilisez un PIN unique de 4 chiffres</li>
                  <li>• Évitez les séquences simples (1234, 0000)</li>
                  <li>• Ne partagez jamais votre PIN</li>
                  <li>• Mémorisez-le plutôt que de l'écrire</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isPinValid || !isPinMatching || isCreating}
                className="w-full h-14 text-base font-semibold bg-[#007AFF] hover:bg-[#0051D5] disabled:bg-[#E5E5EA] disabled:text-[#8E8E93] text-white rounded-2xl transition-all duration-200 shadow-sm disabled:shadow-none"
              >
                {isCreating ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Configuration en cours...
                  </div>
                ) : (
                  "Sécuriser mon portefeuille"
                )}
              </Button>
            </form>

            {/* Error Message */}
            {error && (
              <Alert className="mt-6 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-2xl">
                <AlertTriangle className="h-4 w-4 text-[#FF3B30]" />
                <AlertDescription className="text-[#FF3B30] font-medium">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#8E8E93] flex items-center justify-center gap-2">
            <Shield className="h-3 w-3" />
            Votre PIN est stocké localement et chiffré sur votre appareil
          </p>
        </div>
      </div>
    </div>
  )
}
