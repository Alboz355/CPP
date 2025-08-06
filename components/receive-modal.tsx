"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReceiveModalProps {
  address: string
  cryptoSymbol: string
  onClose: () => void
}

export function ReceiveModal({ address, cryptoSymbol, onClose }: ReceiveModalProps) {
  const { toast } = useToast()

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Adresse copiée !",
      description: `L'adresse ${cryptoSymbol} a été copiée dans le presse-papiers.`,
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] text-center">
        <DialogHeader>
          <DialogTitle>Recevoir {cryptoSymbol}</DialogTitle>
          <DialogDescription>
            Scannez le code QR ou copiez l'adresse pour recevoir des {cryptoSymbol}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {/* Placeholder for QR Code */}
          <div className="bg-white p-2 rounded-lg mb-4">
            <QrCode className="h-32 w-32 text-gray-800" /> {/* Replace with actual QR code component */}
          </div>
          <p className="font-mono text-sm break-all p-2 bg-muted rounded-md mb-4">
            {address || "Adresse non disponible"}
          </p>
          <Button onClick={handleCopyAddress} disabled={!address}>
            <Copy className="mr-2 h-4 w-4" />
            Copier l'adresse
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
