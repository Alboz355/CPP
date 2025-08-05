"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Shield, Key, Copy, Eye, EyeOff } from "lucide-react"

// Importer les nouveaux utilitaires
import { MultiCryptoWallet } from "@/lib/wallet-utils"
import { getTranslations, Language } from "@/lib/i18n"

interface OnboardingPageProps {
  onWalletCreated: (wallet: any) => void
  selectedLanguage: Language
}

export function OnboardingPage({ onWalletCreated, selectedLanguage }: OnboardingPageProps) {
  const [seedPhrase, setSeedPhrase] = useState("")
  const [walletName, setWalletName] = useState("")
  const [generatedSeed, setGeneratedSeed] = useState("")
  const [showSeed, setShowSeed] = useState(false)
  const [seedConfirmed, setSeedConfirmed] = useState(false)

  const t = getTranslations(selectedLanguage.code)

  const handleCreateWallet = () => {
    try {
      console.log("Création d'un nouveau portefeuille...")
      const walletData = MultiCryptoWallet.generateWallet()

      // Validation de la phrase générée
      if (!MultiCryptoWallet.validateSeedPhrase(walletData.mnemonic)) {
        throw new Error(t.generatedPhraseInvalid)
      }

      // Validation des adresses générées
      if (!MultiCryptoWallet.validateWalletAddresses(walletData)) {
        throw new Error(t.invalidAddresses)
      }

      console.log("Portefeuille créé avec succès:", walletData)
      setGeneratedSeed(walletData.mnemonic)

      const wallet = {
        name: walletName || t.myMultiCryptoWallet,
        seedPhrase: walletData.mnemonic,
        accounts: walletData.accounts,
        addresses: {
          ethereum: MultiCryptoWallet.getPrimaryAddress(walletData, "ETH"),
          bitcoin: MultiCryptoWallet.getPrimaryAddress(walletData, "BTC"),
          algorand: MultiCryptoWallet.getPrimaryAddress(walletData, "ALGO"),
        },
        balance: {
          ETH: "0.0",
          BTC: "0.0",
          USDT: "0.0",
          ALGO: "0.0",
        },
        createdAt: new Date().toISOString(),
      }

      console.log("Données du portefeuille final:", wallet)
      onWalletCreated(wallet)
    } catch (error) {
      console.error("Erreur lors de la création du portefeuille:", error)
      alert(`${t.errorCreatingWallet}: ${error.message}`)
    }
  }

  const handleImportWallet = () => {
    if (!seedPhrase.trim()) return

    try {
      console.log("Importation du portefeuille avec seed:", seedPhrase)
      
      // Validation de la phrase avant récupération
      if (!MultiCryptoWallet.validateSeedPhrase(seedPhrase.trim())) {
        throw new Error(t.invalidRecoveryPhrase)
      }

      const walletData = MultiCryptoWallet.recoverWallet(seedPhrase.trim())

      // Validation des adresses récupérées
      if (!MultiCryptoWallet.validateWalletAddresses(walletData)) {
        throw new Error(t.invalidAddresses)
      }

      const wallet = {
        name: walletName || t.importedWallet,
        seedPhrase: seedPhrase.trim(),
        accounts: walletData.accounts,
        addresses: {
          ethereum: MultiCryptoWallet.getPrimaryAddress(walletData, "ETH"),
          bitcoin: MultiCryptoWallet.getPrimaryAddress(walletData, "BTC"),
          algorand: MultiCryptoWallet.getPrimaryAddress(walletData, "ALGO"),
        },
        balance: {
          ETH: "0.0",
          BTC: "0.0",
          USDT: "0.0",
          ALGO: "0.0",
        },
        createdAt: new Date().toISOString(),
      }

      console.log("Portefeuille importé avec succès:", wallet)
      onWalletCreated(wallet)
    } catch (error) {
      console.error("Erreur lors de l'importation:", error)
      alert(`${t.errorImporting}: ${error.message}`)
    }
  }

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(generatedSeed)
    alert("Phrase de récupération copiée !")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/20">
      <div className="w-full max-w-md modern-card p-8 scale-in">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="heading-1 mb-2">{t.welcome}</h1>
          <p className="body-text">{t.createMultiCryptoWallet}</p>
        </div>
        <div>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-accent/30">
              <TabsTrigger value="create">{t.createWallet}</TabsTrigger>
              <TabsTrigger value="import">{t.importWallet}</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="wallet-name" className="text-sm font-medium text-foreground">
                  {t.walletNameOptional}
                </label>
                <Input
                  id="wallet-name"
                  placeholder={t.myMultiCryptoWallet}
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="rounded-xl border-border/50 bg-accent/30"
                />
              </div>

              {generatedSeed && (
                <div className="space-y-3">
                  <div className="rounded-xl bg-yellow-500/10 p-4 border border-yellow-500/20">
                    <div className="flex items-start space-x-2">
                      <Shield className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="text-sm text-yellow-500">
                        <p className="font-medium">{t.seedPhraseGenerated}</p>
                        <p>{t.saveSeedPhraseSafely}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">
                        {t.yourRecoveryPhrase}
                      </label>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setShowSeed(!showSeed)}
                          className="h-8 w-8 rounded-lg hover:bg-accent/50"
                        >
                          {showSeed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={copySeedPhrase}
                          className="h-8 w-8 rounded-lg hover:bg-accent/50"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={showSeed ? generatedSeed : "••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••"}
                      readOnly
                      rows={3}
                      className="font-mono text-sm rounded-xl border-border/50 bg-accent/30"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="seed-confirmed"
                      checked={seedConfirmed}
                      onChange={(e) => setSeedConfirmed(e.target.checked)}
                    />
                    <label htmlFor="seed-confirmed" className="text-sm text-foreground">
                      {t.savedRecoveryPhrase}
                    </label>
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-blue-500/10 p-4 border border-blue-500/20">
                <div className="text-sm text-blue-500">
                  <p className="font-medium">{t.supportedCryptocurrencies}</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>{t.bitcoin}</li>
                    <li>{t.ethereum}</li>
                    <li>{t.algorand}</li>
                    <li>{t.addOtherAccounts}</li>
                  </ul>
                </div>
              </div>

              {!generatedSeed ? (
                <button onClick={handleCreateWallet} className="ios-button-primary w-full">
                  {t.generateNewWallet}
                </button>
              ) : (
                <button 
                  onClick={handleCreateWallet} 
                  className="ios-button-primary w-full disabled:opacity-50" 
                  disabled={!seedConfirmed}
                >
                  {t.continueWithWallet}
                </button>
              )}
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="wallet-name-import" className="text-sm font-medium text-foreground">
                  {t.walletNameOptional}
                </label>
                <Input
                  id="wallet-name-import"
                  placeholder={t.importedWallet}
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="rounded-xl border-border/50 bg-accent/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="seed-phrase" className="text-sm font-medium text-foreground">
                  {t.recoveryPhrase12Words}
                </label>
                <Textarea
                  id="seed-phrase"
                  placeholder={t.enterRecoveryPhrase}
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  rows={3}
                  className="rounded-xl border-border/50 bg-accent/30"
                />
              </div>

              <div className="rounded-xl bg-blue-500/10 p-4 border border-blue-500/20">
                <div className="flex items-start space-x-2">
                  <Key className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-blue-500">
                    <p className="font-medium">{t.security}</p>
                    <p>
                      {t.saveSeedPhraseSafely}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleImportWallet} 
                className="ios-button-primary w-full disabled:opacity-50" 
                disabled={!seedPhrase.trim()}
              >
                {t.importWalletButton}
              </button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
