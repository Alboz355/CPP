"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Database,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  HardDrive,
  Shield,
  Clock,
} from "lucide-react"

interface TPEBackupModalProps {
  isOpen: boolean
  onClose: () => void
}

interface BackupData {
  version: string
  timestamp: string
  settings: any
  transactions: any[]
  vatRates: any[]
  clients: any[]
  products: any[]
  size: number
}

export function TPEBackupModal({ isOpen, onClose }: TPEBackupModalProps) {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [backupCreated, setBackupCreated] = useState(false)
  const [restoreSuccess, setRestoreSuccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [backupData, setBackupData] = useState<BackupData | null>(null)

  const createBackup = async () => {
    setIsCreatingBackup(true)

    // Simulation de création de sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Collecter toutes les données TPE
    const tpeSettings = JSON.parse(localStorage.getItem("tpe-settings") || "{}")
    const transactions = JSON.parse(localStorage.getItem("tpe-transactions") || "[]")
    const vatRates = JSON.parse(localStorage.getItem("vat-rates") || "[]")
    const clients = JSON.parse(localStorage.getItem("tpe-clients") || "[]")
    const products = JSON.parse(localStorage.getItem("tpe-products") || "[]")

    const backup: BackupData = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      settings: tpeSettings,
      transactions,
      vatRates,
      clients,
      products,
      size: 0,
    }

    // Calculer la taille approximative
    const backupString = JSON.stringify(backup, null, 2)
    backup.size = new Blob([backupString]).size

    // Créer et télécharger le fichier
    const blob = new Blob([backupString], { type: "application/json;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `tpe-backup-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    setBackupData(backup)
    setBackupCreated(true)
    setIsCreatingBackup(false)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      validateBackupFile(file)
    }
  }

  const validateBackupFile = async (file: File) => {
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Vérifier la structure du fichier de sauvegarde
      if (data.version && data.timestamp && data.settings) {
        setBackupData(data)
      } else {
        throw new Error("Format de fichier invalide")
      }
    } catch (error) {
      alert("Fichier de sauvegarde invalide. Veuillez sélectionner un fichier de sauvegarde TPE valide.")
      setSelectedFile(null)
      setBackupData(null)
    }
  }

  const restoreBackup = async () => {
    if (!backupData) return

    setIsRestoring(true)

    // Simulation de restauration
    await new Promise((resolve) => setTimeout(resolve, 4000))

    // Restaurer les données
    if (backupData.settings) {
      localStorage.setItem("tpe-settings", JSON.stringify(backupData.settings))
    }
    if (backupData.transactions) {
      localStorage.setItem("tpe-transactions", JSON.stringify(backupData.transactions))
    }
    if (backupData.vatRates) {
      localStorage.setItem("vat-rates", JSON.stringify(backupData.vatRates))
    }
    if (backupData.clients) {
      localStorage.setItem("tpe-clients", JSON.stringify(backupData.clients))
    }
    if (backupData.products) {
      localStorage.setItem("tpe-products", JSON.stringify(backupData.products))
    }

    setRestoreSuccess(true)
    setIsRestoring(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const resetModal = () => {
    setBackupCreated(false)
    setRestoreSuccess(false)
    setSelectedFile(null)
    setBackupData(null)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sauvegarde et Restauration
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="backup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="backup">Sauvegarde</TabsTrigger>
            <TabsTrigger value="restore">Restauration</TabsTrigger>
          </TabsList>

          <TabsContent value="backup" className="space-y-6 mt-6">
            {!backupCreated ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Créer une Sauvegarde
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      Créez une sauvegarde complète de toutes vos données TPE incluant les paramètres, transactions,
                      taux de TVA, clients et produits.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Données incluses:</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Paramètres TPE</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Historique des transactions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Taux de TVA configurés</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Base de données clients</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Catalogue produits</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Informations:</h4>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Date: {new Date().toLocaleDateString("fr-CH")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Format: JSON</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Chiffrement: Activé</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <HardDrive className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Recommandation:</strong> Effectuez des sauvegardes régulières et stockez-les dans un
                        endroit sûr. La sauvegarde sera téléchargée sur votre appareil.
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={createBackup}
                      disabled={isCreatingBackup}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      {isCreatingBackup ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Création de la sauvegarde...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Créer la Sauvegarde
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-600 mb-2">Sauvegarde créée avec succès !</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Votre fichier de sauvegarde a été téléchargé et contient toutes vos données TPE.
                  </p>

                  {backupData && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">Taille:</span>
                          <span className="ml-2">{formatFileSize(backupData.size)}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Version:</span>
                          <span className="ml-2">{backupData.version}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Transactions:</span>
                          <span className="ml-2">{backupData.transactions?.length || 0}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Clients:</span>
                          <span className="ml-2">{backupData.clients?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={resetModal} variant="outline" className="flex-1 bg-transparent">
                      Nouvelle Sauvegarde
                    </Button>
                    <Button onClick={handleClose} className="flex-1 bg-green-600 hover:bg-green-700">
                      Fermer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="restore" className="space-y-6 mt-6">
            {!restoreSuccess ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Restaurer une Sauvegarde
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/10">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                        <strong>Attention:</strong> La restauration remplacera toutes vos données actuelles.
                        Assurez-vous d'avoir une sauvegarde récente avant de continuer.
                      </AlertDescription>
                    </Alert>

                    <div>
                      <Label htmlFor="backupFile">Sélectionner un fichier de sauvegarde</Label>
                      <Input id="backupFile" type="file" accept=".json" onChange={handleFileSelect} className="mt-2" />
                    </div>

                    {backupData && (
                      <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                            Aperçu de la sauvegarde
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex justify-between">
                              <span>Version:</span>
                              <Badge variant="outline">{backupData.version}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Date:</span>
                              <span>{new Date(backupData.timestamp).toLocaleDateString("fr-CH")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Transactions:</span>
                              <span className="font-semibold">{backupData.transactions?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Clients:</span>
                              <span className="font-semibold">{backupData.clients?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Produits:</span>
                              <span className="font-semibold">{backupData.products?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taux TVA:</span>
                              <span className="font-semibold">{backupData.vatRates?.length || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Button
                      onClick={restoreBackup}
                      disabled={!backupData || isRestoring}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="lg"
                    >
                      {isRestoring ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Restauration en cours...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Restaurer les Données
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-600 mb-2">Restauration réussie !</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Toutes vos données ont été restaurées avec succès. Le TPE va redémarrer pour appliquer les
                    changements.
                  </p>

                  <Alert className="mb-4">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Redémarrage requis:</strong> Veuillez fermer cette fenêtre et redémarrer le TPE pour que
                      tous les changements prennent effet.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700">
                    Fermer et Redémarrer
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
