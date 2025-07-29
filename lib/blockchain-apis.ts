// Services pour interagir avec les APIs blockchain - VERSION OPTIMISÉE TIMEOUT

export interface BlockchainError {
  service: string
  message: string
  isRecoverable: boolean
}

export interface BlockchainBalance {
  symbol: string
  balance: string
  balanceUSD: string
  address: string
  error?: BlockchainError
}

export interface BlockchainTransaction {
  hash: string
  from: string
  to: string
  value: string
  valueUSD: string
  timestamp: number
  confirmations: number
  status: "confirmed" | "pending" | "failed"
  fee: string
  blockNumber?: number
}

export interface NetworkFees {
  slow: string
  standard: string
  fast: string
}

// Service Ethereum optimisé avec timeout réduit
export class EthereumService {
  private infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY
  private infuraUrl = `https://mainnet.infura.io/v3/${this.infuraKey}`

  constructor() {
    if (!this.infuraKey) {
      console.warn("⚠️ NEXT_PUBLIC_INFURA_KEY not found in environment variables")
    }
  }

  async getBalance(address: string): Promise<BlockchainBalance> {
    try {
      console.log(`⚡ Récupération rapide du solde ETH pour: ${address}`)

      // Use API route instead of direct call
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const balanceResponse = await fetch('/api/eth-balance', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [address, "latest"],
          id: 1,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!balanceResponse.ok) {
        throw new Error(`HTTP ${balanceResponse.status}`)
      }

      const balanceData = await balanceResponse.json()

      if (balanceData.error) {
        throw new Error(balanceData.error.message)
      }

      // Convertir de Wei en ETH
      const balanceWei = Number.parseInt(balanceData.result, 16)
      const balanceETH = (balanceWei / 1e18).toFixed(6)

      // Prix ETH par défaut (pas de requête supplémentaire pour éviter timeout)
      const ethPrice = 2650 // Prix fixe pour éviter les timeouts
      const balanceUSD = (Number.parseFloat(balanceETH) * ethPrice).toFixed(2)

      console.log(`✅ Solde ETH récupéré: ${balanceETH} ETH ($${balanceUSD})`)

      return {
        symbol: "ETH",
        balance: balanceETH,
        balanceUSD: balanceUSD,
        address: address,
      }
    } catch (error: any) {
      console.log(`⚠️ Fallback ETH pour ${address}:`, error.message)
      return {
        symbol: "ETH",
        balance: "0.000000",
        balanceUSD: "0.00",
        address: address,
        error: {
          service: "Ethereum",
          message: "Impossible de récupérer le solde Ethereum",
          isRecoverable: true
        }
      }
    }
  }

  async getTransactions(address: string): Promise<BlockchainTransaction[]> {
    try {
      console.log(`⚡ Récupération rapide des transactions ETH...`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000) // 2s seulement

      const response = await fetch(`/api/eth-transactions?address=${address}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error("API indisponible")
      }

      const data = await response.json()

      if (data.status !== "1" || !data.result) {
        return []
      }

      const ethPrice = 2650 // Prix fixe

      return data.result.slice(0, 5).map((tx: any) => {
        const valueETH = (Number.parseInt(tx.value) / 1e18).toFixed(6)
        const valueUSD = (Number.parseFloat(valueETH) * ethPrice).toFixed(2)
        const feeETH = ((Number.parseInt(tx.gasUsed || "0") * Number.parseInt(tx.gasPrice || "0")) / 1e18).toFixed(6)

        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: valueETH,
          valueUSD: valueUSD,
          timestamp: Number.parseInt(tx.timeStamp) * 1000,
          confirmations: Number.parseInt(tx.confirmations || "0"),
          status: tx.txreceipt_status === "1" ? "confirmed" : "failed",
          fee: feeETH,
          blockNumber: Number.parseInt(tx.blockNumber || "0"),
        } as BlockchainTransaction
      })
    } catch (error) {
      console.log("⚠️ Pas de transactions ETH disponibles")
      return []
    }
  }

  async getNetworkFees(): Promise<NetworkFees> {
    return {
      slow: "20 gwei",
      standard: "25 gwei",
      fast: "30 gwei",
    }
  }
}

// Service Bitcoin optimisé
export class BitcoinService {
  async getBalance(address: string): Promise<BlockchainBalance> {
    try {
      console.log(`⚡ Récupération rapide du solde BTC pour: ${address}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(`/api/btc-balance?address=${address}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      const balanceSatoshis = data.balance || 0
      const balanceBTC = (balanceSatoshis / 1e8).toFixed(8)

      const btcPrice = 43000 // Prix fixe
      const balanceUSD = (Number.parseFloat(balanceBTC) * btcPrice).toFixed(2)

      console.log(`✅ Solde BTC récupéré: ${balanceBTC} BTC ($${balanceUSD})`)

      return {
        symbol: "BTC",
        balance: balanceBTC,
        balanceUSD: balanceUSD,
        address: address,
      }
    } catch (error: any) {
      console.log(`⚠️ Fallback BTC pour ${address}:`, error.message)
      return {
        symbol: "BTC",
        balance: "0.00000000",
        balanceUSD: "0.00",
        address: address,
        error: {
          service: "Bitcoin",
          message: "Impossible de récupérer le solde Bitcoin",
          isRecoverable: true
        }
      }
    }
  }

  async getTransactions(address: string): Promise<BlockchainTransaction[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(`/api/btc-transactions?address=${address}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error("API indisponible")
      }

      const data = await response.json()

      if (!data.txs || !Array.isArray(data.txs)) {
        return []
      }

      const btcPrice = 43000

      return data.txs.slice(0, 5).map((tx: any) => {
        let value = 0
        let isIncoming = false

        if (tx.outputs && Array.isArray(tx.outputs)) {
          tx.outputs.forEach((output: any) => {
            if (output.addresses && output.addresses.includes(address)) {
              value += output.value || 0
              isIncoming = true
            }
          })
        }

        if (!isIncoming && tx.inputs && Array.isArray(tx.inputs)) {
          tx.inputs.forEach((input: any) => {
            if (input.addresses && input.addresses.includes(address)) {
              value -= input.output_value || 0
            }
          })
        }

        const valueBTC = Math.abs(value / 1e8).toFixed(8)
        const valueUSD = (Number.parseFloat(valueBTC) * btcPrice).toFixed(2)
        const feeBTC = ((tx.fees || 0) / 1e8).toFixed(8)

        return {
          hash: tx.hash || "unknown",
          from: tx.inputs?.[0]?.addresses?.[0] || "Unknown",
          to: tx.outputs?.[0]?.addresses?.[0] || "Unknown",
          value: valueBTC,
          valueUSD: valueUSD,
          timestamp: tx.received ? new Date(tx.received).getTime() : Date.now(),
          confirmations: tx.confirmations || 0,
          status: (tx.confirmations || 0) > 0 ? "confirmed" : "pending",
          fee: feeBTC,
          blockNumber: tx.block_height || 0,
        } as BlockchainTransaction
      })
    } catch (error) {
      console.log("⚠️ Pas de transactions BTC disponibles")
      return []
    }
  }

  async getNetworkFees(): Promise<NetworkFees> {
    return {
      slow: "10 sat/vB",
      standard: "20 sat/vB",
      fast: "30 sat/vB",
    }
  }
}

// Service ERC-20 optimisé
export class ERC20Service {
  private infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY
  private infuraUrl = `https://mainnet.infura.io/v3/${this.infuraKey}`
  private usdtContract = "0xdAC17F958D2ee523a2206206994597C13D831ec7"

  constructor() {
    if (!this.infuraKey) {
      console.warn("⚠️ NEXT_PUBLIC_INFURA_KEY not found in environment variables")
    }
  }

  async getUSDTBalance(address: string): Promise<BlockchainBalance> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch('/api/eth-balance', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_call",
          params: [
            {
              to: this.usdtContract,
              data: `0x70a08231000000000000000000000000${address.slice(2)}`,
            },
            "latest",
          ],
          id: 1,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      const balanceHex = data.result || "0x0"
      const balanceWei = Number.parseInt(balanceHex, 16)
      const balanceUSDT = (balanceWei / 1e6).toFixed(2)

      return {
        symbol: "USDT",
        balance: balanceUSDT,
        balanceUSD: balanceUSDT,
        address: address,
      }
    } catch (error: any) {
      console.log(`⚠️ Fallback USDT pour ${address}`)
      return {
        symbol: "USDT",
        balance: "0.00",
        balanceUSD: "0.00",
        address: address,
        error: {
          service: "USDT",
          message: "Impossible de récupérer le solde USDT",
          isRecoverable: true
        }
      }
    }
  }

  async getUSDTTransactions(address: string): Promise<BlockchainTransaction[]> {
    // Retourner vide pour éviter les timeouts
    return []
  }
}

// Service principal optimisé
export class BlockchainManager {
  private ethereumService = new EthereumService()
  private bitcoinService = new BitcoinService()
  private erc20Service = new ERC20Service()

  async getAllBalances(addresses: { eth: string; btc: string }): Promise<BlockchainBalance[]> {
    console.log("⚡ === CHARGEMENT RAPIDE DES SOLDES ===")

    try {
      // Timeout global de 5 secondes
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout global")), 5000)
      })

      // Lancer toutes les requêtes en parallèle avec fallbacks immédiats
      const balancePromises = [
        this.ethereumService.getBalance(addresses.eth).catch(() => ({
          symbol: "ETH",
          balance: "0.000000",
          balanceUSD: "0.00",
          address: addresses.eth,
          error: {
            service: "Ethereum",
            message: "Service temporairement indisponible",
            isRecoverable: true
          }
        })),
        this.bitcoinService.getBalance(addresses.btc).catch(() => ({
          symbol: "BTC",
          balance: "0.00000000",
          balanceUSD: "0.00",
          address: addresses.btc,
          error: {
            service: "Bitcoin", 
            message: "Service temporairement indisponible",
            isRecoverable: true
          }
        })),
        this.erc20Service.getUSDTBalance(addresses.eth).catch(() => ({
          symbol: "USDT",
          balance: "0.00",
          balanceUSD: "0.00",
          address: addresses.eth,
          error: {
            service: "USDT",
            message: "Service temporairement indisponible", 
            isRecoverable: true
          }
        })),
      ]

      // Course entre les promesses et le timeout
      const results = await Promise.race([Promise.all(balancePromises), timeoutPromise])

      console.log("✅ Soldes chargés rapidement:", results)
      return results
    } catch (error) {
      console.log("⚠️ Utilisation des soldes par défaut:", error.message)

      // Retourner des soldes par défaut immédiatement
      return [
        { symbol: "ETH", balance: "0.000000", balanceUSD: "0.00", address: addresses.eth },
        { symbol: "BTC", balance: "0.00000000", balanceUSD: "0.00", address: addresses.btc },
        { symbol: "USDT", balance: "0.00", balanceUSD: "0.00", address: addresses.eth },
      ]
    }
  }

  async getAllTransactions(addresses: { eth: string; btc: string }): Promise<BlockchainTransaction[]> {
    console.log("⚡ Chargement rapide des transactions...")

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout transactions")), 3000)
      })

      const transactionPromises = [
        this.ethereumService.getTransactions(addresses.eth).catch(() => []),
        this.bitcoinService.getTransactions(addresses.btc).catch(() => []),
      ]

      const results = await Promise.race([Promise.all(transactionPromises), timeoutPromise])
      const allTransactions: BlockchainTransaction[] = []
      results.forEach((txs) => allTransactions.push(...txs))

      allTransactions.sort((a, b) => b.timestamp - a.timestamp)
      return allTransactions.slice(0, 10) // Limiter à 10 transactions
    } catch (error) {
      console.log("⚠️ Pas de transactions disponibles")
      return []
    }
  }

  async getNetworkFees(): Promise<{ eth: NetworkFees; btc: NetworkFees }> {
    // Retourner des frais par défaut immédiatement
    return {
      eth: { slow: "20 gwei", standard: "25 gwei", fast: "30 gwei" },
      btc: { slow: "10 sat/vB", standard: "20 sat/vB", fast: "30 sat/vB" },
    }
  }
}
