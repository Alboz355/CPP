"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Fingerprint, Smartphone, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import { SecurityManager } from "@/lib/security-manager"
import { useToast } from "@/hooks/use-toast"

interface BiometricSetupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BiometricSetupModal({ isOpen, onClose }: BiometricSetupModalProps) {
  const [step, setStep] = useState<'intro' | 'setup' | 'success' | 'error'>('intro')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { toast } = useToast()

  const securityManager = SecurityManager.getInstance()

  const handleSetup = async () => {
    setIsLoading(true)
    setStep('setup')

    try {
      const success = await securityManager.setupBiometric()
      
      if (success) {
        setStep('success')
        toast({
          title: "Authentification biométrique activée",
          description: "Vous pouvez maintenant utiliser votre empreinte ou Face ID",
        })
      } else {
        setStep('error')
        setErrorMessage("Configuration échouée. Vérifiez que votre appareil supporte l'authentification biométrique.")
      }
    } catch (error: any) {
      setStep('error')
      setErrorMessage(error.message || "Erreur lors de la configuration")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('intro')
    setErrorMessage("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card dark:bg-card border-border" style={{ zIndex: 9999 }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Fingerprint className="h-5 w-5" />
            Authentification Biométrique
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'intro' && (
            <>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Fingerprint className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Sécurisez votre wallet
                  </h3>
                  <p className="text-muted-foreground">
                    Activez l'authentification biométrique pour un accès rapide et sécurisé à votre wallet.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Card className="bg-muted dark:bg-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-medium text-foreground">Sécurité renforcée</p>
                        <p className="text-sm text-muted-foreground">
                          Vos données biométriques restent sur votre appareil
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted dark:bg-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium text-foreground">Accès rapide</p>
                        <p className="text-sm text-muted-foreground">
                          Plus besoin de saisir votre PIN à chaque fois
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Plus tard
                </Button>
                <Button onClick={handleSetup} className="flex-1">
                  Configurer
                </Button>
              </div>
            </>
          )}

          {step === 'setup' && (
            <>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Fingerprint className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Configuration en cours...
                  </h3>
                  <p className="text-muted-foreground">
                    Suivez les instructions de votre navigateur pour configurer l'authentification biométrique.
                  </p>
                </div>
              </div>

              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Utilisez votre empreinte digitale, Face ID ou Windows Hello
                    </span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Configuration réussie !
                  </h3>
                  <p className="text-muted-foreground">
                    L'authentification biométrique est maintenant activée. Vous pouvez l'utiliser pour déverrouiller votre wallet.
                  </p>
                </div>
              </div>

              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Vous pouvez toujours utiliser votre PIN comme méthode de secours
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleClose} className="w-full">
                Terminer
              </Button>
            </>
          )}

          {step === 'error' && (
            <>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Configuration échouée
                  </h3>
                  <p className="text-muted-foreground">
                    {errorMessage}
                  </p>
                </div>
              </div>

              <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Vérifiez que :
                    </p>
                    <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                      <li>• Votre navigateur supporte WebAuthn</li>
                      <li>• Votre appareil a une authentification biométrique configurée</li>
                      <li>• Vous avez autorisé l'accès aux capteurs biométriques</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Fermer
                </Button>
                <Button onClick={handleSetup} className="flex-1">
                  Réessayer
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
