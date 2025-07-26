"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface NetworkSelectorProps {
  onNetworkChange: (network: string) => void
  currentNetwork: string
}

export function NetworkSelector({ onNetworkChange, currentNetwork }: NetworkSelectorProps) {
  // MAINNET SEULEMENT
  const networks = [
    { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "bg-blue-500" },
    { id: "polygon", name: "Polygon", symbol: "MATIC", color: "bg-purple-500" },
    { id: "arbitrum", name: "Arbitrum", symbol: "ETH", color: "bg-blue-600" },
    { id: "base", name: "Base", symbol: "ETH", color: "bg-blue-400" },
    { id: "linea", name: "Linea", symbol: "ETH", color: "bg-black" },
    { id: "optimism", name: "Optimism", symbol: "ETH", color: "bg-red-500" },
    { id: "blast", name: "Blast", symbol: "ETH", color: "bg-yellow-500" },
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", color: "bg-orange-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Réseaux Mainnet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={currentNetwork} onValueChange={onNetworkChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un réseau" />
            </SelectTrigger>
            <SelectContent>
              {networks.map((network) => (
                <SelectItem key={network.id} value={network.id}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${network.color}`} />
                    <span>{network.name}</span>
                    <Badge variant="secondary">{network.symbol}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-2">
            {networks.map((network) => (
              <Button
                key={network.id}
                variant={currentNetwork === network.id ? "default" : "outline"}
                size="sm"
                onClick={() => onNetworkChange(network.id)}
                className="justify-start"
              >
                <div className={`w-2 h-2 rounded-full ${network.color} mr-2`} />
                {network.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
