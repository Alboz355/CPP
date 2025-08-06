"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react'
import { SecurityManager } from "@/lib/security-manager"
import { useToast } from "@/hooks/use-toast"

interface BackupCodesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BackupCodesModal({ isOpen, onClose }: BackupCodesModalProps) {
  const [codes, setCodes] = useState<string[]>([])
  const [showCodes, setShowCodes] = useState(false)
  const [hasConfirmed, setHasConfirmed] = useState(false)
  const [remainingCodes, setRemainingCodes] = useState(0)
  const { toast } = useToast()
  
  const securityManager = SecurityManager.getInstance()

  useEffect(() => {
    if (isOpen) {
      if (securityManager.hasBackupCodes()) {
        setRemainingCodes(securityManager.getRemainingBackupCodes())
      } else {
        const newCodes = securityManager.generateBackupCodes()
        setCodes(newCodes)
        setRemainingCodes(newCodes.length)
      }
    }
  }, [isOpen])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copié !",
      description: "Code copié dans le presse-papiers",
    })
  }

  const copyAllCodes = () => {
    const allCodes = codes.join('\n')
    navigator.clipboard.writeText(allCodes)
    toast({
      title: "Tous les codes copiés !",
      description: "Sauvegardez-les dans un endroit sûr",
    })
  }

  const downloadCodes = () => {
    const content = `CODES DE SAUVEGARDE CRYPTO WALLET\n\nCes codes ne peuvent être utilisés qu'une seule fois.\nConservez-les dans un endroit sûr et sécurisé.\n\n${codes.join('\n')}\n\nGénérés le: ${new Date().toLocaleString()}`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'codes-sauvegarde-wallet.txt'
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Codes téléchargés !",
      description: "Fichier sauvegardé avec succès",
    })
  }

  const handleClose = () => {
    if (codes.length > 0 && !hasConfirmed) {
      toast({
        title: "Attention !",
        description: "Vous devez confirmer avoir sauvegardé vos codes",
        variant: "destructive"
      })
      return
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card dark:bg-card border-border" style={{ zIndex: 9999 }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5" />
            Codes de Sauvegarde
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {codes.length > 0 ? (
            <>
              {/* Avertissement */}
              <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div className="space-y-2">
                      <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                        ⚠️ Important - Lisez attentivement
                      </h3>
                      <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                        <li>• Ces codes ne seront affichés qu'UNE SEULE FOIS</li>
                        <li>• Chaque code ne peut être utilisé qu'une seule fois</li>
                        <li>• Sauvegardez-les dans un endroit sûr (coffre-fort, gestionnaire de mots de passe)</li>
                        <li>• Ils permettent de réinitialiser votre PIN si vous l'oubliez</li>
                        <li>• Ne les partagez jamais avec personne</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCodes(!showCodes)}
                  className="flex-1"
                >
                  {showCodes ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showCodes ? "Masquer" : "Afficher"} les codes
                </Button>
                <Button variant="outline" onClick={copyAllCodes} disabled={!showCodes}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier tout
                </Button>
                <Button variant="outline" onClick={downloadCodes} disabled={!showCodes}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>

              {/* Codes */}
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {codes.map((code, index) => (
                  <Card key={index} className="bg-muted dark:bg-muted">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <code className="font-mono text-sm">
                            {showCodes ? code : '••••••'}
                          </code>
                        </div>
                        {showCodes && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Confirmation */}
              <Card className="border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="confirm-backup"
                      checked={hasConfirmed}
                      onChange={(e) => setHasConfirmed(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="confirm-backup" className="text-sm text-foreground cursor-pointer">
                      ✅ J'ai sauvegardé mes codes de sauvegarde dans un endroit sûr et je comprends qu'ils ne seront plus affichés
                    </label>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  onClick={handleClose}
                  disabled={!hasConfirmed}
                  className="flex-1"
                >
                  Terminer
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Codes déjà générés */}
              <Card className="bg-muted dark:bg-muted">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Codes de sauvegarde configurés
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Vous avez déjà généré vos codes de sauvegarde.
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {remainingCodes} codes restants
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Les codes de sauvegarde ne peuvent être affichés qu'une seule fois lors de leur génération.
                    Si vous avez perdu vos codes, vous devrez en générer de nouveaux.
                  </p>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Fermer
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Êtes-vous sûr de vouloir générer de nouveaux codes ? Cela invalidera tous les codes existants.")) {
                      const newCodes = securityManager.generateBackupCodes()
                      setCodes(newCodes)
                      setRemainingCodes(newCodes.length)
                      setHasConfirmed(false)
                    }
                  }}
                  className="flex-1"
                >
                  Générer de nouveaux codes
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
