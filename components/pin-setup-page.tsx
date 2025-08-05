"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Lock, Eye, EyeOff } from "lucide-react"

import { getTranslations, Language } from "@/lib/i18n"

interface PinSetupPageProps {
  onPinCreated: (pin: string) => void
  selectedLanguage: Language
}

export function PinSetupPage({ onPinCreated, selectedLanguage }: PinSetupPageProps) {
  const [pinLength, setPinLength] = useState("4")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState("")

  const t = getTranslations(selectedLanguage.code)

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
      setError(`${t.pinMustContain} ${pinLength} ${pinLength === "1" ? "chiffre" : "chiffres"}`)
      return
    }

    if (pin !== confirmPin) {
      setError(t.pinsDoNotMatch)
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
          <h1 className="heading-1 mb-2">{t.createPin}</h1>
          <p className="body-text">{t.securePinCode}</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">{t.pinLength}</label>
            <RadioGroup value={pinLength} onValueChange={setPinLength}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="4" />
                <label htmlFor="4" className="text-sm text-foreground">{t.digits4}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="5" />
                <label htmlFor="5" className="text-sm text-foreground">{t.digits5}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6" id="6" />
                <label htmlFor="6" className="text-sm text-foreground">{t.digits6}</label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-medium text-foreground">{t.pin}</label>
              <div className="relative">
                <Input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder={`${selectedLanguage.code === 'fr' ? 'Entrez' : selectedLanguage.code === 'es' ? 'Ingrese' : 'Enter'} ${pinLength} ${selectedLanguage.code === 'fr' ? 'chiffres' : selectedLanguage.code === 'es' ? 'dígitos' : 'digits'}`}
                  maxLength={Number.parseInt(pinLength)}
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
                {t.confirmPin}
              </label>
              <Input
                id="confirm-pin"
                type={showPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => handleConfirmPinChange(e.target.value)}
                placeholder={`${selectedLanguage.code === 'fr' ? 'Confirmez' : selectedLanguage.code === 'es' ? 'Confirme' : 'Confirm'} ${pinLength} ${selectedLanguage.code === 'fr' ? 'chiffres' : selectedLanguage.code === 'es' ? 'dígitos' : 'digits'}`}
                maxLength={Number.parseInt(pinLength)}
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
              <p className="font-medium">{t.securityTips}</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>{t.chooseUniquePin}</li>
                <li>{t.neverSharePin}</li>
                <li>{t.avoidObviousSequences}</li>
              </ul>
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            className="ios-button-primary w-full disabled:opacity-50" 
            disabled={!isValid}
          >
            {t.createPinButton}
          </button>
        </div>
      </div>
    </div>
  )
}
