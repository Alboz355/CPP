"use client"

import { useState, useEffect } from "react"
import { OnboardingPage, type UserType } from "@/components/onboarding-page"
import { PinSetupPage } from "@/components/pin-setup-page"
import { AppPresentation } from "@/components/app-presentation"
import { MainDashboard } from "@/components/main-dashboard"
import { SendPage } from "@/components/send-page"
import { ReceivePage } from "@/components/receive-page"
import { SettingsPage } from "@/components/settings-page"
import { TransactionHistory } from "@/components/transaction-history"
import { TPEDashboard } from "@/components/tpe-dashboard"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingFallback } from "@/components/loading-fallback"
import { PinVerificationModal } from "@/components/pin-verification-modal"
import { ChangePinModal } from "@/components/change-pin-modal"
import { SeedPhraseModal } from "@/components/seed-phrase-modal"
import { MtPelerinWidget } from "@/components/mt-pelerin-widget"
import { SupportContactModal } from "@/components/support-contact-modal"
import { PriceAlertModal } from "@/components/price-alert-modal"
import { GlobalSearch } from "@/components/global-search"
import { DashboardSkeleton } from "@/components/skeleton-loader"
import { SecurityManager } from "@/lib/security-manager"
import { BackupManager } from "@/lib/backup-manager"
import { OfflineManager } from "@/lib/offline-manager"
import { UserTypeSelection } from "@/components/user-type-selection"
import { setPin as setHashedPin, verifyPin as verifyHashedPin } from "@/lib/pin-utils"
import type { WalletData } from "@/lib/wallet-utils"

export type AppState =
  | "onboarding"
  | "pin-setup"
  | "app-presentation"
  | "dashboard"
  | "send"
  | "receive"
  | "settings"
  | "history"
  | "tpe"
  | "tpe-search"
  | "tpe-billing"
  | "tpe-payment"
  | "tpe-conversion"
  | "tpe-history"
  | "tpe-settings"
  | "tpe-vat-management"
  | "tpe-statistics"
  | "user-selection"
  | "auth"

export default function CryptoWalletApp() {
  const [currentPage, setCurrentPage] = useState<AppState>("onboarding")
  const [nextPage, setNextPage] = useState<AppState | null>(null)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [showChangePinModal, setShowChangePinModal] = useState(false)
  const [showSeedPhraseModal, setShowSeedPhraseModal] = useState(false)
  const [showMtPelerinWidget, setShowMtPelerinWidget] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false)
  const [pendingTPEAccess, setPendingTPEAccess] = useState(false)
  const [tpeAccessGranted, setTpeAccessGranted] = useState(false)
  const [pageTransitionsEnabled, setPageTransitionsEnabled] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const [isAppLocked, setIsAppLocked] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false)
  const [needsInitialAuth, setNeedsInitialAuth] = useState(false)
  const [pinVerificationReason, setPinVerificationReason] = useState<'initial' | 'tpe' | 'locked'>('initial')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load page transitions setting
        const savedPageTransitions = localStorage.getItem("pageTransitions")
        if (savedPageTransitions !== null) {
          setPageTransitionsEnabled(JSON.parse(savedPageTransitions))
        }

        // Vérifier si un portefeuille existe déjà
        const existingWallet = localStorage.getItem("wallet-data")
        const hasCompletedOnboarding = localStorage.getItem("onboarding-completed")
        const savedUserType = localStorage.getItem("user-type") as UserType | null
        const hasSeenPresentation = localStorage.getItem("presentation-seen")
        const hasPinHash = localStorage.getItem("pin-hash")

        console.log("🔍 App initialization:", {
          existingWallet: !!existingWallet,
          hasCompletedOnboarding: !!hasCompletedOnboarding,
          savedUserType,
          hasSeenPresentation: !!hasSeenPresentation,
          hasPinHash: !!hasPinHash
        })

        // Si l'utilisateur a un wallet complet configuré
        if (existingWallet && hasCompletedOnboarding && savedUserType && hasSeenPresentation && hasPinHash) {
          try {
            const parsed = JSON.parse(existingWallet)
            setWalletData(parsed)
            setUserType(savedUserType)
            
            console.log("✅ Wallet existant trouvé - demande d'authentification")
            setNeedsInitialAuth(true)
            setPinVerificationReason('initial')
            setShowPinVerification(true)
            setCurrentPage("auth")
          } catch (error) {
            console.error("❌ Erreur parsing wallet:", error)
            // Reset en cas d'erreur
            localStorage.removeItem("wallet-data")
            localStorage.removeItem("onboarding-completed")
            localStorage.removeItem("user-type")
            localStorage.removeItem("presentation-seen")
            localStorage.removeItem("pin-hash")
            setCurrentPage("user-selection")
          }
        }
        // Si l'utilisateur a choisi un type mais n'a pas terminé l'onboarding
        else if (savedUserType && !hasCompletedOnboarding) {
          console.log("📝 User type selected but onboarding incomplete")
          setUserType(savedUserType)
          setCurrentPage("onboarding")
        }
        // Si l'utilisateur a terminé l'onboarding mais pas vu la présentation
        else if (hasCompletedOnboarding && savedUserType && !hasSeenPresentation) {
          console.log("🎬 Onboarding done but presentation not seen")
          setUserType(savedUserType)
          if (existingWallet) {
            try {
              const parsed = JSON.parse(existingWallet)
              setWalletData(parsed)
            } catch (error) {
              console.error("Erreur parsing wallet:", error)
            }
          }
          setCurrentPage("app-presentation")
        }
        // Nouveau utilisateur
        else {
          console.log("🆕 New user - showing user type selection")
          setCurrentPage("user-selection")
        }
      } catch (error) {
        console.error("❌ Error during app initialization:", error)
        setCurrentPage("user-selection")
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()

    // Initialize managers
    const securityManager = SecurityManager.getInstance()
    const backupManager = BackupManager.getInstance()
    const offlineManager = OfflineManager.getInstance()

    // Setup security manager
    securityManager.setLockCallback(() => {
      setIsAppLocked(true)
      setPinVerificationReason('locked')
      setShowPinVerification(true)
    })

    // Setup offline manager
    setIsOnline(offlineManager.isOnlineStatus())
    const unsubscribeOffline = offlineManager.onStatusChange((online) => {
      setIsOnline(online)
      if (!online) {
        setShowOfflineIndicator(true)
        setTimeout(() => setShowOfflineIndicator(false), 3000)
      }
    })

    // Setup keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowGlobalSearch(true)
      }
      if (e.key === 'Escape') {
        setShowGlobalSearch(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      unsubscribeOffline()
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Listen for changes to page transitions setting
  useEffect(() => {
    const handleStorageChange = () => {
      const savedPageTransitions = localStorage.getItem("pageTransitions")
      if (savedPageTransitions !== null) {
        setPageTransitionsEnabled(JSON.parse(savedPageTransitions))
      }
    }

    // Check immediately
    handleStorageChange()

    // Listen for changes
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleUserTypeSelected = (selectedUserType: UserType) => {
    console.log("👤 User type selected:", selectedUserType)
    setUserType(selectedUserType)
    localStorage.setItem("user-type", selectedUserType)
    navigateToPage("onboarding")
  }

  const handleWalletCreated = (wallet: WalletData, selectedUserType: UserType) => {
    try {
      console.log("💰 Wallet created:", { selectedUserType })
      setWalletData(wallet)
      setUserType(selectedUserType)
      localStorage.setItem("wallet-data", JSON.stringify(wallet))
      localStorage.setItem("user-type", selectedUserType)
      navigateToPage("pin-setup")
    } catch (error) {
      console.error("Erreur sauvegarde portefeuille:", error)
    }
  }

  const handlePinCreated = (pin: string) => {
    try {
      console.log("🔐 PIN created")
      // Stockage sécurisé: hachage salé via WebCrypto
      setHashedPin(pin)
      localStorage.setItem("onboarding-completed", "true")
      navigateToPage("app-presentation")
    } catch (error) {
      console.error("Erreur sauvegarde PIN:", error)
    }
  }

  const handlePresentationComplete = () => {
    console.log("🎬 Presentation completed")
    localStorage.setItem("presentation-seen", "true")
    setIsAuthenticated(true)
    navigateToPage("dashboard")
  }

  const navigateToPage = (page: AppState) => {
    if (page === currentPage || isTransitioning) return

    console.log("🧭 Navigation vers:", page)

    // If transitions are disabled, navigate immediately
    if (!pageTransitionsEnabled) {
      setCurrentPage(page)
      return
    }

    // Professional fade transition - 200ms
    setIsTransitioning(true)
    setNextPage(page)
    
    // Complete transition after fade animation
    setTimeout(() => {
      setCurrentPage(page)
      setNextPage(null)
      setIsTransitioning(false)
    }, 200) // Match CSS animation duration
  }

  const handleNavigate = (page: AppState) => {
    // Vérifier si l'accès au TPE nécessite un PIN (seulement si pas déjà accordé)
    if (page.startsWith("tpe") && !tpeAccessGranted) {
      setPendingTPEAccess(true)
      setPinVerificationReason('tpe')
      setShowPinVerification(true)
      return
    }
    
    navigateToPage(page)
  }

  const handlePinVerified = () => {
    console.log("✅ PIN verified, reason:", pinVerificationReason)
    setShowPinVerification(false)
    
    if (needsInitialAuth) {
      setNeedsInitialAuth(false)
      setIsAuthenticated(true)
      // Naviguer directement vers le dashboard après l'authentification initiale
      console.log("🚀 Initial auth successful - going to dashboard")
      navigateToPage("dashboard")
    }
    
    if (isAppLocked) {
      const securityManager = SecurityManager.getInstance()
      securityManager.unlockApp()
      setIsAppLocked(false)
    }
    
    if (pendingTPEAccess) {
      setPendingTPEAccess(false)
      setTpeAccessGranted(true)
      navigateToPage("tpe")
    }
  }

  const handlePinVerificationCancel = () => {
    setShowPinVerification(false)
    setPendingTPEAccess(false)
    
    if (needsInitialAuth) {
      // Si l'utilisateur annule l'auth initiale, retourner à la sélection
      setNeedsInitialAuth(false)
      setCurrentPage("user-selection")
    }
  }

  const handleChangePinRequest = () => {
    setShowChangePinModal(true)
  }

  const handlePinChanged = (newPin: string) => {
    try {
      // Mise à jour sécurisée du PIN
      setHashedPin(newPin)
      setShowChangePinModal(false)
      alert("Code PIN modifié avec succès !")
    } catch (error) {
      console.error("Erreur changement PIN:", error)
      alert("Erreur lors du changement de PIN")
    }
  }

  const handleShowSeedPhrase = () => {
    setShowSeedPhraseModal(true)
  }

  const handleShowMtPelerin = () => {
    setShowMtPelerinWidget(true)
  }

  const handleShowSupport = () => {
    setShowSupportModal(true)
  }

  const handleShowPriceAlert = () => {
    setShowPriceAlertModal(true)
  }

  const handleExitTPE = () => {
    setTpeAccessGranted(false)
    navigateToPage("dashboard")
  }

  const handleUserTypeChange = (newUserType: UserType) => {
    setUserType(newUserType)
    localStorage.setItem("user-type", newUserType)
  }

  if (isLoading) {
    return <LoadingFallback />
  }

  // Si l'authentification initiale est nécessaire, afficher seulement le modal
  if (currentPage === "auth" && showPinVerification) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background flex items-center justify-center ios-safe-area">
          <div className="text-center space-y-4 ios-content-safe">
            <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
              <div className="text-3xl">🔐</div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Authentification requise</h1>
            <p className="text-muted-foreground">Veuillez vous authentifier pour accéder à votre wallet</p>
          </div>
        </div>

        <PinVerificationModal
          isOpen={showPinVerification}
          onVerified={handlePinVerified}
          onCancel={handlePinVerificationCancel}
          title="Déverrouiller le Wallet"
          description="Authentifiez-vous pour accéder à votre portefeuille crypto"
          reason="initial"
        />
      </ErrorBoundary>
    )
  }

  const renderPage = (page: AppState) => {
    switch (page) {
      case "user-selection":
        return <UserTypeSelection onUserTypeSelected={handleUserTypeSelected} />
      case "onboarding":
        return <OnboardingPage onWalletCreated={handleWalletCreated} />
      case "pin-setup":
        return <PinSetupPage onPinCreated={handlePinCreated} />
      case "app-presentation":
        return <AppPresentation userType={userType!} onComplete={handlePresentationComplete} />
      case "dashboard":
        return (
          <MainDashboard
            onNavigate={handleNavigate}
            walletData={walletData}
            onShowMtPelerin={handleShowMtPelerin}
            onShowPriceAlert={handleShowPriceAlert}
            userType={userType}
          />
        )
      case "send":
        return <SendPage onNavigate={handleNavigate} walletData={walletData} />
      case "receive":
        return <ReceivePage onNavigate={handleNavigate} walletData={walletData} />
      case "settings":
        return (
          <SettingsPage
            onNavigate={handleNavigate}
            onChangePinRequest={handleChangePinRequest}
            onShowSeedPhrase={handleShowSeedPhrase}
            onShowSupport={handleShowSupport}
            userType={userType}
            onUserTypeChange={handleUserTypeChange}
          />
        )
      case "history":
        return <TransactionHistory onNavigate={handleNavigate} />
      case "tpe":
      case "tpe-search":
      case "tpe-billing":
      case "tpe-payment":
      case "tpe-conversion":
      case "tpe-history":
      case "tpe-settings":
      case "tpe-vat-management":
      case "tpe-statistics":
        return (
          <TPEDashboard
            currentPage={page}
            onNavigate={handleNavigate}
            onExitTPE={handleExitTPE}
            walletData={walletData}
          />
        )
      default:
        return <UserTypeSelection onUserTypeSelected={handleUserTypeSelected} />
    }
  }

  const getPinVerificationTitle = () => {
    switch (pinVerificationReason) {
      case 'initial':
        return "Déverrouiller le Wallet"
      case 'tpe':
        return "Accès au mode TPE"
      case 'locked':
        return "Application verrouillée"
      default:
        return "Vérification PIN"
    }
  }

  const getPinVerificationDescription = () => {
    switch (pinVerificationReason) {
      case 'initial':
        return "Authentifiez-vous pour accéder à votre portefeuille crypto"
      case 'tpe':
        return "Veuillez vous authentifier pour accéder au mode TPE"
      case 'locked':
        return "Veuillez vous authentifier pour déverrouiller l'application"
      default:
        return "Veuillez saisir votre code PIN pour continuer"
    }
  }

  return (
    <ErrorBoundary>
      <div className="page-container ios-safe-area">
        {/* Offline Indicator */}
        {showOfflineIndicator && (
          <div className="offline-indicator ios-header-safe">
            🔴 Mode hors ligne - Données en cache
          </div>
        )}

        {/* Current page - hidden during transition */}
        <div className={`bg-background text-foreground ${isTransitioning ? 'page-hidden' : ''} ios-content-safe`}>
          {isLoading ? <DashboardSkeleton /> : renderPage(currentPage)}
        </div>

        {/* Next page - visible during transition with fade animation */}
        {nextPage && isTransitioning && pageTransitionsEnabled && (
          <div className="bg-background text-foreground page-fade-enter ios-content-safe">
            {renderPage(nextPage)}
          </div>
        )}

        {/* Global Search */}
        <GlobalSearch
          isOpen={showGlobalSearch}
          onClose={() => setShowGlobalSearch(false)}
          onNavigate={(page) => {
            setShowGlobalSearch(false)
            handleNavigate(page as AppState)
          }}
        />

        {/* Modals */}
        {showPinVerification && currentPage !== "auth" && !needsInitialAuth && (
          <PinVerificationModal
            isOpen={showPinVerification}
            onVerified={handlePinVerified}
            onCancel={handlePinVerificationCancel}
            title={getPinVerificationTitle()}
            description={getPinVerificationDescription()}
            reason={pinVerificationReason}
          />
        )}

        {showChangePinModal && (
          <ChangePinModal
            isOpen={showChangePinModal}
            onPinChanged={handlePinChanged}
            onCancel={() => setShowChangePinModal(false)}
          />
        )}

        {showSeedPhraseModal && walletData && (
          <SeedPhraseModal
            isOpen={showSeedPhraseModal}
            onClose={() => setShowSeedPhraseModal(false)}
            seedPhrase={walletData.mnemonic}
            onShowSupport={handleShowSupport}
          />
        )}

        {showMtPelerinWidget && walletData && (
          <MtPelerinWidget
            isOpen={showMtPelerinWidget}
            onClose={() => setShowMtPelerinWidget(false)}
            walletData={walletData}
          />
        )}

        {showSupportModal && (
          <SupportContactModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />
        )}

        {showPriceAlertModal && (
          <PriceAlertModal isOpen={showPriceAlertModal} onClose={() => setShowPriceAlertModal(false)} />
        )}
      </div>
    </ErrorBoundary>
  )
}
