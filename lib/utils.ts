import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "CHF"): string {
  const locales = {
    CHF: "fr-CH",
    EUR: "de-DE",
    USD: "en-US",
  }

  return new Intl.NumberFormat(locales[currency as keyof typeof locales] || "fr-CH", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatCrypto(amount: number, symbol: string): string {
  return `${amount.toFixed(8)} ${symbol.toUpperCase()}`
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString("fr-CH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function generateTransactionId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function isValidAddress(address: string, type: "btc" | "eth" | "algo"): boolean {
  switch (type) {
    case "btc":
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || /^bc1[a-z0-9]{39,59}$/.test(address)
    case "eth":
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    case "algo":
      return /^[A-Z2-7]{58}$/.test(address)
    default:
      return false
  }
}

export function shortenAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}
