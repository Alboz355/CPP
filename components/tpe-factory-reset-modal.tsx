"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Trash2, Shield, CheckCircle, Database, Settings, Users, Receipt, Package } from "lucide-react"

interface TPEFactoryResetModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ResetOption {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  critical: boolean
}

const resetOptions: ResetOption[] = [
  {
    id: "settings",
    label: "Paramètres TPE",
    description: "Configuration réseau, affichage, sécurité",
    icon: Settings,
    critical: false,
  },
  {
    id: "transactions",
    label: "Historique des transactions",
    description: "Toutes les transactions et paiements",
    icon: Receipt,
    critical: true,
  },
  {
    id: "clients",
    label: "Base de données clients",
    description: "Informations et historique clients",
    icon: Users,
    critical: true,
  },
  {
    id: "products",
    label: "Catalogue produits",
    description: "Produits, prix et inventaire",
    icon: Package,
    critical: false,
  },
  {
    id: "vat",
    label: "Configuration TVA",
    description: "Taux de TVA et paramètres fiscaux",
    icon: Database,
    critical: true,
  },
]

export function TPEFactoryResetModal({ isOpen, onClose }: TPEFactoryResetModalProps) {
  const [step, setStep] = useState<"warning" | "selection" | "confirmation" | "processing" | "success">("warning")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [confirmationText, setConfirmationText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [resetProgress, setResetProgress] = useState(0)

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]))
  }

  const proceedToSelection = () => {
    setStep("selection")
  }

  const proceedToConfirmation = () => {
    if (selectedOptions.length === 0) {
      alert("Veuillez sélectionner au moins un élément à réinitialiser.")
      return
    }
    setStep("confirmation")
  }

  const executeReset = async () => {
    if (confirmationText !== "RESET") {
      alert('Veuillez taper "RESET" pour confirmer la réinitialisation.')
      return
    }

    setIsProcessing(true)
    setStep("processing")

    // Simulation du processus de réinitialisation
    const steps = selectedOptions.length
    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setResetProgress(((i + 1) / steps) * 100)

      // Effectuer la réinitialisation réelle
      const option = selectedOptions[i]
      switch (option) {
        case "settings":
          localStorage.removeItem("tpe-settings")
          break
        case "transactions":
          localStorage.removeItem("tpe-transactions")
          break
        case "clients":
          localStorage.removeItem("tpe-clients")
          break
        case "products":
          localStorage.removeItem("tpe-products")
          break
        case "vat":
          localStorage.removeItem("vat-rates")
          break
      }
    }

    // Finalisation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    setStep("success")
  }

  const resetModal = () => {
    setStep("warning")
    setSelectedOptions([])
    setConfirmationText("")
    setResetProgress(0)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Réinitialisation d'Usine
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Warning */}
          {step === "warning" && (
            <div className="space-y-6">
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>ATTENTION - ACTION IRRÉVERSIBLE</strong>
                  <br />
                  La réinitialisation d'usine supprimera définitivement les données sélectionnées. Cette action ne peut
                  pas être annulée.
                </AlertDescription>
              </Alert>

              <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
                    Avant de continuer, assurez-vous de :
                  </h3>
                  <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Avoir créé une sauvegarde récente de vos données
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Avoir l'autorisation pour effectuer cette opération
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Comprendre que cette action est définitive
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Avoir prévu du temps pour reconfigurer le TPE
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Cas d'usage typiques :</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Changement de propriétaire du TPE</li>
                  <li>• Problèmes techniques majeurs</li>
                  <li>• Migration vers un nouveau système</li>
                  <li>• Remise à zéro pour formation</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Annuler
                </Button>
                <Button onClick={proceedToSelection} className="flex-1 bg-red-600 hover:bg-red-700">
                  Je comprends, continuer
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Selection */}
          {step === "selection" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Sélectionnez les données à réinitialiser</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choisissez précisément quelles données vous souhaitez supprimer. Les éléments marqués comme "Critique"
                  contiennent des données importantes.
                </p>
              </div>

              <div className="space-y-3">
                {resetOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-colors ${
                      selectedOptions.includes(option.id)
                        ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => handleOptionToggle(option.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedOptions.includes(option.id)}
                          onChange={() => handleOptionToggle(option.id)}
                        />
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <option.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{option.label}</h4>
                            {option.critical && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 text-xs rounded-full">
                                Critique
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedOptions.length > 0 && (
                <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    <strong>{selectedOptions.length} élément(s) sélectionné(s)</strong>
                    <br />
                    {selectedOptions.some((id) => resetOptions.find((opt) => opt.id === id)?.critical) &&
                      "Attention : des données critiques seront supprimées définitivement."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("warning")} className="flex-1">
                  Retour
                </Button>
                <Button
                  onClick={proceedToConfirmation}
                  disabled={selectedOptions.length === 0}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Continuer ({selectedOptions.length})
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === "confirmation" && (
            <div className="space-y-6">
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>DERNIÈRE CONFIRMATION</strong>
                  <br />
                  Vous êtes sur le point de supprimer définitivement les données suivantes :
                </AlertDescription>
              </Alert>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Éléments à supprimer :</h4>
                  <div className="space-y-2">
                    {selectedOptions.map((optionId) => {
                      const option = resetOptions.find((opt) => opt.id === optionId)
                      if (!option) return null
                      return (
                        <div
                          key={optionId}
                          className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-900/10 rounded"
                        >
                          <option.icon className="h-4 w-4 text-red-600" />
                          <span className="font-medium">{option.label}</span>
                          {option.critical && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 text-xs rounded-full">
                              Critique
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="confirmation" className="text-base font-semibold">
                  Pour confirmer, tapez "RESET" ci-dessous :
                </Label>
                <Input
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Tapez RESET pour confirmer"
                  className="mt-2 text-center font-mono text-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Cette confirmation est requise pour éviter les suppressions accidentelles.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("selection")} className="flex-1">
                  Retour
                </Button>
                <Button
                  onClick={executeReset}
                  disabled={confirmationText !== "RESET"}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  RÉINITIALISER DÉFINITIVEMENT
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Processing */}
          {step === "processing" && (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Réinitialisation en cours...</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Suppression des données sélectionnées. Cette opération peut prendre quelques instants.
                </p>
                <Progress value={resetProgress} className="w-full" />
                <p className="text-sm text-gray-500 mt-2">{Math.round(resetProgress)}% terminé</p>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Ne fermez pas cette fenêtre</strong> pendant la réinitialisation. Le processus est en cours et
                  doit se terminer complètement.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 5: Success */}
          {step === "success" && (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">Réinitialisation terminée</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Les données sélectionnées ont été supprimées avec succès. Le TPE a été réinitialisé selon vos
                  paramètres.
                </p>
              </div>

              <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Prochaines étapes :</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
                    <li>• Reconfigurez les paramètres TPE si nécessaire</li>
                    <li>• Restaurez une sauvegarde si disponible</li>
                    <li>• Testez le fonctionnement du terminal</li>
                    <li>• Formez les utilisateurs aux nouveaux paramètres</li>
                  </ul>
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Redémarrage recommandé :</strong> Pour que tous les changements prennent effet, il est
                  recommandé de redémarrer complètement le TPE.
                </AlertDescription>
              </Alert>

              <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700">
                Fermer et Redémarrer le TPE
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
