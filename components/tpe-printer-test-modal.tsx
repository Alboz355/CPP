"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Printer,
  Wifi,
  Usb,
  Bluetooth,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Thermometer,
  FileText,
  Settings,
  Zap,
  Receipt,
  Save,
} from "lucide-react"

interface TPEPrinterTestModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PrinterStatus {
  connection: "connected" | "disconnected" | "error"
  paper: "ok" | "low" | "empty"
  temperature: "normal" | "high" | "critical"
  driver: "installed" | "missing" | "outdated"
}

interface TestResult {
  test: string
  status: "success" | "warning" | "error"
  message: string
  details?: string
}

interface ReceiptSettings {
  header: string
  footer: string
  includeLogo: boolean
  includeQR: boolean
  includeDate: boolean
  includeTime: boolean
  includeAddress: boolean
  includePhone: boolean
  includeEmail: boolean
  includeVAT: boolean
  paperWidth: "58mm" | "80mm"
  fontSize: "small" | "medium" | "large"
}

export function TPEPrinterTestModal({ isOpen, onClose }: TPEPrinterTestModalProps) {
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [printerStatus, setPrinterStatus] = useState<PrinterStatus>({
    connection: "disconnected",
    paper: "ok",
    temperature: "normal",
    driver: "installed",
  })
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [connectionType, setConnectionType] = useState<"usb" | "wifi" | "bluetooth">("usb")
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings>({
    header: "CRYPTO STORE LAUSANNE",
    footer: "Merci de votre visite !\nÀ bientôt !",
    includeLogo: true,
    includeQR: true,
    includeDate: true,
    includeTime: true,
    includeAddress: true,
    includePhone: true,
    includeEmail: false,
    includeVAT: true,
    paperWidth: "58mm",
    fontSize: "medium",
  })

  const runConnectionTest = async () => {
    setIsTestingConnection(true)
    setTestProgress(0)
    setTestResults([])

    const tests = [
      { name: "Détection du périphérique", delay: 1000 },
      { name: "Test de communication", delay: 1500 },
      { name: "Vérification des pilotes", delay: 1000 },
      { name: "Test de l'état du papier", delay: 800 },
      { name: "Contrôle de la température", delay: 1200 },
    ]

    const results: TestResult[] = []

    for (let i = 0; i < tests.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, tests[i].delay))
      setTestProgress(((i + 1) / tests.length) * 100)

      // Simuler des résultats de test
      let result: TestResult
      switch (i) {
        case 0: // Détection
          result = {
            test: tests[i].name,
            status: Math.random() > 0.2 ? "success" : "error",
            message: Math.random() > 0.2 ? "Imprimante détectée" : "Aucune imprimante trouvée",
            details:
              connectionType === "usb"
                ? "Port USB-A"
                : connectionType === "wifi"
                  ? "192.168.1.100"
                  : "Device: TPE-PRINTER",
          }
          break
        case 1: // Communication
          result = {
            test: tests[i].name,
            status: results[0]?.status === "success" ? (Math.random() > 0.1 ? "success" : "warning") : "error",
            message:
              results[0]?.status === "success"
                ? Math.random() > 0.1
                  ? "Communication établie"
                  : "Communication lente"
                : "Impossible de communiquer",
            details: results[0]?.status === "success" ? "Latence: 45ms" : "Timeout après 5s",
          }
          break
        case 2: // Pilotes
          result = {
            test: tests[i].name,
            status: Math.random() > 0.15 ? "success" : "warning",
            message: Math.random() > 0.15 ? "Pilotes à jour" : "Pilotes obsolètes détectés",
            details: "Version: 2.1.4",
          }
          break
        case 3: // Papier
          const paperStatus = Math.random()
          result = {
            test: tests[i].name,
            status: paperStatus > 0.7 ? "success" : paperStatus > 0.3 ? "warning" : "error",
            message: paperStatus > 0.7 ? "Papier disponible" : paperStatus > 0.3 ? "Papier faible" : "Papier épuisé",
            details: paperStatus > 0.7 ? "Niveau: 85%" : paperStatus > 0.3 ? "Niveau: 15%" : "Remplacer le rouleau",
          }
          break
        case 4: // Température
          result = {
            test: tests[i].name,
            status: Math.random() > 0.1 ? "success" : "warning",
            message: Math.random() > 0.1 ? "Température normale" : "Température élevée",
            details: Math.random() > 0.1 ? "42°C" : "68°C - Laisser refroidir",
          }
          break
        default:
          result = { test: tests[i].name, status: "success", message: "Test réussi" }
      }

      results.push(result)
      setTestResults([...results])
    }

    // Mettre à jour le statut de l'imprimante
    setPrinterStatus({
      connection: results[0]?.status === "success" ? "connected" : "error",
      paper: results[3]?.status === "success" ? "ok" : results[3]?.status === "warning" ? "low" : "empty",
      temperature: results[4]?.status === "success" ? "normal" : "high",
      driver: results[2]?.status === "success" ? "installed" : "outdated",
    })

    setIsTestingConnection(false)
  }

  const printTestReceipt = async () => {
    if (printerStatus.connection !== "connected") {
      alert("Veuillez d'abord tester la connexion de l'imprimante.")
      return
    }

    setIsPrinting(true)

    // Simulation d'impression
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsPrinting(false)
    alert("Ticket de test envoyé à l'imprimante !")
  }

  const saveReceiptSettings = () => {
    localStorage.setItem("receipt-settings", JSON.stringify(receiptSettings))
    alert("Paramètres de ticket sauvegardés !")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
      case "connected":
      case "ok":
      case "normal":
      case "installed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
      case "low":
      case "high":
      case "outdated":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
      case "disconnected":
      case "empty":
      case "critical":
      case "missing":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "connected":
      case "ok":
      case "normal":
      case "installed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "warning":
      case "low":
      case "high":
      case "outdated":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "error":
      case "disconnected":
      case "empty":
      case "critical":
      case "missing":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      connected: "Connectée",
      disconnected: "Déconnectée",
      error: "Erreur",
      ok: "OK",
      low: "Faible",
      empty: "Vide",
      normal: "Normale",
      high: "Élevée",
      critical: "Critique",
      installed: "Installés",
      missing: "Manquants",
      outdated: "Obsolètes",
      success: "Réussi",
      warning: "Attention",
    }
    return labels[status] || status
  }

  const generateReceiptPreview = () => {
    const width = receiptSettings.paperWidth === "58mm" ? 32 : 42
    const separator = "=".repeat(width)
    const spacer = "-".repeat(width)

    let preview = ""

    // En-tête
    if (receiptSettings.header) {
      preview +=
        receiptSettings.header
          .split("\n")
          .map((line) =>
            line.length > width ? line.substring(0, width) : line.padStart((width + line.length) / 2).padEnd(width),
          )
          .join("\n") + "\n"
    }

    preview += separator + "\n\n"

    // Informations du commerce
    if (receiptSettings.includeAddress) {
      preview += "Rue de la Paix 15\n1003 Lausanne\n"
    }
    if (receiptSettings.includePhone) {
      preview += "Tél: +41 21 123 45 67\n"
    }
    if (receiptSettings.includeEmail) {
      preview += "Email: contact@cryptostore.ch\n"
    }
    if (receiptSettings.includeVAT) {
      preview += "TVA: CHE-123.456.789\n"
    }

    preview += "\n" + spacer + "\n\n"

    // Date et heure
    if (receiptSettings.includeDate || receiptSettings.includeTime) {
      const now = new Date()
      if (receiptSettings.includeDate) {
        preview += `Date: ${now.toLocaleDateString("fr-CH")}\n`
      }
      if (receiptSettings.includeTime) {
        preview += `Heure: ${now.toLocaleTimeString("fr-CH")}\n`
      }
      preview += "\n"
    }

    // Transaction exemple
    preview += "TRANSACTION TEST\n"
    preview += spacer + "\n"
    preview += "Achat Bitcoin\n"
    preview += "Montant:              150.00 CHF\n"
    preview += "TVA (7.7%):            11.55 CHF\n"
    preview += "Total:                161.55 CHF\n"
    preview += spacer + "\n\n"

    // Code QR
    if (receiptSettings.includeQR) {
      preview += "QR Code de vérification:\n"
      preview += "█████████████████████\n"
      preview += "█   ██ ▄▄▄▄▄ ██   █\n"
      preview += "█ ▄ ██ █   █ ██▄▄ █\n"
      preview += "█ ███▄ ▄▄▄▄▄ ▄███ █\n"
      preview += "█████████████████████\n\n"
    }

    // Pied de page
    if (receiptSettings.footer) {
      preview +=
        receiptSettings.footer
          .split("\n")
          .map((line) =>
            line.length > width ? line.substring(0, width) : line.padStart((width + line.length) / 2).padEnd(width),
          )
          .join("\n") + "\n"
    }

    preview += "\n" + separator + "\n"
    preview += "Ticket de test - " + new Date().toLocaleString("fr-CH")

    return preview
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card dark:bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Printer className="h-5 w-5" />
            Configuration et Test d'Imprimante
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="test" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted dark:bg-muted">
            <TabsTrigger value="test">Test Connexion</TabsTrigger>
            <TabsTrigger value="status">État</TabsTrigger>
            <TabsTrigger value="receipt">Format Ticket</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-6 mt-6">
            <Card className="bg-background dark:bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Settings className="h-5 w-5" />
                  Configuration de Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Type de connexion :</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={connectionType === "usb" ? "default" : "outline"}
                      onClick={() => setConnectionType("usb")}
                      className="flex items-center gap-2"
                    >
                      <Usb className="h-4 w-4" />
                      USB
                    </Button>
                    <Button
                      variant={connectionType === "wifi" ? "default" : "outline"}
                      onClick={() => setConnectionType("wifi")}
                      className="flex items-center gap-2"
                    >
                      <Wifi className="h-4 w-4" />
                      Wi-Fi
                    </Button>
                    <Button
                      variant={connectionType === "bluetooth" ? "default" : "outline"}
                      onClick={() => setConnectionType("bluetooth")}
                      className="flex items-center gap-2"
                    >
                      <Bluetooth className="h-4 w-4" />
                      Bluetooth
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={runConnectionTest}
                  disabled={isTestingConnection}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isTestingConnection ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Test en cours... ({Math.round(testProgress)}%)
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Lancer le Test de Connexion
                    </>
                  )}
                </Button>

                {isTestingConnection && (
                  <div className="space-y-2">
                    <Progress value={testProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">Diagnostic en cours...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {testResults.length > 0 && (
              <Card className="bg-background dark:bg-background">
                <CardHeader>
                  <CardTitle className="text-foreground">Résultats du Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted dark:bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <p className="font-medium text-foreground">{result.test}</p>
                            <p className="text-sm text-muted-foreground">{result.message}</p>
                            {result.details && <p className="text-xs text-muted-foreground mt-1">{result.details}</p>}
                          </div>
                        </div>
                        <Badge className={getStatusColor(result.status)}>{getStatusLabel(result.status)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="status" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-background dark:bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Printer className="h-5 w-5" />
                    État de la Connexion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted dark:bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {connectionType === "usb" && <Usb className="h-5 w-5" />}
                      {connectionType === "wifi" && <Wifi className="h-5 w-5" />}
                      {connectionType === "bluetooth" && <Bluetooth className="h-5 w-5" />}
                      <span className="font-medium text-foreground">Connexion {connectionType.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(printerStatus.connection)}
                      <Badge className={getStatusColor(printerStatus.connection)}>
                        {getStatusLabel(printerStatus.connection)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted dark:bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <span className="font-medium text-foreground">Pilotes d'imprimante</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(printerStatus.driver)}
                      <Badge className={getStatusColor(printerStatus.driver)}>
                        {getStatusLabel(printerStatus.driver)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background dark:bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <AlertTriangle className="h-5 w-5" />
                    État Physique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted dark:bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <span className="font-medium text-foreground">Niveau de papier</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(printerStatus.paper)}
                      <Badge className={getStatusColor(printerStatus.paper)}>
                        {getStatusLabel(printerStatus.paper)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted dark:bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Thermometer className="h-5 w-5" />
                      <span className="font-medium text-foreground">Température</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(printerStatus.temperature)}
                      <Badge className={getStatusColor(printerStatus.temperature)}>
                        {getStatusLabel(printerStatus.temperature)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {printerStatus.connection === "connected" && (
              <Card className="bg-background dark:bg-background">
                <CardHeader>
                  <CardTitle className="text-foreground">Actions Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button
                      onClick={printTestReceipt}
                      disabled={isPrinting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isPrinting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Impression...
                        </>
                      ) : (
                        <>
                          <Receipt className="h-4 w-4 mr-2" />
                          Imprimer Ticket Test
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={runConnectionTest}
                      className="flex-1 bg-background dark:bg-background"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Nouveau Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="receipt" className="space-y-6 mt-6">
            <Card className="bg-background dark:bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Receipt className="h-5 w-5" />
                  Configuration du Format de Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="header">En-tête du ticket</Label>
                      <Textarea
                        id="header"
                        value={receiptSettings.header}
                        onChange={(e) => setReceiptSettings({ ...receiptSettings, header: e.target.value })}
                        placeholder="Nom du commerce"
                        className="bg-background dark:bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="footer">Pied de page</Label>
                      <Textarea
                        id="footer"
                        value={receiptSettings.footer}
                        onChange={(e) => setReceiptSettings({ ...receiptSettings, footer: e.target.value })}
                        placeholder="Message de remerciement"
                        className="bg-background dark:bg-background"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paperWidth">Largeur papier</Label>
                        <Select
                          value={receiptSettings.paperWidth}
                          onValueChange={(value: "58mm" | "80mm") =>
                            setReceiptSettings({ ...receiptSettings, paperWidth: value })
                          }
                        >
                          <SelectTrigger className="bg-background dark:bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="58mm">58mm (standard)</SelectItem>
                            <SelectItem value="80mm">80mm (large)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fontSize">Taille police</Label>
                        <Select
                          value={receiptSettings.fontSize}
                          onValueChange={(value: "small" | "medium" | "large") =>
                            setReceiptSettings({ ...receiptSettings, fontSize: value })
                          }
                        >
                          <SelectTrigger className="bg-background dark:bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Petite</SelectItem>
                            <SelectItem value="medium">Moyenne</SelectItem>
                            <SelectItem value="large">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-foreground">Éléments à inclure</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeLogo"
                          checked={receiptSettings.includeLogo}
                          onCheckedChange={(checked) =>
                            setReceiptSettings({ ...receiptSettings, includeLogo: !!checked })
                          }
                        />
                        <Label htmlFor="includeLogo">Logo du commerce</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeAddress"
                          checked={receiptSettings.includeAddress}
                          onCheckedChange={(checked) =>
                            setReceiptSettings({ ...receiptSettings, includeAddress: !!checked })
                          }
                        />
                        <Label htmlFor="includeAddress">Adresse</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includePhone"
                          checked={receiptSettings.includePhone}
                          onCheckedChange={(checked) =>
                            setReceiptSettings({ ...receiptSettings, includePhone: !!checked })
                          }
                        />
                        <Label htmlFor="includePhone">Téléphone</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeEmail"
                          checked={receiptSettings.includeEmail}
                          onCheckedChange={(checked) =>
                            setReceiptSettings({ ...receiptSettings, includeEmail: !!checked })
                          }
                        />
                        <Label htmlFor="includeEmail">Email</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeVAT"
                          checked={receiptSettings.includeVAT}
                          onCheckedChange={(checked) =>
                            setReceiptSettings({ ...receiptSettings, includeVAT: !!checked })
                          }
                        />
                        <Label htmlFor="includeVAT">Numéro TVA</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeDate"
                          checked={receiptSettings.includeDate}
                          onCheckedChange={(checked) =>
                            setReceiptSettings({ ...receiptSettings, includeDate: !!checked })
                          }
                        />
                        <Label htmlFor="includeDate">Date</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeTime"
                          checked={receiptSettings.includeTime}
                          onCheckedChange={(checked) =>
                            setReceiptSettings({ ...receiptSettings, includeTime: !!checked })
                          }
                        />
                        <Label htmlFor="includeTime">Heure</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeQR"
                          checked={receiptSettings.includeQR}
                          onCheckedChange={(checked) =>
                            setReceiptSettings({ ...receiptSettings, includeQR: !!checked })
                          }
                        />
                        <Label htmlFor="includeQR">Code QR de vérification</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={saveReceiptSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder la Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <Card className="bg-background dark:bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5" />
                  Aperçu du Ticket de Caisse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 rounded-lg font-mono text-sm max-w-md mx-auto">
                  <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-center leading-tight">
                    {generateReceiptPreview()}
                  </pre>
                </div>

                <Alert className="mt-4">
                  <Receipt className="h-4 w-4" />
                  <AlertDescription>
                    Cet aperçu montre comment apparaîtra votre ticket de caisse avec les paramètres actuels. Le format
                    réel peut légèrement varier selon votre imprimante.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={printTestReceipt}
                    disabled={printerStatus.connection !== "connected" || isPrinting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isPrinting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Impression...
                      </>
                    ) : (
                      <>
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimer ce Ticket
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={saveReceiptSettings}
                    className="flex-1 bg-background dark:bg-background"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
