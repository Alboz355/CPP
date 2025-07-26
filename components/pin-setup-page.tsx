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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Créer un PIN</CardTitle>
          <CardDescription>Sécurisez votre portefeuille avec un code PIN</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Longueur du PIN</Label>
            <RadioGroup value={pinLength} onValueChange={setPinLength}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="4" />
                <Label htmlFor="4">4 chiffres</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="5" />
                <Label htmlFor="5">5 chiffres</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6" id="6" />
                <Label htmlFor="6">6 chiffres</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <div className="relative">
                <Input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder={`Entrez ${pinLength} chiffres`}
                  maxLength={Number.parseInt(pinLength)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-pin">Confirmer le PIN</Label>
              <Input
                id="confirm-pin"
                type={showPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => handleConfirmPinChange(e.target.value)}
                placeholder={`Confirmez ${pinLength} chiffres`}
                maxLength={Number.parseInt(pinLength)}
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-sm text-blue-800">
              <p className="font-medium">Conseils de sécurité :</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Choisissez un PIN unique</li>
                <li>Ne partagez jamais votre PIN</li>
                <li>Évitez les séquences évidentes (1234, 0000)</li>
              </ul>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={!isValid}>
            Créer le PIN
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
