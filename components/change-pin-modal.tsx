"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Shield, AlertCircle, CheckCircle } from 'lucide-react'

interface ChangePinModalProps {
  isOpen: boolean
  onPinChanged: (newPin: string) => void
  onCancel: () => void
}

export function ChangePinModal({ isOpen, onPinChanged, onCancel }: ChangePinModalProps) {
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const [isChanging, setIsChanging] = useState(false)

  if (!isOpen) return null

  const handleCurrentPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setCurrentPin(value)
    setError("")
  }

  const handleNewPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setNewPin(value)
    setError("")
  }

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setConfirmPin(value)
    setError("")
  }

  const handleChangePin = async () => {
    setError("")

    // Vérifications
    if (!currentPin || !newPin || !confirmPin) {
      setError("Veuillez remplir tous les champs")
      return
    }

    if (currentPin.length !== 4) {
      setError("Le PIN actuel doit contenir 4 chiffres")
      return
    }

    if (newPin.length !== 4) {
      setError("Le nouveau PIN doit contenir 4 chiffres")
      return
    }

    if (newPin !== confirmPin) {
      setError("Les nouveaux PINs ne correspondent pas")
      return
    }

    if (currentPin === newPin) {
      setError("Le nouveau PIN doit être différent de l'ancien")
      return
    }

    // Vérifier les patterns faibles
    if (/^(\d)\1+$/.test(newPin)) {
      setError("Le PIN ne peut pas être composé du même chiffre répété")
      return
    }

    if (newPin === "1234" || newPin === "0000" || newPin === "1111") {
      setError("Ce PIN est trop simple, choisissez-en un autre")
      return
    }

    setIsChanging(true)

    // Vérifier l'ancien PIN
    setTimeout(() => {
      const storedPin = localStorage.getItem("pin-hash")
      if (storedPin && btoa(currentPin) === storedPin) {
        onPinChanged(newPin)
        setCurrentPin("")
        setNewPin("")
        setConfirmPin("")
      } else {
        setError("Code PIN actuel incorrect")
      }
      setIsChanging(false)
    }, 500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Changer le code PIN</CardTitle>
                <CardDescription>Modifiez votre code PIN de sécurité (4 chiffres)</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-pin">Code PIN actuel</Label>
            <Input
              id="current-pin"
              type="password"
              value={currentPin}
              onChange={handleCurrentPinChange}
              placeholder="••••"
              maxLength={4}
              className="text-center text-xl font-mono tracking-[0.3em]"
            />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {currentPin.length}/4 chiffres
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-pin">Nouveau code PIN</Label>
            <Input
              id="new-pin"
              type="password"
              value={newPin}
              onChange={handleNewPinChange}
              placeholder="••••"
              maxLength={4}
              className="text-center text-xl font-mono tracking-[0.3em]"
            />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {newPin.length}/4 chiffres
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-pin">Confirmer le nouveau PIN</Label>
            <Input
              id="confirm-pin"
              type="password"
              value={confirmPin}
              onChange={handleConfirmPinChange}
              placeholder="••••"
              maxLength={4}
              className="text-center text-xl font-mono tracking-[0.3em]"
            />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {confirmPin.length}/4 chiffres
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium">Conseils pour un PIN sécurisé :</p>
                <ul className="mt-1 space-y-1">
                  <li>• Utilisez exactement 4 chiffres</li>
                  <li>• Évitez les séquences simples (1234, 0000)</li>
                  <li>• Ne partagez jamais votre PIN</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Annuler
            </Button>
            <Button
              onClick={handleChangePin}
              disabled={isChanging || currentPin.length !== 4 || newPin.length !== 4 || confirmPin.length !== 4}
              className="flex-1"
            >
              {isChanging ? "Modification..." : "Changer le PIN"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
