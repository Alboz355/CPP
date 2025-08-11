"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Shield, AlertCircle, CheckCircle, Key } from 'lucide-react'
import { SecurityManager } from "@/lib/security-manager"
import { resetPin as resetHashedPin } from "@/lib/pin-utils"

interface PinResetModalProps {
  isOpen: boolean
  onPinReset: (newPin: string) => void
  onCancel: () => void
}

export function PinResetModal({ isOpen, onPinReset, onCancel }: PinResetModalProps) {
  const [backupCode, setBackupCode] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const [isResetting, setIsResetting] = useState(false)
  const [step, setStep] = useState<'backup' | 'newpin'>('backup')

  if (!isOpen) return null

  const securityManager = SecurityManager.getInstance()
  const remainingCodes = securityManager.getRemainingBackupCodes()

  const handleBackupCodeVerification = async () => {
    if (!backupCode) {
      setError("Veuillez saisir un code de sauvegarde")
      return
    }

    setIsResetting(true)
    setError("")

    setTimeout(() => {
      if (securityManager.verifyBackupCode(backupCode)) {
        setStep('newpin')
        setError("")
      } else {
        setError("Code de sauvegarde invalide ou déjà utilisé")
      }
      setIsResetting(false)
    }, 500)
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

  const handlePinReset = async () => {
    setError("")

    if (newPin.length !== 4) {
      setError("Le nouveau PIN doit contenir exactement 4 chiffres")
      return
    }

    if (newPin !== confirmPin) {
      setError("Les PINs ne correspondent pas")
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

    setIsResetting(true)

    setTimeout(() => {
      // Sauvegarder le nouveau PIN
      resetHashedPin(newPin)
      onPinReset(newPin)
      setIsResetting(false)
    }, 500)
  }

  const handleClose = () => {
    setBackupCode("")
    setNewPin("")
    setConfirmPin("")
    setError("")
    setStep('backup')
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[10000]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center">
                <Key className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Réinitialiser le PIN</CardTitle>
                <CardDescription>
                  {step === 'backup' ? 'Vérifiez votre identité avec un code de sauvegarde' : 'Créez un nouveau PIN de 4 chiffres'}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'backup' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="backup-code">Code de sauvegarde</Label>
                <Input
                  id="backup-code"
                  type="text"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  placeholder="Saisissez un code de sauvegarde"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
                <p className="text-xs text-muted-foreground">
                  Codes restants : {remainingCodes}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <p className="font-medium">Important :</p>
                    <p>Utilisez un de vos codes de sauvegarde pour réinitialiser votre PIN. Une fois utilisé, le code ne pourra plus être réutilisé.</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBackupCodeVerification}
                disabled={isResetting || !backupCode}
                className="w-full"
              >
                {isResetting ? "Vérification..." : "Vérifier le code"}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="new-pin">Nouveau PIN (4 chiffres)</Label>
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
                <Button variant="outline" onClick={() => setStep('backup')} className="flex-1">
                  Retour
                </Button>
                <Button
                  onClick={handlePinReset}
                  disabled={isResetting || newPin.length !== 4 || confirmPin.length !== 4}
                  className="flex-1"
                >
                  {isResetting ? "Réinitialisation..." : "Réinitialiser PIN"}
                </Button>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
