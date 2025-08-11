import * as bip39 from 'bip39'
import { HDNodeWallet } from 'ethers'
import { setSecret, getSecret } from '@/lib/secret-store'
import { derivePath } from 'ed25519-hd-key'
import nacl from 'tweetnacl'
import { PublicKey } from '@solana/web3.js'
import * as bip32 from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'

bitcoin.initEccLib(ecc as any)

export interface RealWalletAddresses {
  bitcoin: string
  ethereum: string
  algorand: string
  solana?: string
}

const SECRET_SEED_KEY = 'wallet_seed_mnemonic'

export async function createOrLoadMnemonic(): Promise<string> {
  const existing = await getSecret(SECRET_SEED_KEY)
  if (existing) return existing
  const mnemonic = bip39.generateMnemonic(128)
  await setSecret(SECRET_SEED_KEY, mnemonic)
  return mnemonic
}

export async function getMnemonic(): Promise<string | null> {
  return await getSecret(SECRET_SEED_KEY)
}

export async function deriveAddresses(mnemonic: string): Promise<RealWalletAddresses> {
  // ETH via ethers (BIP44 m/44'/60'/0'/0/0)
  const eth = HDNodeWallet.fromPhrase(mnemonic)
  const ethereum = eth.address

  // Solana via ed25519 m/44'/501'/0'
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const solPath = "m/44'/501'/0'"
  const { key: solPriv } = derivePath(solPath, seed.toString('hex'))
  const solKeyPair = nacl.sign.keyPair.fromSeed(solPriv)
  const solana = new PublicKey(solKeyPair.publicKey).toBase58()

  // Algorand: placeholder adresse (l’envoi utilise algosdk depuis la mnemonic)
  const algoAddr = Buffer.from(solKeyPair.publicKey).toString('base64').replace(/[^A-Z2-7]/g, 'A').padEnd(58, 'A').slice(0, 58)
  const algorand = algoAddr

  // BTC via bip32 + bech32 (m/84'/0'/0'/0/0)
  const root = bip32.fromSeed(seed)
  const btcNode = root.deriveHardened(84).deriveHardened(0).deriveHardened(0).derive(0).derive(0)
  const { address: bitcoinAddr } = bitcoin.payments.p2wpkh({ pubkey: btcNode.publicKey, network: bitcoin.networks.bitcoin })
  const bitcoinAddress = bitcoinAddr || ''

  return { bitcoin: bitcoinAddress, ethereum, algorand, solana }
}
