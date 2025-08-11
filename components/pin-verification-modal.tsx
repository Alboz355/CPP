"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Shield, AlertCircle, Key, Fingerprint, Loader2 } from 'lucide-react'
import { SecurityManager } from "@/lib/security-manager"
import { PinResetModal } from "./pin-reset-modal"
import { useToast } from "@/hooks/use-toast"
import { verifyPin as verifyHashedPin } from "@/lib/pin-utils"

interface PinVerificationModalProps {
  isOpen: boolean
  onVerified: () => void
  onCancel: () => void
  title: string
  description: string
  reason?: 'initial' | 'tpe' | 'locked'
}

export function PinVerificationModal({ 
  isOpen, 
  onVerified, 
  onCancel, 
  title, 
  description,
  reason = 'initial'
}: PinVerificationModalProps) {
  const [pin, setPin] = useState("")
  const [backupCode, setBackupCode] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [showBackupOption, setShowBackupOption] = useState(false)
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [isBiometricLoading, setIsBiometricLoading] = useState(false)
  const [biometricAttempted, setBiometricAttempted] = useState(false)
  const { toast } = useToast()

  const securityManager = SecurityManager.getInstance()
  const isBiometricEnabled = securityManager.isBiometricEnabled()

  useEffect(() => {
    if (isOpen) {
      setPin("")
      setBackupCode("")
      setError("")
      setShowBackupOption(false)
      setUseBackupCode(false)
      setIsVerifying(false)
      setBiometricAttempted(false)
      
      // Tenter automatiquement l'authentification biométrique si activée
      if (isBiometricEnabled && !biometricAttempted) {
        handleBiometricAuth()
      }
    }
  }, [isOpen, isBiometricEnabled])

  const handleBiometricAuth = async () => {
    if (isBiometricLoading || biometricAttempted) return
    
    setIsBiometricLoading(true)
    setBiometricAttempted(true)
    setError("")

    try {
      const success = await securityManager.authenticateWithBiometrics()
      
      if (success) {
        toast({
          title: "Authentification réussie",
          description: "Authentification biométrique validée",
        })
        onVerified()
        handleClose()
      } else {
        setError("Authentification biométrique échouée. Utilisez votre PIN.")
        toast({
          title: "Échec biométrique",
          description: "Veuillez utiliser votre code PIN",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      setError("Authentification biométrique non disponible. Utilisez votre PIN.")
      toast({
        title: "Erreur biométrique",
        description: "Authentification biométrique non disponible",
        variant: "destructive"
      })
    } finally {
      setIsBiometricLoading(false)
    }
  }

  const handleVerify = async () => {
    if (useBackupCode) {
      if (!backupCode) {
        setError("Veuillez saisir un code de sauvegarde")
        return
      }

      setIsVerifying(true)
      setError("")

      setTimeout(() => {
        if (securityManager.verifyBackupCode(backupCode)) {
          toast({
            title: "Code de sauvegarde valide",
            description: "Authentification réussie",
          })
          onVerified()
          handleClose()
        } else {
          setError("Code de sauvegarde invalide ou déjà utilisé")
        }
        setIsVerifying(false)
      }, 500)
    } else {
      if (!pin) {
        setError("Veuillez saisir votre code PIN")
        return
      }

      if (pin.length !== 4) {
        setError("Le code PIN doit contenir exactement 4 chiffres")
        return
      }

      setIsVerifying(true)
      setError("")

      setTimeout(() => {
        // Vérification sécurisée via WebCrypto
        verifyHashedPin(pin).then((ok) => {
          if (ok) {
          toast({
            title: "PIN correct",
            description: "Authentification réussie",
          })
          onVerified()
          handleClose()
          } else {
          setError("Code PIN incorrect")
          setShowBackupOption(true)
          }
          setIsVerifying(false)
        })
      }, 500)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify()
    }
    if (e.key === "Escape") {
      handleClose()
    }
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setPin(value)
    setError("")
  }

  const handleClose = () => {
    setPin("")
    setBackupCode("")
    setError("")
    setShowBackupOption(false)
    setUseBackupCode(false)
    setIsVerifying(false)
    setIsBiometricLoading(false)
    setBiometricAttempted(false)
    onCancel()
  }

  const handleResetSuccess = () => {
    setShowResetModal(false)
    onVerified()
    handleClose()
  }

  const remainingCodes = securityManager.getRemainingBackupCodes()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999] ios-modal-safe">
        <Card className="w-full max-w-md bg-card dark:bg-card card-ios mx-4" style={{ filter: 'none !important' }}>
          <CardHeader className="ios-header-safe">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-foreground">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 ios-keyboard-safe">
            {/* Authentification biométrique */}
            {isBiometricEnabled && !useBackupCode && (
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Fingerprint className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Authentification biométrique
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {isBiometricLoading ? "Authentification en cours..." : 
                           biometricAttempted ? "Échec - Utilisez votre PIN" : "Recommandée"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBiometricAuth}
                      disabled={isBiometricLoading}
                      className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 btn-ios"
                    >
                      {isBiometricLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Fingerprint className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {biometricAttempted && !isBiometricLoading && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">ou utilisez votre code PIN (4 chiffres)</p>
                  </div>
                )}
              </div>
            )}

            {/* Saisie PIN ou code de sauvegarde */}
            {(!isBiometricEnabled || biometricAttempted || useBackupCode) && (
              <>
                {!useBackupCode ? (
                  <div className="space-y-2">
                    <Label htmlFor="pin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Code PIN (4 chiffres)
                    </Label>
                    <Input
                      id="pin"
                      type="password"
                      value={pin}
                      onChange={handlePinChange}
                      onKeyPress={handleKeyPress}
                      placeholder="••••"
                      className="text-center text-2xl font-mono tracking-[0.5em] h-14 input-ios ios-touch-target"
                      maxLength={4}
                      autoFocus={!isBiometricEnabled}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        {pin.length}/4 chiffres
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="backup-code">Code de sauvegarde</Label>
                    <Input
                      id="backup-code"
                      type="text"
                      value={backupCode}
                      onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                      onKeyPress={handleKeyPress}
                      placeholder="Saisissez un code de sauvegarde"
                      maxLength={6}
                      autoFocus
                      className="text-center text-lg tracking-widest input-ios ios-touch-target"
                    />
                    <p className="text-xs text-muted-foreground">
                      Codes restants : {remainingCodes}
                    </p>
                  </div>
                )}
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

            {showBackupOption && !useBackupCode && remainingCodes > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    PIN oublié ?
                  </p>
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">
                  Vous pouvez utiliser un code de sauvegarde pour réinitialiser votre PIN
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUseBackupCode(true)}
                    className="text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600 btn-ios"
                  >
                    Utiliser un code de sauvegarde
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowResetModal(true)}
                    className="text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600 btn-ios"
                  >
                    Réinitialiser PIN
                  </Button>
                </div>
              </div>
            )}

            {useBackupCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUseBackupCode(false)
                  setBackupCode("")
                  setError("")
                }}
                className="w-full btn-ios ios-touch-target"
              >
                Retour au code PIN
              </Button>
            )}

            {/* Boutons d'action */}
            {(!isBiometricEnabled || biometricAttempted || useBackupCode) && (
              <div className="flex space-x-3 ios-bottom-safe">
                {reason !== 'initial' && (
                  <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent btn-ios ios-touch-target">
                    Annuler
                  </Button>
                )}
                <Button 
                  onClick={handleVerify} 
                  disabled={isVerifying || (!pin && !useBackupCode) || (!backupCode && useBackupCode) || (pin.length !== 4 && !useBackupCode)} 
                  className={`${reason === 'initial' ? "w-full" : "flex-1"} btn-ios ios-touch-target`}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Vérification...
                    </>
                  ) : (
                    "Vérifier"
                  )}
                </Button>
              </div>
            )}

            {/* Message d'attente biométrique */}
            {isBiometricLoading && (
              <div className="text-center py-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-muted-foreground">
                  Authentification biométrique en cours...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showResetModal && (
        <PinResetModal
          isOpen={showResetModal}
          onPinReset={handleResetSuccess}
          onCancel={() => setShowResetModal(false)}
        />
      )}
    </>
  )
}
