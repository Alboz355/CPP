import * as bip39 from 'bip39'
import { HDNodeWallet } from 'ethers'
import { setSecret, getSecret } from '@/lib/secret-store'
import { derivePath } from 'ed25519-hd-key'
import nacl from 'tweetnacl'
import { PublicKey, Keypair } from '@solana/web3.js'
import * as bip32 from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'
import algosdk from 'algosdk'

bitcoin.initEccLib(ecc as any)

export interface RealWalletAddresses {
  bitcoin: string
  ethereum: string
  algorand: string
  solana: string
  usdc: string // USDC sur Ethereum (ERC-20)
}

export interface WalletKeyPairs {
  bitcoin: {
    privateKey: string
    publicKey: string
    address: string
  }
  ethereum: {
    privateKey: string
    publicKey: string
    address: string
  }
  algorand: {
    privateKey: Uint8Array
    publicKey: Uint8Array
    address: string
    mnemonic: string
  }
  solana: {
    privateKey: Uint8Array
    publicKey: Uint8Array
    address: string
    keypair: Keypair
  }
}

const SECRET_SEED_KEY = 'wallet_seed_mnemonic'

export async function createOrLoadMnemonic(): Promise<string> {
  const existing = await getSecret(SECRET_SEED_KEY)
  if (existing) {
    console.log('📂 Utilisation mnemonic existante')
    return existing
  }
  
  // Générer une vraie phrase de récupération BIP39 de 12 mots
  const mnemonic = bip39.generateMnemonic(128) // 128 bits = 12 mots
  await setSecret(SECRET_SEED_KEY, mnemonic)
  console.log('🔑 Nouvelle phrase de récupération générée:', mnemonic.split(' ').length, 'mots')
  return mnemonic
}

export async function getMnemonic(): Promise<string | null> {
  return await getSecret(SECRET_SEED_KEY)
}

// Fonction complète pour dériver toutes les adresses crypto réelles
export async function deriveAddresses(mnemonic: string): Promise<RealWalletAddresses> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Phrase de récupération invalide')
  }

  console.log('🔄 Dérivation des adresses depuis la phrase de récupération...')

  // Générer la seed depuis la mnemonic
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const root = bip32.fromSeed(seed)

  // 1. BITCOIN - m/84'/0'/0'/0/0 (Native SegWit - bech32)
  console.log('₿ Génération adresse Bitcoin...')
  const btcNode = root.deriveHardened(84).deriveHardened(0).deriveHardened(0).derive(0).derive(0)
  const { address: bitcoinAddr } = bitcoin.payments.p2wpkh({ 
    pubkey: btcNode.publicKey, 
    network: bitcoin.networks.bitcoin 
  })
  const bitcoin = bitcoinAddr || ''
  console.log('✅ Bitcoin:', bitcoin)

  // 2. ETHEREUM - m/44'/60'/0'/0/0 (Standard BIP44)
  console.log('Ξ Génération adresse Ethereum...')
  const ethWallet = HDNodeWallet.fromPhrase(mnemonic)
  const ethereum = ethWallet.address
  console.log('✅ Ethereum:', ethereum)

  // 3. SOLANA - m/44'/501'/0'/0' (Ed25519)
  console.log('◎ Génération adresse Solana...')
  const solanaPath = "m/44'/501'/0'/0'"
  const { key: solPrivateKey } = derivePath(solanaPath, seed.toString('hex'))
  const solanaKeypair = Keypair.fromSeed(solPrivateKey)
  const solana = solanaKeypair.publicKey.toBase58()
  console.log('✅ Solana:', solana)

  // 4. ALGORAND - Dérivation spécifique Algorand
  console.log('Ⱥ Génération adresse Algorand...')
  // Utiliser la même seed pour Algorand mais avec leur propre système
  const algoAccount = algosdk.mnemonicToSecretKey(mnemonic)
  const algorand = algoAccount.addr
  console.log('✅ Algorand:', algorand)

  // 5. USDC - Utilise la même adresse Ethereum (ERC-20)
  console.log('💵 USDC utilise l\'adresse Ethereum (ERC-20)')
  const usdc = ethereum // USDC utilise les adresses Ethereum
  console.log('✅ USDC:', usdc)

  return { 
    bitcoin, 
    ethereum, 
    algorand, 
    solana, 
    usdc 
  }
}

// Fonction pour récupérer les clés privées (USAGE INTERNE SEULEMENT)
export async function deriveKeyPairs(mnemonic: string): Promise<WalletKeyPairs> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Phrase de récupération invalide')
  }

  const seed = await bip39.mnemonicToSeed(mnemonic)
  const root = bip32.fromSeed(seed)

  // Bitcoin KeyPair
  const btcNode = root.deriveHardened(84).deriveHardened(0).deriveHardened(0).derive(0).derive(0)
  const { address: bitcoinAddr } = bitcoin.payments.p2wpkh({ 
    pubkey: btcNode.publicKey, 
    network: bitcoin.networks.bitcoin 
  })

  // Ethereum KeyPair
  const ethWallet = HDNodeWallet.fromPhrase(mnemonic)

  // Solana KeyPair
  const solanaPath = "m/44'/501'/0'/0'"
  const { key: solPrivateKey } = derivePath(solanaPath, seed.toString('hex'))
  const solanaKeypair = Keypair.fromSeed(solPrivateKey)

  // Algorand KeyPair
  const algoAccount = algosdk.mnemonicToSecretKey(mnemonic)

  return {
    bitcoin: {
      privateKey: btcNode.privateKey?.toString('hex') || '',
      publicKey: btcNode.publicKey.toString('hex'),
      address: bitcoinAddr || ''
    },
    ethereum: {
      privateKey: ethWallet.privateKey,
      publicKey: ethWallet.publicKey,
      address: ethWallet.address
    },
    algorand: {
      privateKey: algoAccount.sk,
      publicKey: Buffer.from(algoAccount.sk.slice(32)), // Public key is last 32 bytes
      address: algoAccount.addr,
      mnemonic: mnemonic
    },
    solana: {
      privateKey: solanaKeypair.secretKey,
      publicKey: solanaKeypair.publicKey.toBytes(),
      address: solanaKeypair.publicKey.toBase58(),
      keypair: solanaKeypair
    }
  }
}

// Fonction de validation des adresses
export function validateCryptoAddress(address: string, network: string): boolean {
  switch (network.toLowerCase()) {
    case 'bitcoin':
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/.test(address)
    case 'ethereum':
    case 'usdc':
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    case 'solana':
      try {
        new PublicKey(address)
        return true
      } catch {
        return false
      }
    case 'algorand':
      return algosdk.isValidAddress(address)
    default:
      return false
  }
}

// Fonction pour récupérer les informations du wallet
export async function getWalletInfo(): Promise<{
  addresses: RealWalletAddresses,
  mnemonic: string,
  isValid: boolean
} | null> {
  try {
    const mnemonic = await getMnemonic()
    if (!mnemonic) return null

    const addresses = await deriveAddresses(mnemonic)
    const isValid = bip39.validateMnemonic(mnemonic)

    return {
      addresses,
      mnemonic,
      isValid
    }
  } catch (error) {
    console.error('❌ Erreur récupération wallet:', error)
    return null
  }
}

// Fonction pour nettoyer le wallet (ATTENTION: Supprime tout)
export async function clearWallet(): Promise<void> {
  await setSecret(SECRET_SEED_KEY, '')
  console.log('🗑️ Wallet supprimé')
}

// Export des types pour utilisation externe
export { PublicKey, Keypair } from '@solana/web3.js'
export { algosdk }
