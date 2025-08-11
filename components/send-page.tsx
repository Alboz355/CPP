"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatBalance, formatCryptoAmount } from "@/lib/wallet-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { AppState } from "@/app/page"
import type { WalletData } from "@/lib/wallet-utils"
import { getMnemonic } from "@/lib/wallet-real"
import { sendTransaction } from "@/lib/blockchain-apis"
import { Input as UITextInput } from "@/components/ui/input"

interface SendPageProps {
  onNavigate: (page: AppState) => void
  walletData: WalletData | null
}

export function SendPage({ onNavigate, walletData }: SendPageProps) {
  const { t } = useLanguage()
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [usdcMint, setUsdcMint] = useState("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  const { toast } = useToast()

  const handleSendTransaction = async () => {
    if (!walletData) {
      toast({
        title: t.common.error,
        description: t.send.walletNotLoaded,
        variant: "destructive",
      })
      return
    }

    if (!recipientAddress || !amount || Number(amount) <= 0) {
      toast({
        title: "Erreur de saisie",
        description: t.send.fillAllFields,
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    toast({
      title: "Envoi en cours...",
      description: `Envoi de ${amount} ${selectedCrypto.toUpperCase()} à ${recipientAddress}...`,
      duration: 5000,
    })

    try {
      const mnemonic = await getMnemonic()
      if (!mnemonic) throw new Error('Mnemonic introuvable. Veuillez recréer/importer le wallet.')
      const crypto = selectedCrypto as any
      const extra = selectedCrypto === 'usdc_spl' ? { usdcMint } : undefined
      const { txId } = await sendTransaction(crypto, mnemonic, recipientAddress, amount, extra as any)

      toast({
        title: t.send.transactionSuccess,
        description: `Vous avez envoyé ${amount} ${selectedCrypto.toUpperCase()} (tx: ${txId.slice(0,10)}...).`,
        variant: undefined,
      })
      setRecipientAddress("")
      setAmount("")
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      toast({
        title: t.send.transactionError,
        description: error instanceof Error ? error.message : "La transaction a échoué.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground ios-safe-area">
      {/* Header */}
      <div className="flex items-center justify-between p-4 ios-safe-top border-b border-[#E5E5EA] dark:border-[#38383A]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("dashboard")}
            className="btn-icon"
            aria-label="Retour au tableau de bord"
          >
            <ArrowLeft className="h-5 w-5 text-[#007AFF]" />
          </button>
          <h1 className="text-2xl font-bold text-[#000000] dark:text-[#FFFFFF]">{t.send.title}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="apple-card">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title">
              <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
                <Send className="h-5 w-5 text-[#007AFF]" />
              </div>
              Détails de l'envoi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="crypto-select">{t.send.cryptocurrency}</Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger id="crypto-select">
                  <SelectValue placeholder="Sélectionner une cryptomonnaie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">{t.crypto.bitcoin} (BTC)</SelectItem>
                  <SelectItem value="ethereum">{t.crypto.ethereum} (ETH)</SelectItem>
                  <SelectItem value="algorand">{t.crypto.algorand} (ALGO)</SelectItem>
                  <SelectItem value="solana">{t.crypto.solana} (SOL)</SelectItem>
                  <SelectItem value="usdc_spl">USDC (Solana)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recipient-address">{t.send.recipientAddress}</Label>
              <Input
                id="recipient-address"
                placeholder={t.send.recipientPlaceholder}
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                disabled={isSending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">{t.send.amount}</Label>
              <Input
                id="amount"
                type="number"
                placeholder={t.send.amountPlaceholder}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSending}
              />
            </div>

            {selectedCrypto === 'usdc_spl' && (
              <div className="grid gap-2">
                <Label htmlFor="usdc-mint">Mint USDC (mainnet par défaut)</Label>
                <UITextInput
                  id="usdc-mint"
                  value={usdcMint}
                  onChange={(e) => setUsdcMint(e.target.value)}
                  disabled={isSending}
                />
              </div>
            )}

            <button
              onClick={handleSendTransaction}
              className="btn-primary w-full"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t.send.sending}</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>{t.send.sendButton}</span>
                </>
              )}
            </button>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title">{t.send.yourBalance}</CardTitle>
          </CardHeader>
          <CardContent className="apple-card-content">
            <p className={`text-2xl font-bold balance-display ${
              parseFloat(String(walletData?.balances[selectedCrypto as keyof typeof walletData.balances] || "0")) === 0 
                ? 'balance-zero' 
                : 'balance-positive'
            }`}>
              {formatCryptoAmount(
                walletData?.balances[selectedCrypto as keyof typeof walletData.balances] || 0,
                selectedCrypto as any
              )}
            </p>
            <p className="text-sm text-[#8E8E93] mt-2">
              {t.send.yourAddress}: 
              <span className="font-mono text-xs">
                {walletData?.addresses[selectedCrypto as keyof typeof walletData.addresses]?.slice(0, 10)}...
                {walletData?.addresses[selectedCrypto as keyof typeof walletData.addresses]?.slice(-8) || "N/A"}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
