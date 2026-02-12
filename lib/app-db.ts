interface StoredTransaction {
  id: string
  type: 'received' | 'sent'
  crypto: string
  amount: number | string
  value: number
  from?: string
  to?: string
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

const TX_STORAGE_KEY = 'transaction-history'

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined'

export function loadTransactions(): StoredTransaction[] {
  if (!isBrowser()) return []

  try {
    const raw = localStorage.getItem(TX_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((tx): tx is StoredTransaction => {
      return !!tx && typeof tx.id === 'string' && typeof tx.timestamp === 'string'
    })
  } catch {
    return []
  }
}

export function loadRecentTransactions(limit = 3): StoredTransaction[] {
  return loadTransactions()
    .sort((a, b) => {
      const aTs = new Date(a.timestamp).getTime()
      const bTs = new Date(b.timestamp).getTime()
      return bTs - aTs
    })
    .slice(0, Math.max(limit, 0))
}
