// Services pour interagir avec les APIs blockchain - VERSION PROD RÉELLE

import { INFURA_ETH_HTTP, BLOCKCYPHER_TOKEN, ALGORAND_API_BASE, ETHERSCAN_API_KEY, SOLANA_HTTP_URL } from '@/lib/config'
import { ethers } from 'ethers'
import algosdk from 'algosdk'
import * as bip39 from 'bip39'
import * as bip32 from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'
import { ECPairFactory } from 'ecpair'
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { derivePath } from 'ed25519-hd-key'
import nacl from 'tweetnacl'

bitcoin.initEccLib(ecc as any)
const ECPair = ECPairFactory(ecc as any)

export interface BlockchainBalance {
  symbol: string
  balance: string
  balanceUSD: string
  address: string
}

export interface BlockchainTransaction {
  hash: string
  from: string
  to: string
  value: string
  valueUSD: string
  timestamp: number
  confirmations: number
  status: 'confirmed' | 'pending' | 'failed'
  fee: string
  blockNumber?: number
}

export interface NetworkFees {
  slow: string
  standard: string
  fast: string
}

export interface CryptoBalance {
  bitcoin: string
  ethereum: string
  algorand: string
}

export class EthereumService {
  private rpcUrl = INFURA_ETH_HTTP

  async getBalance(address: string): Promise<BlockchainBalance> {
    const provider = new ethers.JsonRpcProvider(this.rpcUrl)
    const balance = await provider.getBalance(address)
    const balanceETH = ethers.formatEther(balance)
    return { symbol: 'ETH', balance: Number.parseFloat(balanceETH).toFixed(6), balanceUSD: '0.00', address }
  }

  async getTransactions(address: string): Promise<BlockchainTransaction[]> {
    if (!ETHERSCAN_API_KEY) return []
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    if (data.status !== '1') return []
    return data.result.slice(0, 10).map((tx: any) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: (parseInt(tx.value) / 1e18).toFixed(6),
      valueUSD: '0.00',
      timestamp: parseInt(tx.timeStamp) * 1000,
      confirmations: parseInt(tx.confirmations || '0'),
      status: tx.txreceipt_status === '1' ? 'confirmed' : 'failed',
      fee: ((parseInt(tx.gasUsed || '0') * parseInt(tx.gasPrice || '0')) / 1e18).toFixed(6),
      blockNumber: parseInt(tx.blockNumber || '0'),
    }))
  }

  async send(fromMnemonic: string, to: string, amountEth: string): Promise<string> {
    const wallet = ethers.Wallet.fromPhrase(fromMnemonic).connect(new ethers.JsonRpcProvider(this.rpcUrl))
    const tx = await wallet.sendTransaction({ to, value: ethers.parseEther(amountEth) })
    return tx.hash
  }
}

export class BitcoinService {
  async getBalance(address: string): Promise<BlockchainBalance> {
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance?token=${BLOCKCYPHER_TOKEN}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`BlockCypher balance HTTP ${res.status}`)
    const data = await res.json()
    const balanceBTC = ((data.balance || 0) / 1e8).toFixed(8)
    return { symbol: 'BTC', balance: balanceBTC, balanceUSD: '0.00', address }
  }

  async getTransactions(address: string): Promise<BlockchainTransaction[]> {
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=10&token=${BLOCKCYPHER_TOKEN}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.txs) return []
    return data.txs.slice(0, 10).map((tx: any) => {
      const feeBTC = ((tx.fees || 0) / 1e8).toFixed(8)
      return {
        hash: tx.hash || 'unknown',
        from: tx.inputs?.[0]?.addresses?.[0] || 'Unknown',
        to: tx.outputs?.[0]?.addresses?.[0] || 'Unknown',
        value: ((Math.abs((tx.total || 0)) / 1e8)).toFixed(8),
        valueUSD: '0.00',
        timestamp: tx.received ? new Date(tx.received).getTime() : Date.now(),
        confirmations: tx.confirmations || 0,
        status: (tx.confirmations || 0) > 0 ? 'confirmed' : 'pending',
        fee: feeBTC,
        blockNumber: tx.block_height || 0,
      }
    })
  }

  async send(fromMnemonic: string, to: string, amountBtc: string): Promise<string> {
    const seed = await bip39.mnemonicToSeed(fromMnemonic)
    const root = bip32.fromSeed(seed)
    const node = root.deriveHardened(84).deriveHardened(0).deriveHardened(0).derive(0).derive(0)
    const ecp = ECPair.fromPrivateKey(node.privateKey as Buffer)

    const addr = bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network: bitcoin.networks.bitcoin }).address!
    const utxoRes = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${addr}?unspentOnly=true&token=${BLOCKCYPHER_TOKEN}`)
    if (!utxoRes.ok) throw new Error('UTXO fetch failed')
    const utxoData = await utxoRes.json()
    const utxos = (utxoData.txrefs || []) as Array<{ tx_hash: string; tx_output_n: number; value: number }>
    if (utxos.length === 0) throw new Error('Aucun UTXO disponible')

    const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin })
    let inputTotal = 0
    const feeSat = 10000
    const sendSat = Math.round(parseFloat(amountBtc) * 1e8)

    for (const u of utxos.slice(0, 2)) {
      psbt.addInput({ hash: u.tx_hash, index: u.tx_output_n, witnessUtxo: { script: bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network: bitcoin.networks.bitcoin }).output!, value: u.value } })
      inputTotal += u.value
      if (inputTotal >= sendSat + feeSat) break
    }
    if (inputTotal < sendSat + feeSat) throw new Error('Solde insuffisant pour frais')

    psbt.addOutput({ address: to, value: sendSat })
    const change = inputTotal - sendSat - feeSat
    if (change > 0) psbt.addOutput({ address: addr, value: change })

    utxos.slice(0, psbt.inputCount).forEach((_, i) => psbt.signInput(i, ecp))
    psbt.finalizeAllInputs()
    const rawTx = psbt.extractTransaction().toHex()

    const pushRes = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/push?token=${BLOCKCYPHER_TOKEN}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tx: rawTx })
    })
    if (!pushRes.ok) throw new Error('Broadcast failed')
    const push = await pushRes.json()
    return push.tx?.hash || ''
  }
}

export class AlgorandService {
  async getBalance(address: string): Promise<BlockchainBalance> {
    const url = `${ALGORAND_API_BASE}/v2/accounts/${address}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`Algorand HTTP ${res.status}`)
    const data = await res.json()
    const balanceALGO = ((data.amount || 0) / 1e6).toFixed(6)
    return { symbol: 'ALGO', balance: balanceALGO, balanceUSD: '0.00', address }
  }

  async getTransactions(address: string): Promise<BlockchainTransaction[]> {
    const url = `${ALGORAND_API_BASE}/v2/accounts/${address}/transactions?limit=10`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data.transactions)) return []
    return data.transactions.slice(0, 10).map((tx: any) => ({
      hash: tx.id,
      from: tx.sender,
      to: tx.receiver,
      value: (tx.amount / 1e6).toFixed(6),
      valueUSD: '0.00',
      timestamp: (tx.round_time || Math.floor(Date.now()/1000)) * 1000,
      confirmations: tx.confirmed_round || 0,
      status: (tx.confirmed_round || 0) > 0 ? 'confirmed' : 'pending',
      fee: (tx.fee / 1e6).toFixed(6),
      blockNumber: tx.round || 0,
    }))
  }

  async send(fromMnemonic: string, to: string, amountAlgo: string): Promise<string> {
    const account = algosdk.mnemonicToSecretKey(fromMnemonic)
    const client = new algosdk.Algodv2('', ALGORAND_API_BASE, '')
    const params = await client.getTransactionParams().do()
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: account.addr,
      to,
      amount: Math.round(Number(amountAlgo) * 1e6),
      suggestedParams: params,
    })
    const signed = txn.signTxn(account.sk)
    const { txId } = await client.sendRawTransaction(signed).do()
    return txId
  }
}

export class SolanaService {
  private connection = new Connection(SOLANA_HTTP_URL, 'confirmed')

  private deriveKeypairFromMnemonic(mnemonic: string): Keypair {
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const path = "m/44'/501'/0'"
    const { key } = derivePath(path, seed.toString('hex'))
    const kp = nacl.sign.keyPair.fromSeed(key)
    return Keypair.fromSecretKey(Buffer.from(kp.secretKey))
  }

  async sendSOL(fromMnemonic: string, toAddress: string, amountSol: string): Promise<string> {
    const from = this.deriveKeypairFromMnemonic(fromMnemonic)
    const toPubkey = new PublicKey(toAddress)
    const lamports = Math.round(parseFloat(amountSol) * 1e9)

    const tx = new Transaction().add(
      SystemProgram.transfer({ fromPubkey: from.publicKey, toPubkey: toPubkey, lamports })
    )
    const sig = await sendAndConfirmTransaction(this.connection, tx, [from])
    return sig
  }

  async sendUSDC(fromMnemonic: string, toAddress: string, amount: string, usdcMint: string): Promise<string> {
    const from = this.deriveKeypairFromMnemonic(fromMnemonic)
    const mint = new PublicKey(usdcMint)
    const toOwner = new PublicKey(toAddress)
    const fromAta = await getAssociatedTokenAddress(mint, from.publicKey)
    const toAta = await getAssociatedTokenAddress(mint, toOwner)

    // 6 décimales USDC
    const amountU = Math.round(parseFloat(amount) * 1e6)

    const ix = createTransferInstruction(fromAta, toAta, from.publicKey, amountU, [], TOKEN_PROGRAM_ID)
    const tx = new Transaction().add(ix)
    const sig = await sendAndConfirmTransaction(this.connection, tx, [from])
    return sig
  }
}

export class BlockchainManager {
  private ethereumService = new EthereumService()
  private bitcoinService = new BitcoinService()
  private algorandService = new AlgorandService()

  async getAllBalances(addresses: { bitcoin: string; ethereum: string; algorand: string }): Promise<CryptoBalance> {
    const [eth, btc, algo] = await Promise.all([
      this.ethereumService.getBalance(addresses.ethereum).catch(() => ({ symbol: 'ETH', balance: '0', balanceUSD: '0', address: addresses.ethereum })),
      this.bitcoinService.getBalance(addresses.bitcoin).catch(() => ({ symbol: 'BTC', balance: '0', balanceUSD: '0', address: addresses.bitcoin })),
      this.algorandService.getBalance(addresses.algorand).catch(() => ({ symbol: 'ALGO', balance: '0', balanceUSD: '0', address: addresses.algorand })),
    ])

    return {
      bitcoin: btc.balance,
      ethereum: eth.balance,
      algorand: algo.balance,
    }
  }

  async getAllTransactions(addresses: { bitcoin: string; ethereum: string; algorand: string }): Promise<BlockchainTransaction[]> {
    const [eth, btc, algo] = await Promise.all([
      this.ethereumService.getTransactions(addresses.ethereum).catch(() => []),
      this.bitcoinService.getTransactions(addresses.bitcoin).catch(() => []),
      this.algorandService.getTransactions(addresses.algorand).catch(() => []),
    ])

    const all = [...eth, ...btc, ...algo]
    all.sort((a, b) => b.timestamp - a.timestamp)
    return all.slice(0, 20)
  }
}

export async function fetchBalances(addresses: { bitcoin: string; ethereum: string; algorand: string }): Promise<CryptoBalance> {
  const manager = new BlockchainManager()
  return manager.getAllBalances({ bitcoin: addresses.bitcoin, ethereum: addresses.ethereum, algorand: addresses.algorand })
}

export async function sendTransaction(
  crypto: 'bitcoin' | 'ethereum' | 'algorand' | 'solana' | 'usdc_spl',
  senderMnemonic: string,
  recipientAddress: string,
  amount: string,
  extra?: { usdcMint?: string }
): Promise<{ txId: string }> {
  if (crypto === 'ethereum') {
    const service = new EthereumService()
    const hash = await service.send(senderMnemonic, recipientAddress, amount)
    return { txId: hash }
  }
  if (crypto === 'algorand') {
    const service = new AlgorandService()
    const txId = await service.send(senderMnemonic, recipientAddress, amount)
    return { txId }
  }
  if (crypto === 'bitcoin') {
    const service = new BitcoinService()
    const txId = await service.send(senderMnemonic, recipientAddress, amount)
    return { txId }
  }
  if (crypto === 'solana') {
    const service = new SolanaService()
    const sig = await service.sendSOL(senderMnemonic, recipientAddress, amount)
    return { txId: sig }
  }
  if (crypto === 'usdc_spl') {
    if (!extra?.usdcMint) throw new Error('usdcMint requis')
    const service = new SolanaService()
    const sig = await service.sendUSDC(senderMnemonic, recipientAddress, amount, extra.usdcMint)
    return { txId: sig }
  }
  throw new Error('Crypto non supportée')
}
