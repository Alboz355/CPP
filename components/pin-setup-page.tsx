"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Lock, Eye, EyeOff } from "lucide-react"

interface PinSetupPageProps {
  onPinCreated: (pin: string) => void
}

export function PinSetupPage({ onPinCreated }: PinSetupPageProps) {
  const [pinLength, setPinLength] = useState("4")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState("")

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, Number.parseInt(pinLength))
    setPin(numericValue)
    setError("")
  }

  const handleConfirmPinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, Number.parseInt(pinLength))
    setConfirmPin(numericValue)
    setError("")
  }

  const handleSubmit = () => {
    if (pin.length !== Number.parseInt(pinLength)) {
      setError(`Le PIN doit contenir ${pinLength} chiffres`)
      return
    }

    if (pin !== confirmPin) {
      setError("Les PINs ne correspondent pas")
      return
    }

    onPinCreated(pin)
  }

  const isValid = pin.length === Number.parseInt(pinLength) && pin === confirmPin

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/20">
      <div className="w-full max-w-md modern-card p-8 scale-in">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="heading-1 mb-2">Créer un PIN</h1>
          <p className="body-text">Sécurisez votre portefeuille avec un code PIN</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleCreatePin(); }} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Longueur du PIN</label>
            <RadioGroup value={pinLength} onValueChange={setPinLength}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="4" />
                <label htmlFor="4" className="text-sm text-foreground">4 chiffres</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="5" />
                <label htmlFor="5" className="text-sm text-foreground">5 chiffres</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6" id="6" />
                <label htmlFor="6" className="text-sm text-foreground">6 chiffres</label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-medium text-foreground">PIN</label>
              <div className="relative">
                <Input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder={`Entrez ${pinLength} chiffres`}
                  maxLength={Number.parseInt(pinLength)}
                  autoComplete="new-password"
                  className="rounded-xl border-border/50 bg-accent/30 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-accent/50 rounded-r-xl"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-pin" className="text-sm font-medium text-foreground">
                Confirmer le PIN
              </label>
              <Input
                id="confirm-pin"
                type={showPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => handleConfirmPinChange(e.target.value)}
                placeholder={`Confirmez ${pinLength} chiffres`}
                maxLength={Number.parseInt(pinLength)}
                autoComplete="new-password"
                className="rounded-xl border-border/50 bg-accent/30"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              {error}
            </div>
          )}

          <div className="rounded-xl bg-blue-500/10 p-4 border border-blue-500/20">
            <div className="text-sm text-blue-500">
              <p className="font-medium">Conseils de sécurité :</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Choisissez un PIN unique</li>
                <li>Ne partagez jamais votre PIN</li>
                <li>Évitez les séquences évidentes (1234, 0000)</li>
              </ul>
            </div>
          </div>

          <button
            type="submit" 
            className="ios-button-primary w-full disabled:opacity-50" 
            disabled={!isValid}
          >
            Créer le PIN
          </button>
        </form>
      </div>
    </div>
  )
}
