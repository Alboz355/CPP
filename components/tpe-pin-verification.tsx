"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import type { AppState } from "@/app/page"
import { SecureStorage } from "@/lib/secure-storage"

interface TPEPinVerificationProps {
  onNavigate: (page: AppState) => void
  onVerificationSuccess: () => void
}

export function TPEPinVerification({ onNavigate, onVerificationSuccess }: TPEPinVerificationProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const maxAttempts = 3

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Get stored PIN from secure storage
      const storedPin = await SecureStorage.getItem("pin")
      
      if (!storedPin) {
        setError("Aucun PIN configuré. Veuillez d'abord configurer un PIN dans les paramètres.")
        setIsLoading(false)
        return
      }

      // Verify PIN
      if (pin === storedPin) {
        // Success - navigate to TPE
        onVerificationSuccess()
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        
        if (newAttempts >= maxAttempts) {
          setError(`PIN incorrect. Trop de tentatives. Retour au tableau de bord.`)
          setTimeout(() => {
            onNavigate("dashboard")
          }, 3000)
        } else {
          setError(`PIN incorrect. ${maxAttempts - newAttempts} tentative(s) restante(s).`)
        }
        setPin("")
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du PIN:", error)
      setError("Erreur lors de la vérification. Veuillez réessayer.")
    }

    setIsLoading(false)
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Only digits
    if (value.length <= 6) { // Max 6 digits
      setPin(value)
      setError("") // Clear error when typing
    }
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>Accès sécurisé</CardTitle>
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Veuillez saisir votre PIN pour accéder au mode TPE
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-center block">
                Code PIN
              </Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={handlePinChange}
                placeholder="••••••"
                className="text-center text-2xl tracking-widest"
                autoFocus
                maxLength={6}
                autoComplete="current-password"
                disabled={isLoading || attempts >= maxAttempts}
              />
              <p className="text-xs text-muted-foreground text-center">
                Saisissez votre PIN de {pin.length > 0 ? pin.length : "4-6"} chiffres
              </p>
            </div>

            {error && (
              <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                attempts >= maxAttempts 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-yellow-50 text-yellow-800"
              }`}>
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <Button
                type="submit"
                disabled={pin.length < 4 || isLoading || attempts >= maxAttempts}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Vérification...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Accéder au TPE</span>
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate("dashboard")}
                className="w-full"
              >
                Annuler
              </Button>
            </div>
          </form>

          {attempts > 0 && attempts < maxAttempts && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800 text-center">
                <strong>Attention:</strong> {maxAttempts - attempts} tentative(s) restante(s)
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">À propos de cette sécurité</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Le mode TPE donne accès aux fonctionnalités commerçant</p>
              <p>• Votre PIN protège contre les accès non autorisés</p>
              <p>• Maximum {maxAttempts} tentatives avant blocage temporaire</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}