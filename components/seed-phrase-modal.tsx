"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Eye, EyeOff, Copy, X, Shield } from "lucide-react"
import { toast } from "sonner"
import { WalletSecureStorage } from "@/lib/secure-storage"

interface SeedPhraseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function SeedPhraseModal({ isOpen, onClose, onConfirm }: SeedPhraseModalProps) {
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [step, setStep] = useState(1) // 1: Warning, 2: Display, 3: Confirmation

  if (!isOpen) return null

  const walletData = WalletSecureStorage.getWallet()
  const seedPhrase = walletData?.seedPhrase || WalletSecureStorage.getMnemonic() || "Phrase non disponible"

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleFinish = () => {
    // Marquer définitivement comme vue
    localStorage.setItem("seedPhraseShown", "true")
    onConfirm()
    onClose()
  }

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(seedPhrase)
    toast.success("Phrase de récupération copiée dans le presse-papiers !")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <CardTitle className="text-lg text-red-800">
                {step === 1 && "⚠️ ATTENTION CRITIQUE"}
                {step === 2 && "🔐 Phrase de récupération"}
                {step === 3 && "✅ Confirmation"}
              </CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Étape 1: Avertissement */}
          {step === 1 && (
            <>
              <div className="rounded-lg bg-red-50 p-4 border-2 border-red-200">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-bold text-base mb-2">DERNIÈRE CHANCE !</p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Cette phrase ne sera affichée qu'UNE SEULE FOIS</li>
                      <li>Après fermeture, elle ne sera PLUS JAMAIS accessible</li>
                      <li>Sans cette phrase, vous perdrez DÉFINITIVEMENT vos cryptos</li>
                      <li>Assurez-vous d'être dans un endroit PRIVÉ et SÉCURISÉ</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
                <p className="text-sm text-yellow-800 font-medium">
                  📝 Préparez-vous à noter cette phrase sur papier ou dans un gestionnaire de mots de passe sécurisé.
                </p>
              </div>

              <Button onClick={handleContinue} className="w-full bg-red-600 hover:bg-red-700">
                Je comprends les risques - Continuer
              </Button>
            </>
          )}

          {/* Étape 2: Affichage de la seed phrase */}
          {step === 2 && (
            <>
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Phrase de récupération unique</p>
                    <p>Sauvegardez cette phrase IMMÉDIATEMENT !</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Votre phrase de récupération (12 mots)</Label>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => setShowSeedPhrase(!showSeedPhrase)}>
                      {showSeedPhrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={copySeedPhrase}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={showSeedPhrase ? seedPhrase : "••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••"}
                  readOnly
                  rows={3}
                  className="font-mono text-sm bg-gray-50 border-2 border-red-200"
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Conseil :</strong> Écrivez chaque mot dans l'ordre exact sur papier. Vérifiez deux fois
                  avant de continuer.
                </p>
              </div>

              <Button onClick={handleContinue} className="w-full" disabled={!showSeedPhrase}>
                J'ai sauvegardé ma phrase - Continuer
              </Button>
            </>
          )}

          {/* Étape 3: Confirmation finale */}
          {step === 3 && (
            <>
              <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium">Confirmation finale</p>
                    <p>Confirmez que vous avez bien sauvegardé votre phrase de récupération.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    ⚠️ Après cette étape, la phrase ne sera plus accessible
                  </p>
                  <p className="text-xs text-gray-600">
                    En cas de perte, contactez le support (mais nous ne pourrons pas récupérer vos fonds)
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button onClick={handleFinish} className="w-full bg-green-600 hover:bg-green-700">
                    ✅ J'ai sauvegardé ma phrase - Terminer
                  </Button>
                  <Button variant="outline" onClick={() => setStep(2)} className="w-full">
                    ← Retour pour vérifier
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
