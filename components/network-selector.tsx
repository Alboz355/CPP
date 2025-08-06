"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface NetworkSelectorProps {
  selectedNetwork: string
  onNetworkChange: (network: string) => void
}

export function NetworkSelector({ selectedNetwork, onNetworkChange }: NetworkSelectorProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="network" className="text-right">
        Réseau
      </Label>
      <Select value={selectedNetwork} onValueChange={onNetworkChange}>
        <SelectTrigger id="network" className="col-span-3">
          <SelectValue placeholder="Sélectionner un réseau" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mainnet">Mainnet</SelectItem>
          <SelectItem value="testnet">Testnet</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
