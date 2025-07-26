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

interface OnboardingPageProps {
  onWalletCreated: (wallet: any) => void
}

export function OnboardingPage({ onWalletCreated }: OnboardingPageProps) {
  const [seedPhrase, setSeedPhrase] = useState("")
  const [walletName, setWalletName] = useState("")
  const [generatedSeed, setGeneratedSeed] = useState("")
  const [showSeed, setShowSeed] = useState(false)
  const [seedConfirmed, setSeedConfirmed] = useState(false)

  const handleCreateWallet = () => {
    try {
      console.log("Création d'un nouveau portefeuille...")
      const walletData = MultiCryptoWallet.generateWallet()

      console.log("Portefeuille créé:", walletData)
      setGeneratedSeed(walletData.mnemonic)

      const wallet = {
        name: walletName || "Mon Portefeuille Multi-Crypto",
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
      alert("Erreur lors de la création du portefeuille: " + error)
    }
  }

  const handleImportWallet = () => {
    if (!seedPhrase.trim()) return

    try {
      console.log("Importation du portefeuille avec seed:", seedPhrase)
      const walletData = MultiCryptoWallet.recoverWallet(seedPhrase.trim())

      const wallet = {
        name: walletName || "Portefeuille Importé",
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

      console.log("Portefeuille importé:", wallet)
      onWalletCreated(wallet)
    } catch (error) {
      console.error("Erreur lors de l'importation:", error)
      alert("Phrase de récupération invalide: " + error)
    }
  }

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(generatedSeed)
    alert("Phrase de récupération copiée !")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Bienvenue</CardTitle>
          <CardDescription>Créez un portefeuille multi-crypto ou importez un portefeuille existant</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Créer</TabsTrigger>
              <TabsTrigger value="import">Importer</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-name">Nom du portefeuille (optionnel)</Label>
                <Input
                  id="wallet-name"
                  placeholder="Mon Portefeuille Multi-Crypto"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>

              {generatedSeed && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-yellow-50 p-4">
                    <div className="flex items-start space-x-2">
                      <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Phrase de récupération générée !</p>
                        <p>Sauvegardez cette phrase en lieu sûr. Elle permet de récupérer tous vos comptes crypto.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Votre phrase de récupération (12 mots)</Label>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => setShowSeed(!showSeed)}>
                          {showSeed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={copySeedPhrase}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={showSeed ? generatedSeed : "••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••"}
                      readOnly
                      rows={3}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="seed-confirmed"
                      checked={seedConfirmed}
                      onChange={(e) => setSeedConfirmed(e.target.checked)}
                    />
                    <Label htmlFor="seed-confirmed" className="text-sm">
                      J'ai sauvegardé ma phrase de récupération en lieu sûr
                    </Label>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-blue-50 p-4">
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Cryptomonnaies supportées :</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Bitcoin (BTC)</li>
                    <li>Ethereum (ETH) + tokens ERC-20</li>
                    <li>Algorand (ALGO)</li>
                    <li>Possibilité d'ajouter d'autres comptes</li>
                  </ul>
                </div>
              </div>

              {!generatedSeed ? (
                <Button onClick={handleCreateWallet} className="w-full">
                  Générer un nouveau portefeuille
                </Button>
              ) : (
                <Button onClick={handleCreateWallet} className="w-full" disabled={!seedConfirmed}>
                  Continuer avec ce portefeuille
                </Button>
              )}
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-name-import">Nom du portefeuille (optionnel)</Label>
                <Input
                  id="wallet-name-import"
                  placeholder="Portefeuille Importé"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seed-phrase">Phrase de récupération (12 ou 24 mots)</Label>
                <Textarea
                  id="seed-phrase"
                  placeholder="Entrez votre phrase de récupération..."
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-start space-x-2">
                  <Key className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Sécurité</p>
                    <p>
                      Votre phrase de récupération génère automatiquement des comptes pour Bitcoin, Ethereum et
                      Algorand.
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleImportWallet} className="w-full" disabled={!seedPhrase.trim()}>
                Importer le portefeuille
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
