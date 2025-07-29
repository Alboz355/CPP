"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StandardizedHeader } from "@/components/standardized-header"
import { Search, Bluetooth, Usb, Wifi, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import type { AppState } from "@/app/page"

interface TPEDevice {
  id: string
  name: string
  type: "bluetooth" | "usb" | "wifi"
  status: "available" | "connected" | "pairing" | "error"
  signal?: number
  model?: string
}

interface TPESearchPageProps {
  onNavigate: (page: AppState) => void
}

export function TPESearchPage({ onNavigate }: TPESearchPageProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<TPEDevice[]>([])
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null)
  const [searchFilter, setSearchFilter] = useState("")

  // Simuler la recherche de TPE
  const mockDevices: TPEDevice[] = [
    {
      id: "tpe-001",
      name: "SumUp Air",
      type: "bluetooth",
      status: "available",
      signal: 85,
      model: "Air Card Reader",
    },
    {
      id: "tpe-002",
      name: "Square Reader",
      type: "bluetooth",
      status: "available",
      signal: 72,
      model: "Contactless Reader",
    },
    {
      id: "tpe-003",
      name: "Zettle Reader 2",
      type: "bluetooth",
      status: "available",
      signal: 91,
      model: "PayPal Zettle",
    },
    {
      id: "tpe-004",
      name: "TPE-USB-001",
      type: "usb",
      status: "available",
      model: "Terminal USB",
    },
    {
      id: "tpe-005",
      name: "WiFi Terminal",
      type: "wifi",
      status: "available",
      signal: 68,
      model: "Network Terminal",
    },
  ]

  useEffect(() => {
    // Vérifier si un TPE est déjà connecté
    const savedTPE = localStorage.getItem("tpe-device")
    if (savedTPE) {
      const device = JSON.parse(savedTPE)
      setConnectedDevice(device.id)
    }
  }, [])

  const startScan = () => {
    setIsScanning(true)
    setDevices([])

    // Simuler la découverte progressive des appareils
    setTimeout(() => {
      setDevices([mockDevices[0]])
    }, 500)

    setTimeout(() => {
      setDevices([mockDevices[0], mockDevices[1]])
    }, 1200)

    setTimeout(() => {
      setDevices([mockDevices[0], mockDevices[1], mockDevices[2]])
    }, 1800)

    setTimeout(() => {
      setDevices(mockDevices)
      setIsScanning(false)
    }, 2500)
  }

  const connectDevice = async (device: TPEDevice) => {
    // Marquer comme en cours de connexion
    setDevices((prev) => prev.map((d) => (d.id === device.id ? { ...d, status: "pairing" } : d)))

    // Simuler la connexion
    setTimeout(() => {
      setDevices((prev) => prev.map((d) => (d.id === device.id ? { ...d, status: "connected" } : d)))
      setConnectedDevice(device.id)

      // Sauvegarder la connexion
      localStorage.setItem("tpe-device", JSON.stringify(device))

      // Retourner au menu principal après connexion
      setTimeout(() => {
        onNavigate("tpe")
      }, 1000)
    }, 2000)
  }

  const disconnectDevice = (deviceId: string) => {
    setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, status: "available" } : d)))
    setConnectedDevice(null)
    localStorage.removeItem("tpe-device")
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "bluetooth":
        return Bluetooth
      case "usb":
        return Usb
      case "wifi":
        return Wifi
      default:
        return Search
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      case "pairing":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      case "error":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Connecté"
      case "pairing":
        return "Connexion..."
      case "error":
        return "Erreur"
      default:
        return "Disponible"
    }
  }

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      device.model?.toLowerCase().includes(searchFilter.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <StandardizedHeader
        title="Rechercher TPE"
        subtitle="Scanner les terminaux disponibles"
        backPage="tpe"
        onNavigate={onNavigate}
      />
      
      <div className="p-4 space-y-6">

      {/* Contrôles de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scanner les appareils</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrer par nom ou modèle..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Bouton de scan */}
          <div className="flex space-x-3">
            <Button onClick={startScan} disabled={isScanning} className="flex-1">
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recherche en cours...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scanner les TPE
                </>
              )}
            </Button>
          </div>

          {/* Types de connexion supportés */}
          <div className="flex items-center justify-center space-x-6 pt-2 border-t">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Bluetooth className="h-4 w-4 text-primary" />
              <span>Bluetooth</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Usb className="h-4 w-4 text-green-600" />
              <span>USB</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Wifi className="h-4 w-4 text-purple-600" />
              <span>WiFi</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des appareils */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Appareils détectés</CardTitle>
            <Badge variant="outline">
              {filteredDevices.length} trouvé{filteredDevices.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isScanning && devices.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Recherche des terminaux...</p>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Aucun terminal détecté</p>
              <p className="text-sm text-gray-500 mt-1">Assurez-vous que votre TPE est allumé et en mode appairage</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDevices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.type)
                const isConnected = connectedDevice === device.id

                return (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          device.type === "bluetooth"
                            ? "bg-blue-100"
                            : device.type === "usb"
                              ? "bg-green-100"
                              : "bg-purple-100"
                        }`}
                      >
                        <DeviceIcon
                          className={`h-5 w-5 ${
                            device.type === "bluetooth"
                              ? "text-blue-600"
                              : device.type === "usb"
                                ? "text-green-600"
                                : "text-purple-600"
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{device.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {device.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{device.model}</p>
                        {device.signal && <p className="text-xs text-gray-500">Signal: {device.signal}%</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(device.status)}>
                        {device.status === "connected" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {device.status === "pairing" && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                        {device.status === "error" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {getStatusText(device.status)}
                      </Badge>

                      {isConnected ? (
                        <Button variant="outline" size="sm" onClick={() => disconnectDevice(device.id)}>
                          Déconnecter
                        </Button>
                      ) : device.status === "pairing" ? (
                        <Button variant="outline" size="sm" disabled>
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => connectDevice(device)} disabled={device.status === "error"}>
                          Connecter
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h3 className="font-medium text-blue-900">Instructions de connexion</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-start space-x-2">
                <span className="font-medium">1.</span>
                <span>Allumez votre terminal de paiement</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">2.</span>
                <span>Activez le mode appairage (Bluetooth) ou connectez le câble (USB)</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">3.</span>
                <span>Cliquez sur "Scanner les TPE" pour détecter les appareils</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">4.</span>
                <span>Sélectionnez votre terminal et cliquez sur "Connecter"</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
