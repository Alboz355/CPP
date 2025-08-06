"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Eye, EyeOff, Copy, Shield, AlertTriangle, CheckCircle, ArrowDown, HelpCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SeedPhraseModalProps {
  isOpen: boolean
  onClose: () => void
  seedPhrase: string
  onShowSupport: () => void
}

export function SeedPhraseModal({ isOpen, onClose, seedPhrase, onShowSupport }: SeedPhraseModalProps) {
  const [step, setStep] = useState(1) // 1: Avertissement, 2: Affichage, 3: Confirmation, 4: Terminé
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [confirmationChecks, setConfirmationChecks] = useState({
    written: false,
    stored: false,
    understood: false,
  })

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep(1)
      setIsVisible(false)
      setCopied(false)
      setScrollProgress(0)
      setHasScrolledToBottom(false)
      setConfirmationChecks({ written: false, stored: false, understood: false })
    }
  }, [isOpen])

  if (!isOpen) return null

  const words = seedPhrase.split(" ")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(seedPhrase)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Erreur copie:", error)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight - element.clientHeight
    const progress = (scrollTop / scrollHeight) * 100

    setScrollProgress(progress)

    if (progress >= 95) {
      setHasScrolledToBottom(true)
    }
  }

  const handleConfirmationChange = (key: keyof typeof confirmationChecks) => {
    setConfirmationChecks((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const allConfirmationsChecked = Object.values(confirmationChecks).every(Boolean)

  const handleFinalConfirmation = () => {
    // Marquer que la seed phrase a été vue définitivement
    localStorage.setItem("seed-phrase-viewed", "true")
    setStep(4)
  }

  const handleContactSupport = () => {
    onClose()
    onShowSupport()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {step === 1 && "⚠️ ATTENTION CRITIQUE"}
                  {step === 2 && "🔐 Phrase de récupération"}
                  {step === 3 && "✅ Confirmation finale"}
                  {step === 4 && "🎉 Terminé"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Dernière chance de voir votre phrase"}
                  {step === 2 && "Notez soigneusement chaque mot"}
                  {step === 3 && "Confirmez que vous avez tout noté"}
                  {step === 4 && "Phrase sauvegardée avec succès"}
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto" onScroll={handleScroll}>
          {/* Étape 1: Avertissement critique */}
          {step === 1 && (
            <>
              <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 mt-1" />
                  <div className="text-sm">
                    <p className="font-bold text-lg text-red-800 dark:text-red-200 mb-3">
                      🚨 DERNIÈRE CHANCE - TRÈS IMPORTANT
                    </p>
                    <ul className="text-red-700 dark:text-red-300 space-y-2 text-base">
                      <li>• Cette phrase ne sera affichée qu'UNE SEULE FOIS</li>
                      <li>• Après fermeture, elle ne sera PLUS JAMAIS accessible</li>
                      <li>• Sans cette phrase, vous perdrez DÉFINITIVEMENT vos cryptos</li>
                      <li>• Assurez-vous d'être dans un endroit PRIVÉ et SÉCURISÉ</li>
                      <li>• Préparez papier et stylo MAINTENANT</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Que faire maintenant :</p>
                    <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
                      <li>Trouvez un endroit privé et sécurisé</li>
                      <li>Préparez papier et stylo</li>
                      <li>Assurez-vous de ne pas être observé</li>
                      <li>Cliquez sur "Je suis prêt" quand vous êtes prêt</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Button onClick={() => setStep(2)} className="w-full bg-red-600 hover:bg-red-700 text-white">
                Je comprends les risques - Je suis prêt
              </Button>
            </>
          )}

          {/* Étape 2: Affichage de la seed phrase */}
          {step === 2 && (
            <>
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800 dark:text-red-200">
                      Phrase de récupération unique - Notez IMMÉDIATEMENT !
                    </p>
                    <p className="text-red-700 dark:text-red-300">Écrivez chaque mot dans l'ordre exact sur papier</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Votre phrase de récupération (12 mots)</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsVisible(!isVisible)}>
                      {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isVisible ? "Masquer" : "Afficher"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy} disabled={!isVisible}>
                      <Copy className="h-4 w-4" />
                      {copied ? "Copié !" : "Copier"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {words.map((word, index) => (
                    <div
                      key={index}
                      className="bg-muted/50 border-2 border-red-200 dark:border-red-500/20 rounded-lg p-3 text-center"
                    >
                      <div className="text-xs text-muted-foreground mb-1 font-bold">{index + 1}</div>
                      <div className="font-mono font-bold text-lg">{isVisible ? word : "••••••"}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-2">💡 Instructions importantes :</p>
                  <ul className="space-y-1">
                    <li>• Écrivez chaque mot sur papier (pas sur ordinateur)</li>
                    <li>• Vérifiez l'orthographe de chaque mot</li>
                    <li>• Numérotez les mots de 1 à 12</li>
                    <li>• Conservez le papier en lieu sûr</li>
                    <li>• Ne prenez pas de photo de cette phrase</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Faites défiler pour continuer</span>
                  <ArrowDown className="h-4 w-4 animate-bounce" />
                </div>
                <Progress value={scrollProgress} className="h-2" />
              </div>

              <Button onClick={() => setStep(3)} className="w-full" disabled={!isVisible || !hasScrolledToBottom}>
                J'ai noté ma phrase - Continuer
              </Button>
            </>
          )}

          {/* Étape 3: Confirmation */}
          {step === 3 && (
            <>
              <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-orange-800 dark:text-orange-200">Confirmation finale requise</p>
                    <p className="text-orange-700 dark:text-orange-300">
                      Confirmez que vous avez bien sauvegardé votre phrase
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Veuillez confirmer :</h3>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmationChecks.written}
                      onChange={() => handleConfirmationChange("written")}
                      className="mt-1"
                    />
                    <span className="text-sm">J'ai écrit tous les 12 mots sur papier dans l'ordre correct</span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmationChecks.stored}
                      onChange={() => handleConfirmationChange("stored")}
                      className="mt-1"
                    />
                    <span className="text-sm">J'ai stocké ce papier dans un endroit sûr et privé</span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmationChecks.understood}
                      onChange={() => handleConfirmationChange("understood")}
                      className="mt-1"
                    />
                    <span className="text-sm">Je comprends que cette phrase ne sera plus jamais affichée</span>
                  </label>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    ⚠️ Après cette étape, la phrase ne sera plus accessible
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    En cas de perte, vous pourrez contacter le support mais nous ne pourrons pas récupérer vos fonds
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  ← Retour pour vérifier
                </Button>
                <Button
                  onClick={handleFinalConfirmation}
                  disabled={!allConfirmationsChecked}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✅ Confirmer et terminer
                </Button>
              </div>
            </>
          )}

          {/* Étape 4: Terminé */}
          {step === 4 && (
            <>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                    Phrase sauvegardée avec succès !
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Votre phrase de récupération a été définitivement masquée pour votre sécurité.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-2">🛡️ Rappels de sécurité :</p>
                  <ul className="space-y-1">
                    <li>• Gardez votre phrase écrite en lieu sûr</li>
                    <li>• Ne la partagez jamais avec personne</li>
                    <li>• Testez la récupération avant de stocker des fonds importants</li>
                    <li>• En cas de problème, contactez le support</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleContactSupport}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contacter le support
                </Button>
                <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                  Fermer
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
