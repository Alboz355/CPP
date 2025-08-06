"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Key, Eye, EyeOff, Shield, CheckCircle, AlertTriangle, Clock, Lock } from "lucide-react"

interface TPEPinChangeModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SecurityLog {
  id: string
  action: string
  timestamp: string
  status: "success" | "warning" | "error"
  details: string
}

export function TPEPinChangeModal({ isOpen, onClose }: TPEPinChangeModalProps) {
  const [step, setStep] = useState<"verify" | "new" | "confirm" | "success">("verify")
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showCurrentPin, setShowCurrentPin] = useState(false)
  const [showNewPin, setShowNewPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([])

  const validateCurrentPin = async () => {
    if (!currentPin) {
      setError("Veuillez saisir votre code PIN actuel")
      return
    }

    setIsProcessing(true)
    setError("")

    // Simulation de vérification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Vérifier avec le PIN stocké (en production, utiliser un hash sécurisé)
    const storedPin = localStorage.getItem("pin-hash")
    const isValid = storedPin === btoa(currentPin)

    if (isValid) {
      addSecurityLog("PIN_VERIFICATION", "success", "Vérification du PIN actuel réussie")
      setStep("new")
    } else {
      setError("Code PIN incorrect")
      addSecurityLog("PIN_VERIFICATION", "error", "Tentative de vérification avec PIN incorrect")
    }

    setIsProcessing(false)
  }

  const validateNewPin = () => {
    if (!newPin) {
      setError("Veuillez saisir un nouveau code PIN")
      return
    }

    if (newPin.length < 4) {
      setError("Le code PIN doit contenir au moins 4 chiffres")
      return
    }

    if (newPin === currentPin) {
      setError("Le nouveau PIN doit être différent de l'ancien")
      return
    }

    // Vérifier la complexité
    if (!/^\d+$/.test(newPin)) {
      setError("Le code PIN ne doit contenir que des chiffres")
      return
    }

    // Vérifier les séquences simples
    const simplePatterns = ["1234", "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"]
    if (simplePatterns.some((pattern) => newPin.includes(pattern))) {
      setError("Évitez les séquences simples comme 1234 ou 0000")
      return
    }

    setError("")
    setStep("confirm")
  }

  const confirmNewPin = async () => {
    if (newPin !== confirmPin) {
      setError("Les codes PIN ne correspondent pas")
      return
    }

    setIsProcessing(true)
    setError("")

    // Simulation de changement
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Sauvegarder le nouveau PIN (en production, utiliser un hash sécurisé)
    localStorage.setItem("pin-hash", btoa(newPin))

    addSecurityLog("PIN_CHANGE", "success", "Code PIN modifié avec succès")
    setStep("success")
    setIsProcessing(false)
  }

  const addSecurityLog = (action: string, status: "success" | "warning" | "error", details: string) => {
    const log: SecurityLog = {
      id: `LOG${Date.now()}`,
      action,
      timestamp: new Date().toISOString(),
      status,
      details,
    }
    setSecurityLogs((prev) => [log, ...prev])
  }

  const resetModal = () => {
    setStep("verify")
    setCurrentPin("")
    setNewPin("")
    setConfirmPin("")
    setError("")
    setShowCurrentPin(false)
    setShowNewPin(false)
    setShowConfirmPin(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const getPinStrength = (pin: string) => {
    if (pin.length < 4) return { strength: 0, label: "Trop court", color: "bg-red-500" }
    if (pin.length < 6) return { strength: 33, label: "Faible", color: "bg-orange-500" }
    if (pin.length < 8) return { strength: 66, label: "Moyen", color: "bg-yellow-500" }
    return { strength: 100, label: "Fort", color: "bg-green-500" }
  }

  const pinStrength = getPinStrength(newPin)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Changer le Code PIN
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-sm">
            <div
              className={`flex items-center gap-2 ${step === "verify" ? "text-blue-600" : step !== "verify" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "verify"
                    ? "bg-blue-600 text-white"
                    : step !== "verify"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                }`}
              >
                1
              </div>
              Vérifier
            </div>
            <div
              className={`flex items-center gap-2 ${step === "new" ? "text-blue-600" : ["confirm", "success"].includes(step) ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "new"
                    ? "bg-blue-600 text-white"
                    : ["confirm", "success"].includes(step)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                }`}
              >
                2
              </div>
              Nouveau
            </div>
            <div
              className={`flex items-center gap-2 ${step === "confirm" ? "text-blue-600" : step === "success" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "confirm"
                    ? "bg-blue-600 text-white"
                    : step === "success"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                }`}
              >
                3
              </div>
              Confirmer
            </div>
            <div className={`flex items-center gap-2 ${step === "success" ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "success" ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
              >
                ✓
              </div>
              Terminé
            </div>
          </div>

          {/* Step 1: Verify Current PIN */}
          {step === "verify" && (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>Pour votre sécurité, veuillez d'abord saisir votre code PIN actuel.</AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="currentPin">Code PIN actuel</Label>
                <div className="relative">
                  <Input
                    id="currentPin"
                    type={showCurrentPin ? "text" : "password"}
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    placeholder="••••"
                    className="pr-10"
                    maxLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPin(!showCurrentPin)}
                  >
                    {showCurrentPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={validateCurrentPin} disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Vérification...
                  </>
                ) : (
                  "Vérifier le PIN"
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Enter New PIN */}
          {step === "new" && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  PIN actuel vérifié avec succès. Vous pouvez maintenant définir un nouveau code PIN.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="newPin">Nouveau code PIN</Label>
                <div className="relative">
                  <Input
                    id="newPin"
                    type={showNewPin ? "text" : "password"}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="••••••"
                    className="pr-10"
                    maxLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPin(!showNewPin)}
                  >
                    {showNewPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {newPin && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Force du PIN:</span>
                      <span
                        className={`font-medium ${
                          pinStrength.strength < 50
                            ? "text-red-600"
                            : pinStrength.strength < 80
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {pinStrength.label}
                      </span>
                    </div>
                    <Progress value={pinStrength.strength} className="h-2" />
                  </div>
                )}
              </div>

              <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Conseils de sécurité:</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Utilisez au moins 6 chiffres</li>
                    <li>• Évitez les séquences simples (1234, 0000)</li>
                    <li>• Ne réutilisez pas d'anciens codes PIN</li>
                    <li>• Gardez votre PIN confidentiel</li>
                  </ul>
                </CardContent>
              </Card>

              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={validateNewPin} disabled={!newPin} className="w-full">
                Continuer
              </Button>
            </div>
          )}

          {/* Step 3: Confirm New PIN */}
          {step === "confirm" && (
            <div className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Veuillez confirmer votre nouveau code PIN en le saisissant à nouveau.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="confirmPin">Confirmer le nouveau PIN</Label>
                <div className="relative">
                  <Input
                    id="confirmPin"
                    type={showConfirmPin ? "text" : "password"}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="••••••"
                    className="pr-10"
                    maxLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                  >
                    {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {confirmPin && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {newPin === confirmPin ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Les codes PIN correspondent</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Les codes PIN ne correspondent pas</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("new")} className="flex-1">
                  Retour
                </Button>
                <Button onClick={confirmNewPin} disabled={isProcessing || !confirmPin} className="flex-1">
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Changement...
                    </>
                  ) : (
                    "Changer le PIN"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">PIN modifié avec succès !</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Votre nouveau code PIN a été configuré et est maintenant actif.
                </p>
              </div>

              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Important:</strong> Mémorisez bien votre nouveau code PIN. Il sera requis pour accéder aux
                  fonctions sécurisées du TPE.
                </AlertDescription>
              </Alert>

              {securityLogs.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Journal de sécurité
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {securityLogs.slice(0, 3).map((log) => (
                        <div key={log.id} className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{log.details}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                log.status === "success"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20"
                                  : log.status === "warning"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/20"
                              }`}
                            >
                              {log.status === "success" ? "Succès" : log.status === "warning" ? "Attention" : "Erreur"}
                            </span>
                          </div>
                          <div className="text-gray-500 mt-1">{new Date(log.timestamp).toLocaleString("fr-CH")}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700">
                Fermer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
