export type Language = "fr" | "en" | "de" | "it" | "es" | "sq"

export interface Translations {
  // Common
  common: {
    back: string
    next: string
    cancel: string
    confirm: string
    save: string
    delete: string
    export: string
    import: string
    loading: string
    error: string
    success: string
    warning: string
    info: string
    close: string
    continue: string
    finish: string
    reset: string
    refresh: string
    copy: string
    share: string
    print: string
    download: string
    upload: string
    search: string
    filter: string
    clear: string
    apply: string
    edit: string
    view: string
    create: string
    update: string
    remove: string
  }
  // Language selection (flat keys used by component)
  chooseLanguage: string
  selectAppLanguage: string
  selectLanguage: string
  languageWillBeUsed: string
  continueIn: string

  // Navigation
  navigation: {
    dashboard: string
    send: string
    receive: string
    history: string
    settings: string
    tpe: string
  }

  // Onboarding
  onboarding: {
    title: string
    subtitle: string
    userTypeSelection: {
      title: string
      subtitle: string
      client: {
        title: string
        description: string
      }
      merchant: {
        title: string
        description: string
      }
    }
    walletSetup: {
      title: string
      subtitle: string
      create: {
        title: string
        description: string
        button: string
        creating: string
      }
      import: {
        title: string
        description: string
        placeholder: string
        button: string
        importing: string
      }
      features: {
        secure: string
        multiPlatform: string
        multiCrypto: string
      }
    }
  }

  // Dashboard
  dashboard: {
    title: string
    professionalTitle: string
    subtitle: string
    professionalSubtitle: string
    totalBalance: string
    portfolio: string
    recentTransactions: string
    quickActions: {
      send: string
      receive: string
      buy: string
      tpeMode: string
      createAlert: string
    }
    transactions: {
      sent: string
      received: string
      pending: string
      completed: string
      failed: string
      viewAll: string
    }
    statistics: {
      monthlyTransactions: string
      volumeExchanged: string
      gainLoss: string
      monthlyGoal: string
    }
  }

  // Send Page
  send: {
    title: string
    subtitle: string
    cryptocurrency: string
    recipientAddress: string
    recipientPlaceholder: string
    amount: string
    amountPlaceholder: string
    yourBalance: string
    yourAddress: string
    sendButton: string
    sending: string
    transactionSuccess: string
    transactionError: string
    invalidAmount: string
    fillAllFields: string
    walletNotLoaded: string
  }

  // Receive Page
  receive: {
    title: string
    qrCode: string
    amount: string
    amountOptional: string
    amountPlaceholder: string
    amountDescription: string
    receiveAddress: string
    copyAddress: string
    warning: string
    warningText: string
  }

  // Settings
  settings: {
    title: string
    tabs: {
      general: string
      security: string
      notifications: string
      advanced: string
    }
    general: {
      appearance: string
      theme: {
        light: string
        dark: string
        system: string
      }
      language: string
      currency: string
      userType: string
      userTypes: {
        individual: string
        business: string
        merchant: string
      }
    }
    security: {
      title: string
      pin: string
      changePinDescription: string
      changePin: string
      seedPhrase: string
      seedPhraseDescription: string
      viewPhrase: string
      biometrics: string
      biometricsDescription: string
      autoLock: string
      autoLockOptions: {
        oneMinute: string
        fiveMinutes: string
        fifteenMinutes: string
        thirtyMinutes: string
        never: string
      }
    }
    notifications: {
      title: string
      priceAlerts: string
      priceAlertsDescription: string
      transactions: string
      transactionsDescription: string
      security: string
      securityDescription: string
      marketing: string
      marketingDescription: string
    }
    advanced: {
      backupRecovery: string
      exportWallet: string
      exportDescription: string
      technicalSupport: string
      supportDescription: string
    }
    dangerZone: {
      title: string
      deleteWallet: string
      deleteDescription: string
      deleteConfirm: string
      deleteWarning: string
      deleteButton: string
    }
    messages: {
      settingsSaved: string
      settingsUpdated: string
      backupExported: string
      walletBackedUp: string
      walletDeleted: string
      dataCleared: string
    }
  }

  // Transaction History
  history: {
    title: string
    subtitle: string
    filters: {
      title: string
      searchPlaceholder: string
      allTypes: string
      sent: string
      received: string
      allCryptos: string
      allStatuses: string
      completed: string
      pending: string
      failed: string
      allPeriods: string
      today: string
      thisWeek: string
      thisMonth: string
      reset: string
    }
    summary: {
      title: string
      received: string
      sent: string
      pending: string
      failed: string
    }
    noTransactions: string
    noTransactionsDescription: string
    noTransactionsFiltered: string
    exportCSV: string
  }

  // TPE (Terminal de Paiement)
  tpe: {
    title: string
    subtitle: string
    status: {
      operational: string
      online: string
      printerOk: string
      battery: string
    }
    stats: {
      todaySales: string
      transactions: string
      clients: string
      averageRate: string
    }
    menu: {
      newPayment: string
      newPaymentDescription: string
      clientSearch: string
      clientSearchDescription: string
      billing: string
      billingDescription: string
      conversion: string
      conversionDescription: string
      history: string
      historyDescription: string
      vatManagement: string
      vatManagementDescription: string
      statistics: string
      statisticsDescription: string
      settings: string
      settingsDescription: string
    }
    exitTPE: string
  }

  // Price Alerts
  priceAlerts: {
    title: string
    createAlert: string
    myAlerts: string
    cryptocurrency: string
    alertType: string
    above: string
    below: string
    targetPrice: string
    currentPrice: string
    difference: string
    createButton: string
    noAlerts: string
    noAlertsDescription: string
    createFirstAlert: string
    active: string
    inactive: string
    triggered: string
    activeAlerts: string
    newAlert: string
  }

  // Mt Pelerin Widget
  mtPelerin: {
    title: string
    step: string
    of: string
    amount: string
    payment: string
    verification: string
    processing: string
    complete: string
    cryptocurrency: string
    amountCHF: string
    amountCrypto: string
    currentRate: string
    paymentMethod: string
    creditCard: string
    bankTransfer: string
    twint: string
    instant: string
    days: string
    orderVerification: string
    verifyDetails: string
    quantity: string
    fees: string
    total: string
    receiveAddress: string
    processing_: string
    processingDescription: string
    purchaseSuccess: string
    purchaseDescription: string
    transactionId: string
    minimumAmount: string
    maximumAmount: string
    perDay: string
  }

  // Crypto currencies
  crypto: {
    bitcoin: string
    ethereum: string
    algorand: string
    solana: string
  }

  // Time and dates
  time: {
    ago: string
    minute: string
    minutes: string
    hour: string
    hours: string
    day: string
    days: string
    week: string
    weeks: string
    month: string
    months: string
    year: string
    years: string
    now: string
    today: string
    yesterday: string
    thisWeek: string
    lastWeek: string
    thisMonth: string
    lastMonth: string
  }

  // Errors and messages
  messages: {
    copied: string
    copiedToClipboard: string
    cannotCopy: string
    walletCreated: string
    walletImported: string
    invalidSeedPhrase: string
    seedPhraseMustBe: string
    pinChanged: string
    pinChangeError: string
    transactionSent: string
    transactionReceived: string
    transactionFailed: string
    networkError: string
    tryAgain: string
    dataEncrypted: string
  }
}

export const translations: Record<Language, Translations> = {
  fr: {
    common: {
      back: "Retour",
      next: "Suivant",
      cancel: "Annuler",
      confirm: "Confirmer",
      save: "Sauvegarder",
      delete: "Supprimer",
      export: "Exporter",
      import: "Importer",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      warning: "Attention",
      info: "Information",
      close: "Fermer",
      continue: "Continuer",
      finish: "Terminer",
      reset: "Réinitialiser",
      refresh: "Actualiser",
      copy: "Copier",
      share: "Partager",
      print: "Imprimer",
      download: "Télécharger",
      upload: "Téléverser",
      search: "Rechercher",
      filter: "Filtrer",
      clear: "Effacer",
      apply: "Appliquer",
      edit: "Modifier",
      view: "Voir",
      create: "Créer",
      update: "Mettre à jour",
      remove: "Supprimer",
    },
    chooseLanguage: "Choisissez votre langue",
    selectAppLanguage: "Sélectionnez la langue de l'application",
    selectLanguage: "Sélectionner la langue",
    languageWillBeUsed: "Cette langue sera utilisée dans toute l'application.",
    continueIn: "Continuer en",
    navigation: {
      dashboard: "Tableau de bord",
      send: "Envoyer",
      receive: "Recevoir",
      history: "Historique",
      settings: "Paramètres",
      tpe: "TPE",
    },
    onboarding: {
      title: "Bienvenue dans votre portefeuille crypto",
      subtitle: "Gérez vos cryptomonnaies en toute sécurité",
      userTypeSelection: {
        title: "Choisissez votre profil",
        subtitle: "Sélectionnez le type d'utilisation qui vous correspond",
        client: {
          title: "Utilisateur Personnel",
          description: "Pour gérer vos cryptomonnaies personnelles",
        },
        merchant: {
          title: "Commerçant",
          description: "Pour accepter les paiements crypto dans votre commerce",
        },
      },
      walletSetup: {
        title: "Configuration du Portefeuille",
        subtitle: "Créez ou importez votre portefeuille crypto",
        create: {
          title: "Créer un nouveau portefeuille",
          description: "Générez un nouveau portefeuille sécurisé avec une phrase de récupération unique",
          button: "Créer mon portefeuille",
          creating: "Création en cours...",
        },
        import: {
          title: "Importer un portefeuille existant",
          description: "Restaurez votre portefeuille avec votre phrase de récupération",
          placeholder: "Saisissez votre phrase de récupération de 12 ou 24 mots...",
          button: "Importer mon portefeuille",
          importing: "Import en cours...",
        },
        features: {
          secure: "Sécurisé",
          multiPlatform: "Multi-plateforme",
          multiCrypto: "Multi-crypto",
        },
      },
    },
    dashboard: {
      title: "Mon Portefeuille",
      professionalTitle: "Dashboard Professionnel",
      subtitle: "Gérez vos cryptomonnaies en toute sécurité",
      professionalSubtitle: "Gestion crypto pour votre entreprise",
      totalBalance: "Portfolio Total",
      portfolio: "Portefeuille",
      recentTransactions: "Transactions Récentes",
      quickActions: {
        send: "Envoyer",
        receive: "Recevoir",
        buy: "Acheter",
        tpeMode: "Mode TPE",
        createAlert: "Créer Alerte",
      },
      transactions: {
        sent: "Envoyé",
        received: "Reçu",
        pending: "En attente",
        completed: "Terminé",
        failed: "Échoué",
        viewAll: "Voir tout",
      },
      statistics: {
        monthlyTransactions: "Transactions ce mois",
        volumeExchanged: "Volume échangé",
        gainLoss: "Gain/Perte",
        monthlyGoal: "Objectif mensuel",
      },
    },
    send: {
      title: "Envoyer des Cryptos",
      subtitle: "Envoyez vos cryptomonnaies",
      cryptocurrency: "Cryptomonnaie",
      recipientAddress: "Adresse du destinataire",
      recipientPlaceholder: "Saisissez l'adresse du destinataire",
      amount: "Montant",
      amountPlaceholder: "0.00",
      yourBalance: "Votre solde",
      yourAddress: "Votre adresse",
      sendButton: "Envoyer",
      sending: "Envoi en cours...",
      transactionSuccess: "Transaction réussie !",
      transactionError: "Erreur d'envoi",
      invalidAmount: "Le montant minimum est de 10 CHF",
      fillAllFields: "Veuillez remplir tous les champs correctement.",
      walletNotLoaded: "Portefeuille non chargé.",
    },
    receive: {
      title: "Recevoir",
      qrCode: "QR Code",
      amount: "Montant",
      amountOptional: "Montant (optionnel)",
      amountPlaceholder: "0.00",
      amountDescription: "Laissez vide pour recevoir n'importe quel montant",
      receiveAddress: "Adresse de réception",
      copyAddress: "Copier l'adresse",
      warning: "⚠️ Attention",
      warningText: "Envoyez uniquement des cryptomonnaies compatibles à cette adresse",
    },
    settings: {
      title: "Paramètres",
      tabs: {
        general: "Général",
        security: "Sécurité",
        notifications: "Notifications",
        advanced: "Avancé",
      },
      general: {
        appearance: "Apparence",
        theme: {
          light: "Clair",
          dark: "Sombre",
          system: "Système",
        },
        language: "Langue",
        currency: "Devise",
        userType: "Type d'utilisateur",
        userTypes: {
          individual: "Particulier",
          business: "Entreprise",
          merchant: "Commerçant",
        },
      },
      security: {
        title: "Sécurité",
        pin: "Code PIN",
        changePinDescription: "Modifier votre code PIN",
        changePin: "Changer PIN",
        seedPhrase: "Phrase de récupération",
        seedPhraseDescription: "Afficher votre phrase secrète",
        viewPhrase: "Voir phrase",
        biometrics: "Biométrie",
        biometricsDescription: "Utiliser l'empreinte digitale",
        autoLock: "Verrouillage automatique",
        autoLockOptions: {
          oneMinute: "1 minute",
          fiveMinutes: "5 minutes",
          fifteenMinutes: "15 minutes",
          thirtyMinutes: "30 minutes",
          never: "Jamais",
        },
      },
      notifications: {
        title: "Notifications",
        priceAlerts: "Alertes de prix",
        priceAlertsDescription: "Notifications des variations de prix",
        transactions: "Transactions",
        transactionsDescription: "Confirmations de transactions",
        security: "Sécurité",
        securityDescription: "Alertes de sécurité",
        marketing: "Marketing",
        marketingDescription: "Offres et promotions",
      },
      advanced: {
        backupRecovery: "Sauvegarde et récupération",
        exportWallet: "Exporter le portefeuille",
        exportDescription: "Sauvegarder vos données",
        technicalSupport: "Support technique",
        supportDescription: "Contacter l'assistance",
      },
      dangerZone: {
        title: "Zone dangereuse",
        deleteWallet: "Supprimer le portefeuille",
        deleteDescription: "Cette action est irréversible. Toutes vos données seront définitivement supprimées.",
        deleteConfirm: "Êtes-vous absolument sûr ?",
        deleteWarning: "Cette action ne peut pas être annulée. Cela supprimera définitivement votre portefeuille.",
        deleteButton: "Oui, supprimer définitivement",
      },
      messages: {
        settingsSaved: "Paramètres sauvegardés",
        settingsUpdated: "Vos préférences ont été mises à jour",
        backupExported: "Sauvegarde exportée",
        walletBackedUp: "Votre portefeuille a été sauvegardé",
        walletDeleted: "Portefeuille supprimé",
        dataCleared: "Toutes les données ont été effacées",
      },
    },
    history: {
      title: "Historique des Transactions",
      subtitle: "Consultez toutes vos transactions crypto",
      filters: {
        title: "Filtres",
        searchPlaceholder: "Rechercher...",
        allTypes: "Tous les types",
        sent: "Envoyé",
        received: "Reçu",
        allCryptos: "Toutes les cryptos",
        allStatuses: "Tous les statuts",
        completed: "Terminé",
        pending: "En attente",
        failed: "Échoué",
        allPeriods: "Toutes les périodes",
        today: "Aujourd'hui",
        thisWeek: "Cette semaine",
        thisMonth: "Ce mois",
        reset: "Réinitialiser",
      },
      summary: {
        title: "Résumé",
        received: "Reçues",
        sent: "Envoyées",
        pending: "En attente",
        failed: "Échouées",
      },
      noTransactions: "Aucune transaction trouvée",
      noTransactionsDescription: "Vos transactions apparaîtront ici une fois que vous en aurez effectué",
      noTransactionsFiltered: "Essayez de modifier vos filtres de recherche",
      exportCSV: "Exporter CSV",
    },
    tpe: {
      title: "Terminal de Paiement",
      subtitle: "Mode TPE - Crypto Store Lausanne",
      status: {
        operational: "Opérationnel",
        online: "En ligne",
        printerOk: "Imprimante OK",
        battery: "Batterie",
      },
      stats: {
        todaySales: "Ventes Aujourd'hui",
        transactions: "Transactions",
        clients: "Clients",
        averageRate: "Taux Moyen",
      },
      menu: {
        newPayment: "Nouveau Paiement",
        newPaymentDescription: "Encaisser un paiement crypto",
        clientSearch: "Recherche Client",
        clientSearchDescription: "Trouver un client existant",
        billing: "Facturation",
        billingDescription: "Créer et gérer les factures",
        conversion: "Conversion",
        conversionDescription: "Calculateur crypto/fiat",
        history: "Historique",
        historyDescription: "Consulter les transactions",
        vatManagement: "Gestion TVA",
        vatManagementDescription: "Configuration et rapports",
        statistics: "Statistiques",
        statisticsDescription: "Rapports et analyses",
        settings: "Paramètres",
        settingsDescription: "Configuration du TPE",
      },
      exitTPE: "Quitter TPE",
    },
    priceAlerts: {
      title: "Alertes de Prix",
      createAlert: "Créer Alerte",
      myAlerts: "Mes Alertes",
      cryptocurrency: "Cryptomonnaie",
      alertType: "Type d'alerte",
      above: "Prix au-dessus de",
      below: "Prix en-dessous de",
      targetPrice: "Prix cible (USD)",
      currentPrice: "Prix actuel",
      difference: "Différence",
      createButton: "Créer l'alerte",
      noAlerts: "Aucune alerte configurée",
      noAlertsDescription: "Créez votre première alerte de prix pour être notifié des mouvements importants",
      createFirstAlert: "Créer une alerte",
      active: "Active",
      inactive: "Inactive",
      triggered: "Déclenchée",
      activeAlerts: "alertes actives",
      newAlert: "Nouvelle alerte",
    },
    mtPelerin: {
      title: "Mt Pelerin - Achat de Crypto",
      step: "Étape",
      of: "sur",
      amount: "Montant",
      payment: "Paiement",
      verification: "Vérification",
      processing: "Traitement",
      complete: "Terminé",
      cryptocurrency: "Cryptomonnaie",
      amountCHF: "Montant (CHF)",
      amountCrypto: "Montant",
      currentRate: "Taux de change actuel",
      paymentMethod: "Moyen de paiement",
      creditCard: "Carte de crédit/débit",
      bankTransfer: "Virement bancaire",
      twint: "TWINT",
      instant: "Instantané",
      days: "jours",
      orderVerification: "Vérification de la commande",
      verifyDetails: "Veuillez vérifier les détails de votre achat",
      quantity: "Quantité",
      fees: "Frais",
      total: "Total",
      receiveAddress: "Adresse de réception",
      processing_: "Traitement en cours...",
      processingDescription: "Votre commande est en cours de traitement",
      purchaseSuccess: "Achat réussi !",
      purchaseDescription: "ont été envoyés à votre portefeuille",
      transactionId: "Transaction ID",
      minimumAmount: "Montant minimum",
      maximumAmount: "Montant maximum",
      perDay: "par jour",
    },
    crypto: {
      bitcoin: "Bitcoin",
      ethereum: "Ethereum",
      algorand: "Algorand",
      solana: "Solana",
    },
    time: {
      ago: "il y a",
      minute: "minute",
      minutes: "minutes",
      hour: "heure",
      hours: "heures",
      day: "jour",
      days: "jours",
      week: "semaine",
      weeks: "semaines",
      month: "mois",
      months: "mois",
      year: "année",
      years: "années",
      now: "maintenant",
      today: "aujourd'hui",
      yesterday: "hier",
      thisWeek: "cette semaine",
      lastWeek: "la semaine dernière",
      thisMonth: "ce mois",
      lastMonth: "le mois dernier",
    },
    messages: {
      copied: "Copié !",
      copiedToClipboard: "copié dans le presse-papiers",
      cannotCopy: "Impossible de copier dans le presse-papiers",
      walletCreated: "Portefeuille créé avec succès !",
      walletImported: "Portefeuille importé avec succès !",
      invalidSeedPhrase: "Veuillez saisir une phrase de récupération valide",
      seedPhraseMustBe: "La phrase de récupération doit contenir 12 ou 24 mots",
      pinChanged: "Code PIN modifié avec succès !",
      pinChangeError: "Erreur lors du changement de PIN",
      transactionSent: "Transaction envoyée avec succès",
      transactionReceived: "Transaction reçue",
      transactionFailed: "La transaction a échoué",
      networkError: "Erreur réseau",
      tryAgain: "Veuillez réessayer",
      dataEncrypted: "Vos données sont chiffrées et stockées localement sur votre appareil",
    },
  },
  en: {
    common: {
      back: "Back",
      next: "Next",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      delete: "Delete",
      export: "Export",
      import: "Import",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information",
      close: "Close",
      continue: "Continue",
      finish: "Finish",
      reset: "Reset",
      refresh: "Refresh",
      copy: "Copy",
      share: "Share",
      print: "Print",
      download: "Download",
      upload: "Upload",
      search: "Search",
      filter: "Filter",
      clear: "Clear",
      apply: "Apply",
      edit: "Edit",
      view: "View",
      create: "Create",
      update: "Update",
      remove: "Remove",
    },
    chooseLanguage: "Choose your language",
    selectAppLanguage: "Select the app language",
    selectLanguage: "Select language",
    languageWillBeUsed: "This language will be used throughout the app.",
    continueIn: "Continue in",
    navigation: {
      dashboard: "Dashboard",
      send: "Send",
      receive: "Receive",
      history: "History",
      settings: "Settings",
      tpe: "POS",
    },
    onboarding: {
      title: "Welcome to your crypto wallet",
      subtitle: "Manage your cryptocurrencies securely",
      userTypeSelection: {
        title: "Choose your profile",
        subtitle: "Select the type of usage that suits you",
        client: {
          title: "Personal User",
          description: "To manage your personal cryptocurrencies",
        },
        merchant: {
          title: "Merchant",
          description: "To accept crypto payments in your business",
        },
      },
      walletSetup: {
        title: "Wallet Configuration",
        subtitle: "Create or import your crypto wallet",
        create: {
          title: "Create a new wallet",
          description: "Generate a new secure wallet with a unique recovery phrase",
          button: "Create my wallet",
          creating: "Creating...",
        },
        import: {
          title: "Import an existing wallet",
          description: "Restore your wallet with your recovery phrase",
          placeholder: "Enter your 12 or 24 word recovery phrase...",
          button: "Import my wallet",
          importing: "Importing...",
        },
        features: {
          secure: "Secure",
          multiPlatform: "Multi-platform",
          multiCrypto: "Multi-crypto",
        },
      },
    },
    dashboard: {
      title: "My Wallet",
      professionalTitle: "Professional Dashboard",
      subtitle: "Manage your cryptocurrencies securely",
      professionalSubtitle: "Crypto management for your business",
      totalBalance: "Total Portfolio",
      portfolio: "Portfolio",
      recentTransactions: "Recent Transactions",
      quickActions: {
        send: "Send",
        receive: "Receive",
        buy: "Buy",
        tpeMode: "POS Mode",
        createAlert: "Create Alert",
      },
      transactions: {
        sent: "Sent",
        received: "Received",
        pending: "Pending",
        completed: "Completed",
        failed: "Failed",
        viewAll: "View All",
      },
      statistics: {
        monthlyTransactions: "Transactions this month",
        volumeExchanged: "Volume exchanged",
        gainLoss: "Gain/Loss",
        monthlyGoal: "Monthly goal",
      },
    },
    send: {
      title: "Send Crypto",
      subtitle: "Send your cryptocurrencies",
      cryptocurrency: "Cryptocurrency",
      recipientAddress: "Recipient address",
      recipientPlaceholder: "Enter recipient address",
      amount: "Amount",
      amountPlaceholder: "0.00",
      yourBalance: "Your balance",
      yourAddress: "Your address",
      sendButton: "Send",
      sending: "Sending...",
      transactionSuccess: "Transaction successful!",
      transactionError: "Send error",
      invalidAmount: "Minimum amount is 10 CHF",
      fillAllFields: "Please fill all fields correctly.",
      walletNotLoaded: "Wallet not loaded.",
    },
    receive: {
      title: "Receive",
      qrCode: "QR Code",
      amount: "Amount",
      amountOptional: "Amount (optional)",
      amountPlaceholder: "0.00",
      amountDescription: "Leave empty to receive any amount",
      receiveAddress: "Receive address",
      copyAddress: "Copy address",
      warning: "⚠️ Warning",
      warningText: "Only send compatible cryptocurrencies to this address",
    },
    settings: {
      title: "Settings",
      tabs: {
        general: "General",
        security: "Security",
        notifications: "Notifications",
        advanced: "Advanced",
      },
      general: {
        appearance: "Appearance",
        theme: {
          light: "Light",
          dark: "Dark",
          system: "System",
        },
        language: "Language",
        currency: "Currency",
        userType: "User Type",
        userTypes: {
          individual: "Individual",
          business: "Business",
          merchant: "Merchant",
        },
      },
      security: {
        title: "Security",
        pin: "PIN Code",
        changePinDescription: "Change your PIN code",
        changePin: "Change PIN",
        seedPhrase: "Recovery Phrase",
        seedPhraseDescription: "Show your secret phrase",
        viewPhrase: "View phrase",
        biometrics: "Biometrics",
        biometricsDescription: "Use fingerprint",
        autoLock: "Auto Lock",
        autoLockOptions: {
          oneMinute: "1 minute",
          fiveMinutes: "5 minutes",
          fifteenMinutes: "15 minutes",
          thirtyMinutes: "30 minutes",
          never: "Never",
        },
      },
      notifications: {
        title: "Notifications",
        priceAlerts: "Price alerts",
        priceAlertsDescription: "Price change notifications",
        transactions: "Transactions",
        transactionsDescription: "Transaction confirmations",
        security: "Security",
        securityDescription: "Security alerts",
        marketing: "Marketing",
        marketingDescription: "Offers and promotions",
      },
      advanced: {
        backupRecovery: "Backup and recovery",
        exportWallet: "Export wallet",
        exportDescription: "Backup your data",
        technicalSupport: "Technical support",
        supportDescription: "Contact support",
      },
      dangerZone: {
        title: "Danger Zone",
        deleteWallet: "Delete Wallet",
        deleteDescription: "This action is irreversible. All your data will be permanently deleted.",
        deleteConfirm: "Are you absolutely sure?",
        deleteWarning: "This action cannot be undone. This will permanently delete your wallet.",
        deleteButton: "Yes, delete permanently",
      },
      messages: {
        settingsSaved: "Settings saved",
        settingsUpdated: "Your preferences have been updated",
        backupExported: "Backup exported",
        walletBackedUp: "Your wallet has been backed up",
        walletDeleted: "Wallet deleted",
        dataCleared: "All data has been cleared",
      },
    },
    history: {
      title: "Transaction History",
      subtitle: "View all your crypto transactions",
      filters: {
        title: "Filters",
        searchPlaceholder: "Search...",
        allTypes: "All types",
        sent: "Sent",
        received: "Received",
        allCryptos: "All cryptos",
        allStatuses: "All statuses",
        completed: "Completed",
        pending: "Pending",
        failed: "Failed",
        allPeriods: "All periods",
        today: "Today",
        thisWeek: "This week",
        thisMonth: "This month",
        reset: "Reset",
      },
      summary: {
        title: "Summary",
        received: "Received",
        sent: "Sent",
        pending: "Pending",
        failed: "Failed",
      },
      noTransactions: "No transactions found",
      noTransactionsDescription: "Your transactions will appear here once you make some",
      noTransactionsFiltered: "Try modifying your search filters",
      exportCSV: "Export CSV",
    },
    tpe: {
      title: "Payment Terminal",
      subtitle: "POS Mode - Crypto Store Lausanne",
      status: {
        operational: "Operational",
        online: "Online",
        printerOk: "Printer OK",
        battery: "Battery",
      },
      stats: {
        todaySales: "Today's Sales",
        transactions: "Transactions",
        clients: "Clients",
        averageRate: "Average Rate",
      },
      menu: {
        newPayment: "New Payment",
        newPaymentDescription: "Process a crypto payment",
        clientSearch: "Client Search",
        clientSearchDescription: "Find an existing client",
        billing: "Billing",
        billingDescription: "Create and manage invoices",
        conversion: "Conversion",
        conversionDescription: "Crypto/fiat calculator",
        history: "History",
        historyDescription: "View transactions",
        vatManagement: "VAT Management",
        vatManagementDescription: "Configuration and reports",
        statistics: "Statistics",
        statisticsDescription: "Reports and analytics",
        settings: "Settings",
        settingsDescription: "POS configuration",
      },
      exitTPE: "Exit POS",
    },
    priceAlerts: {
      title: "Price Alerts",
      createAlert: "Create Alert",
      myAlerts: "My Alerts",
      cryptocurrency: "Cryptocurrency",
      alertType: "Alert type",
      above: "Price above",
      below: "Price below",
      targetPrice: "Target price (USD)",
      currentPrice: "Current price",
      difference: "Difference",
      createButton: "Create alert",
      noAlerts: "No alerts configured",
      noAlertsDescription: "Create your first price alert to be notified of important movements",
      createFirstAlert: "Create an alert",
      active: "Active",
      inactive: "Inactive",
      triggered: "Triggered",
      activeAlerts: "active alerts",
      newAlert: "New alert",
    },
    mtPelerin: {
      title: "Mt Pelerin - Buy Crypto",
      step: "Step",
      of: "of",
      amount: "Amount",
      payment: "Payment",
      verification: "Verification",
      processing: "Processing",
      complete: "Complete",
      cryptocurrency: "Cryptocurrency",
      amountCHF: "Amount (CHF)",
      amountCrypto: "Amount",
      currentRate: "Current exchange rate",
      paymentMethod: "Payment method",
      creditCard: "Credit/debit card",
      bankTransfer: "Bank transfer",
      twint: "TWINT",
      instant: "Instant",
      days: "days",
      orderVerification: "Order verification",
      verifyDetails: "Please verify your purchase details",
      quantity: "Quantity",
      fees: "Fees",
      total: "Total",
      receiveAddress: "Receive address",
      processing_: "Processing...",
      processingDescription: "Your order is being processed",
      purchaseSuccess: "Purchase successful!",
      purchaseDescription: "have been sent to your wallet",
      transactionId: "Transaction ID",
      minimumAmount: "Minimum amount",
      maximumAmount: "Maximum amount",
      perDay: "per day",
    },
    crypto: {
      bitcoin: "Bitcoin",
      ethereum: "Ethereum",
      algorand: "Algorand",
      solana: "Solana",
    },
    time: {
      ago: "ago",
      minute: "minute",
      minutes: "minutes",
      hour: "hour",
      hours: "hours",
      day: "day",
      days: "days",
      week: "week",
      weeks: "weeks",
      month: "month",
      months: "months",
      year: "year",
      years: "years",
      now: "now",
      today: "today",
      yesterday: "yesterday",
      thisWeek: "this week",
      lastWeek: "last week",
      thisMonth: "this month",
      lastMonth: "last month",
    },
    messages: {
      copied: "Copied!",
      copiedToClipboard: "copied to clipboard",
      cannotCopy: "Cannot copy to clipboard",
      walletCreated: "Wallet created successfully!",
      walletImported: "Wallet imported successfully!",
      invalidSeedPhrase: "Please enter a valid recovery phrase",
      seedPhraseMustBe: "Recovery phrase must contain 12 or 24 words",
      pinChanged: "PIN code changed successfully!",
      pinChangeError: "Error changing PIN",
      transactionSent: "Transaction sent successfully",
      transactionReceived: "Transaction received",
      transactionFailed: "Transaction failed",
      networkError: "Network error",
      tryAgain: "Please try again",
      dataEncrypted: "Your data is encrypted and stored locally on your device",
    },
  },
  de: {
    common: {
      back: "Zurück",
      next: "Weiter",
      cancel: "Abbrechen",
      confirm: "Bestätigen",
      save: "Speichern",
      delete: "Löschen",
      export: "Exportieren",
      import: "Importieren",
      loading: "Laden...",
      error: "Fehler",
      success: "Erfolg",
      warning: "Warnung",
      info: "Information",
      close: "Schließen",
      continue: "Fortfahren",
      finish: "Beenden",
      reset: "Zurücksetzen",
      refresh: "Aktualisieren",
      copy: "Kopieren",
      share: "Teilen",
      print: "Drucken",
      download: "Herunterladen",
      upload: "Hochladen",
      search: "Suchen",
      filter: "Filtern",
      clear: "Löschen",
      apply: "Anwenden",
      edit: "Bearbeiten",
      view: "Anzeigen",
      create: "Erstellen",
      update: "Aktualisieren",
      remove: "Entfernen",
    },
    chooseLanguage: "Wählen Sie Ihre Sprache",
    selectAppLanguage: "Wählen Sie die App-Sprache",
    selectLanguage: "Sprache auswählen",
    languageWillBeUsed: "Diese Sprache wird in der gesamten App verwendet.",
    continueIn: "Fortfahren in",
    navigation: {
      dashboard: "Dashboard",
      send: "Senden",
      receive: "Empfangen",
      history: "Verlauf",
      settings: "Einstellungen",
      tpe: "POS",
    },
    onboarding: {
      title: "Willkommen in Ihrer Krypto-Wallet",
      subtitle: "Verwalten Sie Ihre Kryptowährungen sicher",
      userTypeSelection: {
        title: "Wählen Sie Ihr Profil",
        subtitle: "Wählen Sie den Nutzungstyp, der zu Ihnen passt",
        client: {
          title: "Privatnutzer",
          description: "Zur Verwaltung Ihrer persönlichen Kryptowährungen",
        },
        merchant: {
          title: "Händler",
          description: "Zur Annahme von Krypto-Zahlungen in Ihrem Geschäft",
        },
      },
      walletSetup: {
        title: "Wallet-Konfiguration",
        subtitle: "Erstellen oder importieren Sie Ihre Krypto-Wallet",
        create: {
          title: "Neue Wallet erstellen",
          description: "Generieren Sie eine neue sichere Wallet mit einer einzigartigen Wiederherstellungsphrase",
          button: "Meine Wallet erstellen",
          creating: "Erstelle...",
        },
        import: {
          title: "Bestehende Wallet importieren",
          description: "Stellen Sie Ihre Wallet mit Ihrer Wiederherstellungsphrase wieder her",
          placeholder: "Geben Sie Ihre 12- oder 24-Wort-Wiederherstellungsphrase ein...",
          button: "Meine Wallet importieren",
          importing: "Importiere...",
        },
        features: {
          secure: "Sicher",
          multiPlatform: "Multiplattform",
          multiCrypto: "Multi-Krypto",
        },
      },
    },
    dashboard: {
      title: "Meine Wallet",
      professionalTitle: "Professionelles Dashboard",
      subtitle: "Verwalten Sie Ihre Kryptowährungen sicher",
      professionalSubtitle: "Krypto-Verwaltung für Ihr Unternehmen",
      totalBalance: "Gesamtportfolio",
      portfolio: "Portfolio",
      recentTransactions: "Letzte Transaktionen",
      quickActions: {
        send: "Senden",
        receive: "Empfangen",
        buy: "Kaufen",
        tpeMode: "POS-Modus",
        createAlert: "Alarm erstellen",
      },
      transactions: {
        sent: "Gesendet",
        received: "Empfangen",
        pending: "Ausstehend",
        completed: "Abgeschlossen",
        failed: "Fehlgeschlagen",
        viewAll: "Alle anzeigen",
      },
      statistics: {
        monthlyTransactions: "Transaktionen diesen Monat",
        volumeExchanged: "Ausgetauschtes Volumen",
        gainLoss: "Gewinn/Verlust",
        monthlyGoal: "Monatsziel",
      },
    },
    send: {
      title: "Krypto senden",
      subtitle: "Senden Sie Ihre Kryptowährungen",
      cryptocurrency: "Kryptowährung",
      recipientAddress: "Empfängeradresse",
      recipientPlaceholder: "Empfängeradresse eingeben",
      amount: "Betrag",
      amountPlaceholder: "0.00",
      yourBalance: "Ihr Guthaben",
      yourAddress: "Ihre Adresse",
      sendButton: "Senden",
      sending: "Sende...",
      transactionSuccess: "Transaktion erfolgreich!",
      transactionError: "Sendefehler",
      invalidAmount: "Mindestbetrag ist 10 CHF",
      fillAllFields: "Bitte füllen Sie alle Felder korrekt aus.",
      walletNotLoaded: "Wallet nicht geladen.",
    },
    receive: {
      title: "Empfangen",
      qrCode: "QR-Code",
      amount: "Betrag",
      amountOptional: "Betrag (optional)",
      amountPlaceholder: "0.00",
      amountDescription: "Leer lassen, um jeden Betrag zu empfangen",
      receiveAddress: "Empfangsadresse",
      copyAddress: "Adresse kopieren",
      warning: "⚠️ Warnung",
      warningText: "Senden Sie nur kompatible Kryptowährungen an diese Adresse",
    },
    settings: {
      title: "Einstellungen",
      tabs: {
        general: "Allgemein",
        security: "Sicherheit",
        notifications: "Benachrichtigungen",
        advanced: "Erweitert",
      },
      general: {
        appearance: "Erscheinungsbild",
        theme: {
          light: "Hell",
          dark: "Dunkel",
          system: "System",
        },
        language: "Sprache",
        currency: "Währung",
        userType: "Benutzertyp",
        userTypes: {
          individual: "Privatperson",
          business: "Unternehmen",
          merchant: "Händler",
        },
      },
      security: {
        title: "Sicherheit",
        pin: "PIN-Code",
        changePinDescription: "Ändern Sie Ihren PIN-Code",
        changePin: "PIN ändern",
        seedPhrase: "Wiederherstellungsphrase",
        seedPhraseDescription: "Zeigen Sie Ihre geheime Phrase an",
        viewPhrase: "Phrase anzeigen",
        biometrics: "Biometrie",
        biometricsDescription: "Fingerabdruck verwenden",
        autoLock: "Automatische Sperre",
        autoLockOptions: {
          oneMinute: "1 Minute",
          fiveMinutes: "5 Minuten",
          fifteenMinutes: "15 Minuten",
          thirtyMinutes: "30 Minuten",
          never: "Nie",
        },
      },
      notifications: {
        title: "Benachrichtigungen",
        priceAlerts: "Preisalarme",
        priceAlertsDescription: "Benachrichtigungen bei Preisänderungen",
        transactions: "Transaktionen",
        transactionsDescription: "Transaktionsbestätigungen",
        security: "Sicherheit",
        securityDescription: "Sicherheitsalarme",
        marketing: "Marketing",
        marketingDescription: "Angebote und Aktionen",
      },
      advanced: {
        backupRecovery: "Sicherung und Wiederherstellung",
        exportWallet: "Wallet exportieren",
        exportDescription: "Ihre Daten sichern",
        technicalSupport: "Technischer Support",
        supportDescription: "Support kontaktieren",
      },
      dangerZone: {
        title: "Gefahrenzone",
        deleteWallet: "Wallet löschen",
        deleteDescription: "Diese Aktion ist irreversibel. Alle Ihre Daten werden dauerhaft gelöscht.",
        deleteConfirm: "Sind Sie absolut sicher?",
        deleteWarning: "Diese Aktion kann nicht rückgängig gemacht werden. Dies wird Ihre Wallet dauerhaft löschen.",
        deleteButton: "Ja, dauerhaft löschen",
      },
      messages: {
        settingsSaved: "Einstellungen gespeichert",
        settingsUpdated: "Ihre Einstellungen wurden aktualisiert",
        backupExported: "Sicherung exportiert",
        walletBackedUp: "Ihre Wallet wurde gesichert",
        walletDeleted: "Wallet gelöscht",
        dataCleared: "Alle Daten wurden gelöscht",
      },
    },
    history: {
      title: "Transaktionsverlauf",
      subtitle: "Alle Ihre Krypto-Transaktionen anzeigen",
      filters: {
        title: "Filter",
        searchPlaceholder: "Suchen...",
        allTypes: "Alle Typen",
        sent: "Gesendet",
        received: "Empfangen",
        allCryptos: "Alle Kryptos",
        allStatuses: "Alle Status",
        completed: "Abgeschlossen",
        pending: "Ausstehend",
        failed: "Fehlgeschlagen",
        allPeriods: "Alle Zeiträume",
        today: "Heute",
        thisWeek: "Diese Woche",
        thisMonth: "Diesen Monat",
        reset: "Zurücksetzen",
      },
      summary: {
        title: "Zusammenfassung",
        received: "Empfangen",
        sent: "Gesendet",
        pending: "Ausstehend",
        failed: "Fehlgeschlagen",
      },
      noTransactions: "Keine Transaktionen gefunden",
      noTransactionsDescription: "Ihre Transaktionen werden hier angezeigt, sobald Sie welche durchführen",
      noTransactionsFiltered: "Versuchen Sie, Ihre Suchfilter zu ändern",
      exportCSV: "CSV exportieren",
    },
    tpe: {
      title: "Zahlungsterminal",
      subtitle: "POS-Modus - Crypto Store Lausanne",
      status: {
        operational: "Betriebsbereit",
        online: "Online",
        printerOk: "Drucker OK",
        battery: "Batterie",
      },
      stats: {
        todaySales: "Heutige Verkäufe",
        transactions: "Transaktionen",
        clients: "Kunden",
        averageRate: "Durchschnittskurs",
      },
      menu: {
        newPayment: "Neue Zahlung",
        newPaymentDescription: "Eine Krypto-Zahlung verarbeiten",
        clientSearch: "Kundensuche",
        clientSearchDescription: "Einen bestehenden Kunden finden",
        billing: "Abrechnung",
        billingDescription: "Rechnungen erstellen und verwalten",
        conversion: "Umrechnung",
        conversionDescription: "Krypto/Fiat-Rechner",
        history: "Verlauf",
        historyDescription: "Transaktionen anzeigen",
        vatManagement: "MwSt-Verwaltung",
        vatManagementDescription: "Konfiguration und Berichte",
        statistics: "Statistiken",
        statisticsDescription: "Berichte und Analysen",
        settings: "Einstellungen",
        settingsDescription: "POS-Konfiguration",
      },
      exitTPE: "POS verlassen",
    },
    priceAlerts: {
      title: "Preisalarme",
      createAlert: "Alarm erstellen",
      myAlerts: "Meine Alarme",
      cryptocurrency: "Kryptowährung",
      alertType: "Alarmtyp",
      above: "Preis über",
      below: "Preis unter",
      targetPrice: "Zielpreis (USD)",
      currentPrice: "Aktueller Preis",
      difference: "Unterschied",
      createButton: "Alarm erstellen",
      noAlerts: "Keine Alarme konfiguriert",
      noAlertsDescription:
        "Erstellen Sie Ihren ersten Preisalarm, um über wichtige Bewegungen benachrichtigt zu werden",
      createFirstAlert: "Einen Alarm erstellen",
      active: "Aktiv",
      inactive: "Inaktiv",
      triggered: "Ausgelöst",
      activeAlerts: "aktive Alarme",
      newAlert: "Neuer Alarm",
    },
    mtPelerin: {
      title: "Mt Pelerin - Krypto kaufen",
      step: "Schritt",
      of: "von",
      amount: "Betrag",
      payment: "Zahlung",
      verification: "Verifizierung",
      processing: "Verarbeitung",
      complete: "Abgeschlossen",
      cryptocurrency: "Kryptowährung",
      amountCHF: "Betrag (CHF)",
      amountCrypto: "Betrag",
      currentRate: "Aktueller Wechselkurs",
      paymentMethod: "Zahlungsmethode",
      creditCard: "Kredit-/Debitkarte",
      bankTransfer: "Banküberweisung",
      twint: "TWINT",
      instant: "Sofort",
      days: "Tage",
      orderVerification: "Bestellverifizierung",
      verifyDetails: "Bitte überprüfen Sie Ihre Kaufdetails",
      quantity: "Menge",
      fees: "Gebühren",
      total: "Gesamt",
      receiveAddress: "Empfangsadresse",
      processing_: "Verarbeitung...",
      processingDescription: "Ihre Bestellung wird verarbeitet",
      purchaseSuccess: "Kauf erfolgreich!",
      purchaseDescription: "wurden an Ihre Wallet gesendet",
      transactionId: "Transaktions-ID",
      minimumAmount: "Mindestbetrag",
      maximumAmount: "Höchstbetrag",
      perDay: "pro Tag",
    },
    crypto: {
      bitcoin: "Bitcoin",
      ethereum: "Ethereum",
      algorand: "Algorand",
      solana: "Solana",
    },
    time: {
      ago: "vor",
      minute: "Minute",
      minutes: "Minuten",
      hour: "Stunde",
      hours: "Stunden",
      day: "Tag",
      days: "Tage",
      week: "Woche",
      weeks: "Wochen",
      month: "Monat",
      months: "Monate",
      year: "Jahr",
      years: "Jahre",
      now: "jetzt",
      today: "heute",
      yesterday: "gestern",
      thisWeek: "diese Woche",
      lastWeek: "letzte Woche",
      thisMonth: "diesen Monat",
      lastMonth: "letzten Monat",
    },
    messages: {
      copied: "Kopiert!",
      copiedToClipboard: "in die Zwischenablage kopiert",
      cannotCopy: "Kann nicht in die Zwischenablage kopieren",
      walletCreated: "Wallet erfolgreich erstellt!",
      walletImported: "Wallet erfolgreich importiert!",
      invalidSeedPhrase: "Bitte geben Sie eine gültige Wiederherstellungsphrase ein",
      seedPhraseMustBe: "Die Wiederherstellungsphrase muss 12 oder 24 Wörter enthalten",
      pinChanged: "PIN-Code erfolgreich geändert!",
      pinChangeError: "Fehler beim Ändern der PIN",
      transactionSent: "Transaktion erfolgreich gesendet",
      transactionReceived: "Transaktion empfangen",
      transactionFailed: "Transaktion fehlgeschlagen",
      networkError: "Netzwerkfehler",
      tryAgain: "Bitte versuchen Sie es erneut",
      dataEncrypted: "Ihre Daten sind verschlüsselt und lokal auf Ihrem Gerät gespeichert",
    },
  },
  it: {
    common: {
      back: "Indietro",
      next: "Avanti",
      cancel: "Annulla",
      confirm: "Conferma",
      save: "Salva",
      delete: "Elimina",
      export: "Esporta",
      import: "Importa",
      loading: "Caricamento...",
      error: "Errore",
      success: "Successo",
      warning: "Attenzione",
      info: "Informazione",
      close: "Chiudi",
      continue: "Continua",
      finish: "Termina",
      reset: "Reimposta",
      refresh: "Aggiorna",
      copy: "Copia",
      share: "Condividi",
      print: "Stampa",
      download: "Scarica",
      upload: "Carica",
      search: "Cerca",
      filter: "Filtra",
      clear: "Cancella",
      apply: "Applica",
      edit: "Modifica",
      view: "Visualizza",
      create: "Crea",
      update: "Aggiorna",
      remove: "Rimuovi",
    },
    chooseLanguage: "Scegli la tua lingua",
    selectAppLanguage: "Seleziona la lingua dell'app",
    selectLanguage: "Seleziona lingua",
    languageWillBeUsed: "Questa lingua sarà utilizzata in tutta l'app.",
    continueIn: "Continua in",
    navigation: {
      dashboard: "Dashboard",
      send: "Invia",
      receive: "Ricevi",
      history: "Cronologia",
      settings: "Impostazioni",
      tpe: "POS",
    },
    onboarding: {
      title: "Benvenuto nel tuo portafoglio crypto",
      subtitle: "Gestisci le tue criptovalute in sicurezza",
      userTypeSelection: {
        title: "Scegli il tuo profilo",
        subtitle: "Seleziona il tipo di utilizzo che fa per te",
        client: {
          title: "Utente Privato",
          description: "Per gestire le tue criptovalute personali",
        },
        merchant: {
          title: "Commerciante",
          description: "Per accettare pagamenti crypto nella tua attività",
        },
      },
      walletSetup: {
        title: "Configurazione Portafoglio",
        subtitle: "Crea o importa il tuo portafoglio crypto",
        create: {
          title: "Crea un nuovo portafoglio",
          description: "Genera un nuovo portafoglio sicuro con una frase di recupero unica",
          button: "Crea il mio portafoglio",
          creating: "Creazione...",
        },
        import: {
          title: "Importa un portafoglio esistente",
          description: "Ripristina il tuo portafoglio con la tua frase di recupero",
          placeholder: "Inserisci la tua frase di recupero di 12 o 24 parole...",
          button: "Importa il mio portafoglio",
          importing: "Importazione...",
        },
        features: {
          secure: "Sicuro",
          multiPlatform: "Multi-piattaforma",
          multiCrypto: "Multi-crypto",
        },
      },
    },
    dashboard: {
      title: "Il Mio Portafoglio",
      professionalTitle: "Dashboard Professionale",
      subtitle: "Gestisci le tue criptovalute in sicurezza",
      professionalSubtitle: "Gestione crypto per la tua azienda",
      totalBalance: "Portfolio Totale",
      portfolio: "Portfolio",
      recentTransactions: "Transazioni Recenti",
      quickActions: {
        send: "Invia",
        receive: "Ricevi",
        buy: "Acquista",
        tpeMode: "Modalità POS",
        createAlert: "Crea Avviso",
      },
      transactions: {
        sent: "Inviato",
        received: "Ricevuto",
        pending: "In attesa",
        completed: "Completato",
        failed: "Fallito",
        viewAll: "Visualizza tutto",
      },
      statistics: {
        monthlyTransactions: "Transazioni questo mese",
        volumeExchanged: "Volume scambiato",
        gainLoss: "Guadagno/Perdita",
        monthlyGoal: "Obiettivo mensile",
      },
    },
    send: {
      title: "Invia Crypto",
      subtitle: "Invia le tue criptovalute",
      cryptocurrency: "Criptovaluta",
      recipientAddress: "Indirizzo destinatario",
      recipientPlaceholder: "Inserisci indirizzo destinatario",
      amount: "Importo",
      amountPlaceholder: "0.00",
      yourBalance: "Il tuo saldo",
      yourAddress: "Il tuo indirizzo",
      sendButton: "Invia",
      sending: "Invio...",
      transactionSuccess: "Transazione riuscita!",
      transactionError: "Errore invio",
      invalidAmount: "L'importo minimo è 10 CHF",
      fillAllFields: "Si prega di compilare tutti i campi correttamente.",
      walletNotLoaded: "Portafoglio non caricato.",
    },
    receive: {
      title: "Ricevi",
      qrCode: "Codice QR",
      amount: "Importo",
      amountOptional: "Importo (opzionale)",
      amountPlaceholder: "0.00",
      amountDescription: "Lascia vuoto per ricevere qualsiasi importo",
      receiveAddress: "Indirizzo di ricezione",
      copyAddress: "Copia indirizzo",
      warning: "⚠️ Attenzione",
      warningText: "Invia solo criptovalute compatibili a questo indirizzo",
    },
    settings: {
      title: "Impostazioni",
      tabs: {
        general: "Generale",
        security: "Sicurezza",
        notifications: "Notifiche",
        advanced: "Avanzate",
      },
      general: {
        appearance: "Aspetto",
        theme: {
          light: "Chiaro",
          dark: "Scuro",
          system: "Sistema",
        },
        language: "Lingua",
        currency: "Valuta",
        userType: "Tipo utente",
        userTypes: {
          individual: "Individuale",
          business: "Azienda",
          merchant: "Commerciante",
        },
      },
      security: {
        title: "Sicurezza",
        pin: "Codice PIN",
        changePinDescription: "Cambia il tuo codice PIN",
        changePin: "Cambia PIN",
        seedPhrase: "Frase di recupero",
        seedPhraseDescription: "Mostra la tua frase segreta",
        viewPhrase: "Visualizza frase",
        biometrics: "Biometria",
        biometricsDescription: "Usa impronta digitale",
        autoLock: "Blocco automatico",
        autoLockOptions: {
          oneMinute: "1 minuto",
          fiveMinutes: "5 minuti",
          fifteenMinutes: "15 minuti",
          thirtyMinutes: "30 minuti",
          never: "Mai",
        },
      },
      notifications: {
        title: "Notifiche",
        priceAlerts: "Avvisi di prezzo",
        priceAlertsDescription: "Notifiche di variazioni di prezzo",
        transactions: "Transazioni",
        transactionsDescription: "Conferme di transazione",
        security: "Sicurezza",
        securityDescription: "Avvisi di sicurezza",
        marketing: "Marketing",
        marketingDescription: "Offerte e promozioni",
      },
      advanced: {
        backupRecovery: "Backup e recupero",
        exportWallet: "Esporta portafoglio",
        exportDescription: "Backup dei tuoi dati",
        technicalSupport: "Supporto tecnico",
        supportDescription: "Contatta il supporto",
      },
      dangerZone: {
        title: "Zona pericolosa",
        deleteWallet: "Elimina portafoglio",
        deleteDescription: "Questa azione è irreversibile. Tutti i tuoi dati saranno eliminati permanentemente.",
        deleteConfirm: "Sei assolutamente sicuro?",
        deleteWarning: "Questa azione non può essere annullata. Eliminerà permanentemente il tuo portafoglio.",
        deleteButton: "Sì, elimina permanentemente",
      },
      messages: {
        settingsSaved: "Impostazioni salvate",
        settingsUpdated: "Le tue preferenze sono state aggiornate",
        backupExported: "Backup esportato",
        walletBackedUp: "Il tuo portafoglio è stato salvato",
        walletDeleted: "Portafoglio eliminato",
        dataCleared: "Tutti i dati sono stati cancellati",
      },
    },
    history: {
      title: "Cronologia Transazioni",
      subtitle: "Visualizza tutte le tue transazioni crypto",
      filters: {
        title: "Filtri",
        searchPlaceholder: "Cerca...",
        allTypes: "Tutti i tipi",
        sent: "Inviato",
        received: "Ricevuto",
        allCryptos: "Tutte le crypto",
        allStatuses: "Tutti gli stati",
        completed: "Completato",
        pending: "In attesa",
        failed: "Fallito",
        allPeriods: "Tutti i periodi",
        today: "Oggi",
        thisWeek: "Questa settimana",
        thisMonth: "Questo mese",
        reset: "Reimposta",
      },
      summary: {
        title: "Riepilogo",
        received: "Ricevute",
        sent: "Inviate",
        pending: "In attesa",
        failed: "Fallite",
      },
      noTransactions: "Nessuna transazione trovata",
      noTransactionsDescription: "Le tue transazioni appariranno qui una volta che ne avrai effettuate",
      noTransactionsFiltered: "Prova a modificare i tuoi filtri di ricerca",
      exportCSV: "Esporta CSV",
    },
    tpe: {
      title: "Terminale di Pagamento",
      subtitle: "Modalità POS - Crypto Store Lausanne",
      status: {
        operational: "Operativo",
        online: "Online",
        printerOk: "Stampante OK",
        battery: "Batteria",
      },
      stats: {
        todaySales: "Vendite di Oggi",
        transactions: "Transazioni",
        clients: "Clienti",
        averageRate: "Tasso Medio",
      },
      menu: {
        newPayment: "Nuovo Pagamento",
        newPaymentDescription: "Elabora un pagamento crypto",
        clientSearch: "Ricerca Cliente",
        clientSearchDescription: "Trova un cliente esistente",
        billing: "Fatturazione",
        billingDescription: "Crea e gestisci fatture",
        conversion: "Conversione",
        conversionDescription: "Calcolatore crypto/fiat",
        history: "Cronologia",
        historyDescription: "Visualizza transazioni",
        vatManagement: "Gestione IVA",
        vatManagementDescription: "Configurazione e report",
        statistics: "Statistiche",
        statisticsDescription: "Report e analisi",
        settings: "Impostazioni",
        settingsDescription: "Configurazione POS",
      },
      exitTPE: "Esci da POS",
    },
    priceAlerts: {
      title: "Avvisi di Prezzo",
      createAlert: "Crea Avviso",
      myAlerts: "I Miei Avvisi",
      cryptocurrency: "Criptovaluta",
      alertType: "Tipo di avviso",
      above: "Prezzo sopra",
      below: "Prezzo sotto",
      targetPrice: "Prezzo target (USD)",
      currentPrice: "Prezzo attuale",
      difference: "Differenza",
      createButton: "Crea avviso",
      noAlerts: "Nessun avviso configurato",
      noAlertsDescription: "Crea il tuo primo avviso di prezzo per essere notificato di movimenti importanti",
      createFirstAlert: "Crea un avviso",
      active: "Attivo",
      inactive: "Inattivo",
      triggered: "Attivato",
      activeAlerts: "avvisi attivi",
      newAlert: "Nuovo avviso",
    },
    mtPelerin: {
      title: "Mt Pelerin - Acquista Crypto",
      step: "Passo",
      of: "di",
      amount: "Importo",
      payment: "Pagamento",
      verification: "Verifica",
      processing: "Elaborazione",
      complete: "Completato",
      cryptocurrency: "Criptovaluta",
      amountCHF: "Importo (CHF)",
      amountCrypto: "Importo",
      currentRate: "Tasso di cambio attuale",
      paymentMethod: "Metodo di pagamento",
      creditCard: "Carta di credito/debito",
      bankTransfer: "Bonifico bancario",
      twint: "TWINT",
      instant: "Istantaneo",
      days: "giorni",
      orderVerification: "Verifica ordine",
      verifyDetails: "Verifica i dettagli del tuo acquisto",
      quantity: "Quantità",
      fees: "Commissioni",
      total: "Totale",
      receiveAddress: "Indirizzo di ricezione",
      processing_: "Elaborazione...",
      processingDescription: "Il tuo ordine è in elaborazione",
      purchaseSuccess: "Acquisto riuscito!",
      purchaseDescription: "sono stati inviati al tuo portafoglio",
      transactionId: "ID Transazione",
      minimumAmount: "Importo minimo",
      maximumAmount: "Importo massimo",
      perDay: "al giorno",
    },
    crypto: {
      bitcoin: "Bitcoin",
      ethereum: "Ethereum",
      algorand: "Algorand",
      solana: "Solana",
    },
    time: {
      ago: "fa",
      minute: "minuto",
      minutes: "minuti",
      hour: "ora",
      hours: "ore",
      day: "giorno",
      days: "giorni",
      week: "settimana",
      weeks: "settimane",
      month: "mese",
      months: "mesi",
      year: "anno",
      years: "anni",
      now: "ora",
      today: "oggi",
      yesterday: "ieri",
      thisWeek: "questa settimana",
      lastWeek: "la settimana scorsa",
      thisMonth: "questo mese",
      lastMonth: "il mese scorso",
    },
    messages: {
      copied: "Copiato!",
      copiedToClipboard: "copiato negli appunti",
      cannotCopy: "Impossibile copiare negli appunti",
      walletCreated: "Portafoglio creato con successo!",
      walletImported: "Portafoglio importato con successo!",
      invalidSeedPhrase: "Inserisci una frase di recupero valida",
      seedPhraseMustBe: "La frase di recupero deve contenere 12 o 24 parole",
      pinChanged: "Codice PIN cambiato con successo!",
      pinChangeError: "Errore nel cambio PIN",
      transactionSent: "Transazione inviata con successo",
      transactionReceived: "Transazione ricevuta",
      transactionFailed: "Transazione fallita",
      networkError: "Errore di rete",
      tryAgain: "Riprova",
      dataEncrypted: "I tuoi dati sono crittografati e memorizzati localmente sul tuo dispositivo",
    },
  },
  es: {
    common: {
      back: "Atrás",
      next: "Siguiente",
      cancel: "Cancelar",
      confirm: "Confirmar",
      save: "Guardar",
      delete: "Eliminar",
      export: "Exportar",
      import: "Importar",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      warning: "Advertencia",
      info: "Información",
      close: "Cerrar",
      continue: "Continuar",
      finish: "Terminar",
      reset: "Restablecer",
      refresh: "Actualizar",
      copy: "Copiar",
      share: "Compartir",
      print: "Imprimir",
      download: "Descargar",
      upload: "Subir",
      search: "Buscar",
      filter: "Filtrar",
      clear: "Limpiar",
      apply: "Aplicar",
      edit: "Editar",
      view: "Ver",
      create: "Crear",
      update: "Actualizar",
      remove: "Eliminar",
    },
    chooseLanguage: "Elige tu idioma",
    selectAppLanguage: "Selecciona el idioma de la app",
    selectLanguage: "Seleccionar idioma",
    languageWillBeUsed: "Este idioma se usará en toda la aplicación.",
    continueIn: "Continuar en",
    navigation: {
      dashboard: "Panel",
      send: "Enviar",
      receive: "Recibir",
      history: "Historial",
      settings: "Configuración",
      tpe: "TPV",
    },
    onboarding: {
      title: "Bienvenido a tu billetera crypto",
      subtitle: "Gestiona tus criptomonedas de forma segura",
      userTypeSelection: {
        title: "Elige tu perfil",
        subtitle: "Selecciona el tipo de uso que más te convenga",
        client: {
          title: "Usuario Personal",
          description: "Para gestionar tus criptomonedas personales",
        },
        merchant: {
          title: "Comerciante",
          description: "Para aceptar pagos crypto en tu negocio",
        },
      },
      walletSetup: {
        title: "Configuración de Billetera",
        subtitle: "Crea o importa tu billetera crypto",
        create: {
          title: "Crear una nueva billetera",
          description: "Genera una nueva billetera segura con una frase de recuperación única",
          button: "Crear mi billetera",
          creating: "Creando...",
        },
        import: {
          title: "Importar una billetera existente",
          description: "Restaura tu billetera con tu frase de recuperación",
          placeholder: "Ingresa tu frase de recuperación de 12 o 24 palabras...",
          button: "Importar mi billetera",
          importing: "Importando...",
        },
        features: {
          secure: "Seguro",
          multiPlatform: "Multiplataforma",
          multiCrypto: "Multi-crypto",
        },
      },
    },
    dashboard: {
      title: "Mi Billetera",
      professionalTitle: "Panel Profesional",
      subtitle: "Gestiona tus criptomonedas de forma segura",
      professionalSubtitle: "Gestión crypto para tu empresa",
      totalBalance: "Portfolio Total",
      portfolio: "Portfolio",
      recentTransactions: "Transacciones Recientes",
      quickActions: {
        send: "Enviar",
        receive: "Recibir",
        buy: "Comprar",
        tpeMode: "Modo TPV",
        createAlert: "Crear Alerta",
      },
      transactions: {
        sent: "Enviado",
        received: "Recibido",
        pending: "Pendiente",
        completed: "Completado",
        failed: "Fallido",
        viewAll: "Ver todo",
      },
      statistics: {
        monthlyTransactions: "Transacciones este mes",
        volumeExchanged: "Volumen intercambiado",
        gainLoss: "Ganancia/Pérdida",
        monthlyGoal: "Objetivo mensual",
      },
    },
    send: {
      title: "Enviar Crypto",
      subtitle: "Envía tus criptomonedas",
      cryptocurrency: "Criptomoneda",
      recipientAddress: "Dirección del destinatario",
      recipientPlaceholder: "Ingresa la dirección del destinatario",
      amount: "Cantidad",
      amountPlaceholder: "0.00",
      yourBalance: "Tu saldo",
      yourAddress: "Tu dirección",
      sendButton: "Enviar",
      sending: "Enviando...",
      transactionSuccess: "¡Transacción exitosa!",
      transactionError: "Error de envío",
      invalidAmount: "La cantidad mínima es 10 CHF",
      fillAllFields: "Por favor completa todos los campos correctamente.",
      walletNotLoaded: "Billetera no cargada.",
    },
    receive: {
      title: "Recibir",
      qrCode: "Código QR",
      amount: "Cantidad",
      amountOptional: "Cantidad (opcional)",
      amountPlaceholder: "0.00",
      amountDescription: "Deja vacío para recibir cualquier cantidad",
      receiveAddress: "Dirección de recepción",
      copyAddress: "Copiar dirección",
      warning: "⚠️ Advertencia",
      warningText: "Solo envía criptomonedas compatibles a esta dirección",
    },
    settings: {
      title: "Configuración",
      tabs: {
        general: "General",
        security: "Seguridad",
        notifications: "Notificaciones",
        advanced: "Avanzado",
      },
      general: {
        appearance: "Apariencia",
        theme: {
          light: "Claro",
          dark: "Oscuro",
          system: "Sistema",
        },
        language: "Idioma",
        currency: "Moneda",
        userType: "Tipo de usuario",
        userTypes: {
          individual: "Individual",
          business: "Empresa",
          merchant: "Comerciante",
        },
      },
      security: {
        title: "Seguridad",
        pin: "Código PIN",
        changePinDescription: "Cambia tu código PIN",
        changePin: "Cambiar PIN",
        seedPhrase: "Frase de recuperación",
        seedPhraseDescription: "Muestra tu frase secreta",
        viewPhrase: "Ver frase",
        biometrics: "Biometría",
        biometricsDescription: "Usar huella dactilar",
        autoLock: "Bloqueo automático",
        autoLockOptions: {
          oneMinute: "1 minuto",
          fiveMinutes: "5 minutos",
          fifteenMinutes: "15 minutos",
          thirtyMinutes: "30 minutos",
          never: "Nunca",
        },
      },
      notifications: {
        title: "Notificaciones",
        priceAlerts: "Alertas de precio",
        priceAlertsDescription: "Notificaciones de cambios de precio",
        transactions: "Transacciones",
        transactionsDescription: "Confirmaciones de transacciones",
        security: "Seguridad",
        securityDescription: "Alertas de seguridad",
        marketing: "Marketing",
        marketingDescription: "Ofertas y promociones",
      },
      advanced: {
        backupRecovery: "Respaldo y recuperación",
        exportWallet: "Exportar billetera",
        exportDescription: "Respaldar tus datos",
        technicalSupport: "Soporte técnico",
        supportDescription: "Contactar soporte",
      },
      dangerZone: {
        title: "Zona peligrosa",
        deleteWallet: "Eliminar billetera",
        deleteDescription: "Esta acción es irreversible. Todos tus datos serán eliminados permanentemente.",
        deleteConfirm: "¿Estás absolutamente seguro?",
        deleteWarning: "Esta acción no se puede deshacer. Eliminará permanentemente tu billetera.",
        deleteButton: "Sí, eliminar permanentemente",
      },
      messages: {
        settingsSaved: "Configuración guardada",
        settingsUpdated: "Tus preferencias han sido actualizadas",
        backupExported: "Respaldo exportado",
        walletBackedUp: "Tu billetera ha sido respaldada",
        walletDeleted: "Billetera eliminada",
        dataCleared: "Todos los datos han sido borrados",
      },
    },
    history: {
      title: "Historial de Transacciones",
      subtitle: "Ve todas tus transacciones crypto",
      filters: {
        title: "Filtros",
        searchPlaceholder: "Buscar...",
        allTypes: "Todos los tipos",
        sent: "Enviado",
        received: "Recibido",
        allCryptos: "Todas las cryptos",
        allStatuses: "Todos los estados",
        completed: "Completado",
        pending: "Pendiente",
        failed: "Fallido",
        allPeriods: "Todos los períodos",
        today: "Hoy",
        thisWeek: "Esta semana",
        thisMonth: "Este mes",
        reset: "Restablecer",
      },
      summary: {
        title: "Resumen",
        received: "Recibidas",
        sent: "Enviadas",
        pending: "Pendientes",
        failed: "Fallidas",
      },
      noTransactions: "No se encontraron transacciones",
      noTransactionsDescription: "Tus transacciones aparecerán aquí una vez que hagas algunas",
      noTransactionsFiltered: "Intenta modificar tus filtros de búsqueda",
      exportCSV: "Exportar CSV",
    },
    tpe: {
      title: "Terminal de Pago",
      subtitle: "Modo TPV - Crypto Store Lausanne",
      status: {
        operational: "Operativo",
        online: "En línea",
        printerOk: "Impresora OK",
        battery: "Batería",
      },
      stats: {
        todaySales: "Ventas de Hoy",
        transactions: "Transacciones",
        clients: "Clientes",
        averageRate: "Tasa Promedio",
      },
      menu: {
        newPayment: "Nuevo Pago",
        newPaymentDescription: "Procesar un pago crypto",
        clientSearch: "Búsqueda de Cliente",
        clientSearchDescription: "Encontrar un cliente existente",
        billing: "Facturación",
        billingDescription: "Crear y gestionar facturas",
        conversion: "Conversión",
        conversionDescription: "Calculadora crypto/fiat",
        history: "Historial",
        historyDescription: "Ver transacciones",
        vatManagement: "Gestión de IVA",
        vatManagementDescription: "Configuración e informes",
        statistics: "Estadísticas",
        statisticsDescription: "Informes y análisis",
        settings: "Configuración",
        settingsDescription: "Configuración del TPV",
      },
      exitTPE: "Salir del TPV",
    },
    priceAlerts: {
      title: "Alertas de Precio",
      createAlert: "Crear Alerta",
      myAlerts: "Mis Alertas",
      cryptocurrency: "Criptomoneda",
      alertType: "Tipo de alerta",
      above: "Precio por encima de",
      below: "Precio por debajo de",
      targetPrice: "Precio objetivo (USD)",
      currentPrice: "Precio actual",
      difference: "Diferencia",
      createButton: "Crear alerta",
      noAlerts: "No hay alertas configuradas",
      noAlertsDescription: "Crea tu primera alerta de precio para ser notificado de movimientos importantes",
      createFirstAlert: "Crear una alerta",
      active: "Activa",
      inactive: "Inactiva",
      triggered: "Activada",
      activeAlerts: "alertas activas",
      newAlert: "Nueva alerta",
    },
    mtPelerin: {
      title: "Mt Pelerin - Comprar Crypto",
      step: "Paso",
      of: "de",
      amount: "Cantidad",
      payment: "Pago",
      verification: "Verificación",
      processing: "Procesando",
      complete: "Completado",
      cryptocurrency: "Criptomoneda",
      amountCHF: "Cantidad (CHF)",
      amountCrypto: "Cantidad",
      currentRate: "Tasa de cambio actual",
      paymentMethod: "Método de pago",
      creditCard: "Tarjeta de crédito/débito",
      bankTransfer: "Transferencia bancaria",
      twint: "TWINT",
      instant: "Instantáneo",
      days: "días",
      orderVerification: "Verificación de pedido",
      verifyDetails: "Por favor verifica los detalles de tu compra",
      quantity: "Cantidad",
      fees: "Comisiones",
      total: "Total",
      receiveAddress: "Dirección de recepción",
      processing_: "Procesando...",
      processingDescription: "Tu pedido está siendo procesado",
      purchaseSuccess: "¡Compra exitosa!",
      purchaseDescription: "han sido enviados a tu billetera",
      transactionId: "ID de Transacción",
      minimumAmount: "Cantidad mínima",
      maximumAmount: "Cantidad máxima",
      perDay: "por día",
    },
    crypto: {
      bitcoin: "Bitcoin",
      ethereum: "Ethereum",
      algorand: "Algorand",
      solana: "Solana",
    },
    time: {
      ago: "hace",
      minute: "minuto",
      minutes: "minutos",
      hour: "hora",
      hours: "horas",
      day: "día",
      days: "días",
      week: "semana",
      weeks: "semanas",
      month: "mes",
      months: "meses",
      year: "año",
      years: "años",
      now: "ahora",
      today: "hoy",
      yesterday: "ayer",
      thisWeek: "esta semana",
      lastWeek: "la semana pasada",
      thisMonth: "este mes",
      lastMonth: "el mes pasado",
    },
    messages: {
      copied: "¡Copiado!",
      copiedToClipboard: "copiado al portapapeles",
      cannotCopy: "No se puede copiar al portapapeles",
      walletCreated: "¡Billetera creada exitosamente!",
      walletImported: "¡Billetera importada exitosamente!",
      invalidSeedPhrase: "Por favor ingresa una frase de recuperación válida",
      seedPhraseMustBe: "La frase de recuperación debe contener 12 o 24 palabras",
      pinChanged: "¡Código PIN cambiado exitosamente!",
      pinChangeError: "Error al cambiar el PIN",
      transactionSent: "Transacción enviada exitosamente",
      transactionReceived: "Transacción recibida",
      transactionFailed: "La transacción falló",
      networkError: "Error de red",
      tryAgain: "Por favor intenta de nuevo",
      dataEncrypted: "Tus datos están encriptados y almacenados localmente en tu dispositivo",
    },
  },
  sq: {
    common: {
      back: "Prapa",
      next: "Tjetër",
      cancel: "Anulo",
      confirm: "Konfirmo",
      save: "Ruaj",
      delete: "Fshij",
      export: "Eksporto",
      import: "Importo",
      loading: "Duke ngarkuar...",
      error: "Gabim",
      success: "Sukses",
      warning: "Paralajmërim",
      info: "Informacion",
      close: "Mbyll",
      continue: "Vazhdo",
      finish: "Përfundo",
      reset: "Rivendos",
      refresh: "Rifresko",
      copy: "Kopjo",
      share: "Ndaj",
      print: "Printo",
      download: "Shkarko",
      upload: "Ngarko",
      search: "Kërko",
      filter: "Filtro",
      clear: "Pastro",
      apply: "Apliko",
      edit: "Ndrysho",
      view: "Shiko",
      create: "Krijo",
      update: "Përditëso",
      remove: "Hiq",
    },
    chooseLanguage: "Zgjidh gjuhën tënde",
    selectAppLanguage: "Zgjidh gjuhën e aplikacionit",
    selectLanguage: "Zgjidh gjuhën",
    languageWillBeUsed: "Kjo gjuhë do të përdoret në gjithë aplikacionin.",
    continueIn: "Vazhdo në",
    navigation: {
      dashboard: "Paneli",
      send: "Dërgo",
      receive: "Merr",
      history: "Historia",
      settings: "Cilësimet",
      tpe: "TPE",
    },
    onboarding: {
      title: "Mirë se erdhe në portofolin tënd crypto",
      subtitle: "Menaxho kriptomonedhat tuaja në mënyrë të sigurt",
      userTypeSelection: {
        title: "Zgjidh profilin tënd",
        subtitle: "Përzgjidh llojin e përdorimit që të përshtatet",
        client: {
          title: "Përdorues Personal",
          description: "Për të menaxhuar kriptomonedhat tuaja personale",
        },
        merchant: {
          title: "Tregtar",
          description: "Për të pranuar pagesa crypto në biznesin tuaj",
        },
      },
      walletSetup: {
        title: "Konfigurimi i Portofolit",
        subtitle: "Krijo ose importo portofolin tënd crypto",
        create: {
          title: "Krijo një portofol të ri",
          description: "Gjenero një portofol të ri të sigurt me një frazë rikuperimi unike",
          button: "Krijo portofolin tim",
          creating: "Duke krijuar...",
        },
        import: {
          title: "Importo një portofol ekzistues",
          description: "Rikthe portofolin tënd me frazën e rikuperimit",
          placeholder: "Fut frazën tënde të rikuperimit prej 12 ose 24 fjalësh...",
          button: "Importo portofolin tim",
          importing: "Duke importuar...",
        },
        features: {
          secure: "I sigurt",
          multiPlatform: "Multi-platformë",
          multiCrypto: "Multi-crypto",
        },
      },
    },
    dashboard: {
      title: "Portofoli Im",
      professionalTitle: "Paneli Profesional",
      subtitle: "Menaxho kriptomonedhat tuaja në mënyrë të sigurt",
      professionalSubtitle: "Menaxhimi crypto për biznesin tuaj",
      totalBalance: "Portofoli Total",
      portfolio: "Portofoli",
      recentTransactions: "Transaksionet e Fundit",
      quickActions: {
        send: "Dërgo",
        receive: "Merr",
        buy: "Bli",
        tpeMode: "Modaliteti TPE",
        createAlert: "Krijo Alarm",
      },
      transactions: {
        sent: "Dërguar",
        received: "Marrë",
        pending: "Në pritje",
        completed: "Përfunduar",
        failed: "Dështuar",
        viewAll: "Shiko të gjitha",
      },
      statistics: {
        monthlyTransactions: "Transaksionet këtë muaj",
        volumeExchanged: "Volumi i shkëmbyer",
        gainLoss: "Fitim/Humbje",
        monthlyGoal: "Objektivi mujor",
      },
    },
    send: {
      title: "Dërgo Crypto",
      subtitle: "Dërgo kriptomonedhat tuaja",
      cryptocurrency: "Kriptomonedha",
      recipientAddress: "Adresa e marrësit",
      recipientPlaceholder: "Fut adresën e marrësit",
      amount: "Shuma",
      amountPlaceholder: "0.00",
      yourBalance: "Bilanci juaj",
      yourAddress: "Adresa juaj",
      sendButton: "Dërgo",
      sending: "Duke dërguar...",
      transactionSuccess: "Transaksioni u krye me sukses!",
      transactionError: "Gabim në dërgim",
      invalidAmount: "Shuma minimale është 10 CHF",
      fillAllFields: "Ju lutemi plotësoni të gjitha fushat saktë.",
      walletNotLoaded: "Portofoli nuk është ngarkuar.",
    },
    receive: {
      title: "Merr",
      qrCode: "Kodi QR",
      amount: "Shuma",
      amountOptional: "Shuma (opsionale)",
      amountPlaceholder: "0.00",
      amountDescription: "Lëre bosh për të marrë çdo shumë",
      receiveAddress: "Adresa e marrjes",
      copyAddress: "Kopjo adresën",
      warning: "⚠️ Paralajmërim",
      warningText: "Dërgo vetëm kriptomonedha të përputhshme në këtë adresë",
    },
    settings: {
      title: "Cilësimet",
      tabs: {
        general: "Të përgjithshme",
        security: "Siguria",
        notifications: "Njoftimet",
        advanced: "Të avancuara",
      },
      general: {
        appearance: "Pamja",
        theme: {
          light: "E çelët",
          dark: "E errët",
          system: "Sistemi",
        },
        language: "Gjuha",
        currency: "Monedha",
        userType: "Lloji i përdoruesit",
        userTypes: {
          individual: "Individual",
          business: "Biznes",
          merchant: "Tregtar",
        },
      },
      security: {
        title: "Siguria",
        pin: "Kodi PIN",
        changePinDescription: "Ndrysho kodin tënd PIN",
        changePin: "Ndrysho PIN",
        seedPhrase: "Fraza e rikuperimit",
        seedPhraseDescription: "Shfaq frazën tënde sekrete",
        viewPhrase: "Shiko frazën",
        biometrics: "Biometria",
        biometricsDescription: "Përdor gjurmën e gishtit",
        autoLock: "Kyçja automatike",
        autoLockOptions: {
          oneMinute: "1 minutë",
          fiveMinutes: "5 minuta",
          fifteenMinutes: "15 minuta",
          thirtyMinutes: "30 minuta",
          never: "Kurrë",
        },
      },
      notifications: {
        title: "Njoftimet",
        priceAlerts: "Alarmet e çmimit",
        priceAlertsDescription: "Njoftimet e ndryshimeve të çmimit",
        transactions: "Transaksionet",
        transactionsDescription: "Konfirmimet e transaksioneve",
        security: "Siguria",
        securityDescription: "Alarmet e sigurisë",
        marketing: "Marketingu",
        marketingDescription: "Ofertat dhe promovime",
      },
      advanced: {
        backupRecovery: "Backup dhe rikuperim",
        exportWallet: "Eksporto portofolin",
        exportDescription: "Backup të dhënat tuaja",
        technicalSupport: "Mbështetja teknike",
        supportDescription: "Kontakto mbështetjen",
      },
      dangerZone: {
        title: "Zona e rrezikshme",
        deleteWallet: "Fshij portofolin",
        deleteDescription: "Ky veprim është i pakthyeshëm. Të gjitha të dhënat tuaja do të fshihen përgjithmonë.",
        deleteConfirm: "A jeni absolutisht të sigurt?",
        deleteWarning: "Ky veprim nuk mund të zhbëhet. Do të fshijë përgjithmonë portofolin tuaj.",
        deleteButton: "Po, fshije përgjithmonë",
      },
      messages: {
        settingsSaved: "Cilësimet u ruajtën",
        settingsUpdated: "Preferencat tuaja janë përditësuar",
        backupExported: "Backup u eksportua",
        walletBackedUp: "Portofoli juaj u ruajt",
        walletDeleted: "Portofoli u fshi",
        dataCleared: "Të gjitha të dhënat u pastruan",
      },
    },
    history: {
      title: "Historia e Transaksioneve",
      subtitle: "Shiko të gjitha transaksionet tuaja crypto",
      filters: {
        title: "Filtrat",
        searchPlaceholder: "Kërko...",
        allTypes: "Të gjitha llojet",
        sent: "Dërguar",
        received: "Marrë",
        allCryptos: "Të gjitha crypto",
        allStatuses: "Të gjitha statuset",
        completed: "Përfunduar",
        pending: "Në pritje",
        failed: "Dështuar",
        allPeriods: "Të gjitha periudhat",
        today: "Sot",
        thisWeek: "Këtë javë",
        thisMonth: "Këtë muaj",
        reset: "Rivendos",
      },
      summary: {
        title: "Përmbledhja",
        received: "Marrë",
        sent: "Dërguar",
        pending: "Në pritje",
        failed: "Dështuar",
      },
      noTransactions: "Nuk u gjetën transaksione",
      noTransactionsDescription: "Transaksionet tuaja do të shfaqen këtu pasi të kryeni disa",
      noTransactionsFiltered: "Provoni të ndryshoni filtrat e kërkimit",
      exportCSV: "Eksporto CSV",
    },
    tpe: {
      title: "Terminali i Pagesës",
      subtitle: "Modaliteti TPE - Crypto Store Lausanne",
      status: {
        operational: "Operacional",
        online: "Online",
        printerOk: "Printeri OK",
        battery: "Bateria",
      },
      stats: {
        todaySales: "Shitjet e Sotme",
        transactions: "Transaksionet",
        clients: "Klientët",
        averageRate: "Norma Mesatare",
      },
      menu: {
        newPayment: "Pagesë e Re",
        newPaymentDescription: "Përpuno një pagesë crypto",
        clientSearch: "Kërkimi i Klientit",
        clientSearchDescription: "Gjej një klient ekzistues",
        billing: "Faturimi",
        billingDescription: "Krijo dhe menaxho faturat",
        conversion: "Konvertimi",
        conversionDescription: "Kalkulatori crypto/fiat",
        history: "Historia",
        historyDescription: "Shiko transaksionet",
        vatManagement: "Menaxhimi i TVSH",
        vatManagementDescription: "Konfigurimi dhe raportet",
        statistics: "Statistikat",
        statisticsDescription: "Raportet dhe analizat",
        settings: "Cilësimet",
        settingsDescription: "Konfigurimi i TPE",
      },
      exitTPE: "Dil nga TPE",
    },
    priceAlerts: {
      title: "Alarmet e Çmimit",
      createAlert: "Krijo Alarm",
      myAlerts: "Alarmet e Mia",
      cryptocurrency: "Kriptomonedha",
      alertType: "Lloji i alarmit",
      above: "Çmimi mbi",
      below: "Çmimi nën",
      targetPrice: "Çmimi objektiv (USD)",
      currentPrice: "Çmimi aktual",
      difference: "Ndryshimi",
      createButton: "Krijo alarm",
      noAlerts: "Nuk ka alarme të konfiguruar",
      noAlertsDescription: "Krijo alarmin tënd të parë të çmimit për të qenë i njoftuar për lëvizjet e rëndësishme",
      createFirstAlert: "Krijo një alarm",
      active: "Aktiv",
      inactive: "Joaktiv",
      triggered: "I aktivizuar",
      activeAlerts: "alarme aktive",
      newAlert: "Alarm i ri",
    },
    mtPelerin: {
      title: "Mt Pelerin - Bli Crypto",
      step: "Hapi",
      of: "nga",
      amount: "Shuma",
      payment: "Pagesa",
      verification: "Verifikimi",
      processing: "Duke përpunuar",
      complete: "Përfunduar",
      cryptocurrency: "Kriptomonedha",
      amountCHF: "Shuma (CHF)",
      amountCrypto: "Shuma",
      currentRate: "Kursi aktual i këmbimit",
      paymentMethod: "Metoda e pagesës",
      creditCard: "Karta e kreditit/debitit",
      bankTransfer: "Transferta bankare",
      twint: "TWINT",
      instant: "I menjëhershëm",
      days: "ditë",
      orderVerification: "Verifikimi i porosisë",
      verifyDetails: "Ju lutemi verifikoni detajet e blerjes suaj",
      quantity: "Sasia",
      fees: "Tarifat",
      total: "Totali",
      receiveAddress: "Adresa e marrjes",
      processing_: "Duke përpunuar...",
      processingDescription: "Porosia juaj po përpunohet",
      purchaseSuccess: "Blerja u krye me sukses!",
      purchaseDescription: "janë dërguar në portofolin tuaj",
      transactionId: "ID e Transaksionit",
      minimumAmount: "Shuma minimale",
      maximumAmount: "Shuma maksimale",
      perDay: "në ditë",
    },
    crypto: {
      bitcoin: "Bitcoin",
      ethereum: "Ethereum",
      algorand: "Algorand",
      solana: "Solana",
    },
    time: {
      ago: "më parë",
      minute: "minutë",
      minutes: "minuta",
      hour: "orë",
      hours: "orë",
      day: "ditë",
      days: "ditë",
      week: "javë",
      weeks: "javë",
      month: "muaj",
      months: "muaj",
      year: "vit",
      years: "vite",
      now: "tani",
      today: "sot",
      yesterday: "dje",
      thisWeek: "këtë javë",
      lastWeek: "javën e kaluar",
      thisMonth: "këtë muaj",
      lastMonth: "muajin e kaluar",
    },
    messages: {
      copied: "U kopjua!",
      copiedToClipboard: "u kopjua në clipboard",
      cannotCopy: "Nuk mund të kopjohet në clipboard",
      walletCreated: "Portofoli u krijua me sukses!",
      walletImported: "Portofoli u importua me sukses!",
      invalidSeedPhrase: "Ju lutemi futni një frazë rikuperimi të vlefshme",
      seedPhraseMustBe: "Fraza e rikuperimit duhet të përmbajë 12 ose 24 fjalë",
      pinChanged: "Kodi PIN u ndryshua me sukses!",
      pinChangeError: "Gabim në ndryshimin e PIN",
      transactionSent: "Transaksioni u dërgua me sukses",
      transactionReceived: "Transaksioni u mor",
      transactionFailed: "Transaksioni dështoi",
      networkError: "Gabim në rrjet",
      tryAgain: "Ju lutemi provoni përsëri",
      dataEncrypted: "Të dhënat tuaja janë të enkriptuara dhe të ruajtura lokalisht në pajisjen tuaj",
    },
  },
}

export function getTranslation(language: Language): Translations {
  return translations[language] || translations.fr
}

export interface LanguageInfo { code: Language; flag: string; nativeName: string; name: string }

export function getSupportedLanguages(): LanguageInfo[] {
  return [
    { code: 'fr', flag: '🇫🇷', nativeName: 'Français', name: 'French' },
    { code: 'en', flag: '🇬🇧', nativeName: 'English', name: 'English' },
    { code: 'de', flag: '🇩🇪', nativeName: 'Deutsch', name: 'German' },
    { code: 'it', flag: '🇮🇹', nativeName: 'Italiano', name: 'Italian' },
    { code: 'es', flag: '🇪🇸', nativeName: 'Español', name: 'Spanish' },
    { code: 'sq', flag: '🇦🇱', nativeName: 'Shqip', name: 'Albanian' },
  ]
}

export function getTranslations(language: Language): Translations {
  return getTranslation(language)
}
