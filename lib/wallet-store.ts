// Zustand store for wallet state management
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WalletSecureStorage } from './secure-storage'
import { BlockchainManager, type BlockchainBalance } from './blockchain-apis'
import { toast } from 'sonner'

export interface WalletState {
  // Wallet data
  walletData: any | null
  pin: string
  isAuthenticated: boolean
  
  // Blockchain data
  blockchainBalances: BlockchainBalance[]
  isLoadingBalances: boolean
  lastBalanceUpdate: Date | null
  
  // UI state
  currentPage: string
  showBalance: boolean
  
  // Actions
  setWalletData: (wallet: any) => void
  setPin: (pin: string) => void
  setAuthenticated: (auth: boolean) => void
  setCurrentPage: (page: string) => void
  setShowBalance: (show: boolean) => void
  loadBlockchainData: () => Promise<void>
  refreshBalances: () => Promise<void>
  clearWallet: () => void
  initializeFromStorage: () => void
}

// Blockchain manager instance
const blockchainManager = new BlockchainManager()

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      walletData: null,
      pin: '',
      isAuthenticated: false,
      blockchainBalances: [],
      isLoadingBalances: false,
      lastBalanceUpdate: null,
      currentPage: 'onboarding',
      showBalance: true,

      // Wallet management actions
      setWalletData: (wallet) => {
        set({ walletData: wallet })
        WalletSecureStorage.setWallet(wallet)
      },

      setPin: (pin) => {
        set({ pin })
        WalletSecureStorage.setPin(pin)
      },

      setAuthenticated: (auth) => {
        set({ isAuthenticated: auth })
      },

      setCurrentPage: (page) => {
        set({ currentPage: page })
      },

      setShowBalance: (show) => {
        set({ showBalance: show })
      },

      // Initialize from secure storage
      initializeFromStorage: () => {
        try {
          const savedWallet = WalletSecureStorage.getWallet()
          const savedPin = WalletSecureStorage.getPin()

          if (savedWallet && savedPin) {
            set({
              walletData: savedWallet,
              pin: savedPin,
              isAuthenticated: true,
              currentPage: 'dashboard'
            })
          }
        } catch (error) {
          console.error('Error initializing from storage:', error)
          toast.error('Erreur lors du chargement des données')
        }
      },

      // Load blockchain data
      loadBlockchainData: async () => {
        const { walletData } = get()
        if (!walletData?.addresses) {
          console.log('Pas d\'adresses de portefeuille disponibles')
          return
        }

        set({ isLoadingBalances: true })

        try {
          console.log('Chargement des données blockchain...')
          
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          )

          const balancesPromise = blockchainManager.getAllBalances({
            eth: walletData.addresses.ethereum,
            btc: walletData.addresses.bitcoin,
          })

          const balances = await Promise.race([balancesPromise, timeoutPromise]) as BlockchainBalance[]

          console.log('Soldes chargés:', balances)
          set({ 
            blockchainBalances: balances,
            lastBalanceUpdate: new Date(),
            isLoadingBalances: false
          })
        } catch (error) {
          console.error('Erreur lors du chargement des données blockchain:', error)
          toast.error('Impossible de rafraîchir les soldes. Vérifiez votre connexion.')

          // Use default balances if no data exists
          const { blockchainBalances } = get()
          if (blockchainBalances.length === 0) {
            const defaultBalances: BlockchainBalance[] = [
              { symbol: 'ETH', balance: '0.000000', balanceUSD: '0.00', address: walletData.addresses.ethereum },
              { symbol: 'BTC', balance: '0.00000000', balanceUSD: '0.00', address: walletData.addresses.bitcoin },
              { symbol: 'USDT', balance: '0.00', balanceUSD: '0.00', address: walletData.addresses.ethereum },
            ]
            set({ blockchainBalances: defaultBalances })
          }
          set({ isLoadingBalances: false })
        }
      },

      // Refresh balances
      refreshBalances: async () => {
        await get().loadBlockchainData()
      },

      // Clear wallet data
      clearWallet: () => {
        WalletSecureStorage.clearWallet()
        set({
          walletData: null,
          pin: '',
          isAuthenticated: false,
          blockchainBalances: [],
          lastBalanceUpdate: null,
          currentPage: 'onboarding'
        })
        toast.success('Portefeuille supprimé avec succès')
      },
    }),
    {
      name: 'wallet-store',
      // Only persist non-sensitive UI state
      partialize: (state) => ({
        showBalance: state.showBalance,
        currentPage: state.currentPage,
        // Don't persist sensitive data in localStorage - use secure storage instead
      }),
    }
  )
)

// Convenience hooks for specific data
export const useWalletData = () => useWalletStore((state) => state.walletData)
export const useBalances = () => useWalletStore((state) => state.blockchainBalances)
export const useIsLoading = () => useWalletStore((state) => state.isLoadingBalances)
export const useAuthentication = () => useWalletStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  setAuthenticated: state.setAuthenticated
}))

// Computed values
export const useTotalBalance = () => useWalletStore((state) => {
  return state.blockchainBalances.reduce((sum, balance) => {
    return sum + parseFloat(balance.balanceUSD || '0')
  }, 0)
})