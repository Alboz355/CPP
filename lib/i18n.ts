// Simple internationalization system for the crypto wallet app

export interface Language {
  code: string
  name: string
  flag: string
  nativeName: string
}

export interface Translations {
  // Language Selection
  chooseLanguage: string
  selectAppLanguage: string
  continueIn: string
  selectLanguage: string
  languageWillBeUsed: string

  // Onboarding
  welcome: string
  createMultiCryptoWallet: string
  createWallet: string
  importWallet: string
  walletName: string
  walletNameOptional: string
  myMultiCryptoWallet: string
  importedWallet: string
  
  // Seed Phrase
  seedPhraseGenerated: string
  saveSeedPhraseSafely: string
  yourRecoveryPhrase: string
  recoveryPhrase12Words: string
  savedRecoveryPhrase: string
  continueWithWallet: string
  generateNewWallet: string
  enterRecoveryPhrase: string
  importWalletButton: string
  
  // Security
  security: string
  supportedCryptocurrencies: string
  
  // Errors
  errorCreatingWallet: string
  errorImporting: string
  invalidRecoveryPhrase: string
  generatedPhraseInvalid: string
  invalidAddresses: string
  
  // Crypto names
  bitcoin: string
  ethereum: string
  algorand: string
  tokens: string
  addOtherAccounts: string
}

const translations: Record<string, Translations> = {
  fr: {
    // Language Selection
    chooseLanguage: "Choisissez votre langue",
    selectAppLanguage: "Sélectionnez la langue de l'application",
    continueIn: "Continuer en",
    selectLanguage: "Sélectionnez une langue",
    languageWillBeUsed: "Cette langue sera utilisée pour toute l'interface de l'application",

    // Onboarding
    welcome: "Bienvenue",
    createMultiCryptoWallet: "Créez un portefeuille multi-crypto ou importez un portefeuille existant",
    createWallet: "Créer",
    importWallet: "Importer",
    walletName: "Nom du portefeuille",
    walletNameOptional: "Nom du portefeuille (optionnel)",
    myMultiCryptoWallet: "Mon Portefeuille Multi-Crypto",
    importedWallet: "Portefeuille Importé",
    
    // Seed Phrase
    seedPhraseGenerated: "Phrase de récupération générée !",
    saveSeedPhraseSafely: "Sauvegardez cette phrase en lieu sûr. Elle permet de récupérer tous vos comptes crypto.",
    yourRecoveryPhrase: "Votre phrase de récupération (12 mots)",
    recoveryPhrase12Words: "Phrase de récupération (12 ou 24 mots)",
    savedRecoveryPhrase: "J'ai sauvegardé ma phrase de récupération en lieu sûr",
    continueWithWallet: "Continuer avec ce portefeuille",
    generateNewWallet: "Générer un nouveau portefeuille",
    enterRecoveryPhrase: "Entrez votre phrase de récupération...",
    importWalletButton: "Importer le portefeuille",
    
    // Security
    security: "Sécurité",
    supportedCryptocurrencies: "Cryptomonnaies supportées :",
    
    // Errors
    errorCreatingWallet: "Erreur lors de la création du portefeuille",
    errorImporting: "Erreur lors de l'importation",
    invalidRecoveryPhrase: "Phrase de récupération invalide",
    generatedPhraseInvalid: "La phrase mnémonique générée n'est pas valide",
    invalidAddresses: "Une ou plusieurs adresses générées ne sont pas valides",
    
    // Crypto names
    bitcoin: "Bitcoin (BTC)",
    ethereum: "Ethereum (ETH) + tokens ERC-20",
    algorand: "Algorand (ALGO)",
    tokens: "tokens",
    addOtherAccounts: "Possibilité d'ajouter d'autres comptes"
  },
  
  en: {
    // Language Selection
    chooseLanguage: "Choose your language",
    selectAppLanguage: "Select the application language",
    continueIn: "Continue in",
    selectLanguage: "Select a language",
    languageWillBeUsed: "This language will be used for the entire application interface",

    // Onboarding
    welcome: "Welcome",
    createMultiCryptoWallet: "Create a multi-crypto wallet or import an existing wallet",
    createWallet: "Create",
    importWallet: "Import",
    walletName: "Wallet name",
    walletNameOptional: "Wallet name (optional)",
    myMultiCryptoWallet: "My Multi-Crypto Wallet",
    importedWallet: "Imported Wallet",
    
    // Seed Phrase
    seedPhraseGenerated: "Recovery phrase generated!",
    saveSeedPhraseSafely: "Save this phrase in a safe place. It allows you to recover all your crypto accounts.",
    yourRecoveryPhrase: "Your recovery phrase (12 words)",
    recoveryPhrase12Words: "Recovery phrase (12 or 24 words)",
    savedRecoveryPhrase: "I have saved my recovery phrase in a safe place",
    continueWithWallet: "Continue with this wallet",
    generateNewWallet: "Generate a new wallet",
    enterRecoveryPhrase: "Enter your recovery phrase...",
    importWalletButton: "Import wallet",
    
    // Security
    security: "Security",
    supportedCryptocurrencies: "Supported cryptocurrencies:",
    
    // Errors
    errorCreatingWallet: "Error creating wallet",
    errorImporting: "Error importing",
    invalidRecoveryPhrase: "Invalid recovery phrase",
    generatedPhraseInvalid: "The generated mnemonic phrase is not valid",
    invalidAddresses: "One or more generated addresses are not valid",
    
    // Crypto names
    bitcoin: "Bitcoin (BTC)",
    ethereum: "Ethereum (ETH) + ERC-20 tokens",
    algorand: "Algorand (ALGO)",
    tokens: "tokens",
    addOtherAccounts: "Ability to add other accounts"
  },

  es: {
    // Language Selection
    chooseLanguage: "Elige tu idioma",
    selectAppLanguage: "Selecciona el idioma de la aplicación",
    continueIn: "Continuar en",
    selectLanguage: "Selecciona un idioma",
    languageWillBeUsed: "Este idioma se usará para toda la interfaz de la aplicación",

    // Onboarding
    welcome: "Bienvenido",
    createMultiCryptoWallet: "Crea una billetera multi-cripto o importa una billetera existente",
    createWallet: "Crear",
    importWallet: "Importar",
    walletName: "Nombre de la billetera",
    walletNameOptional: "Nombre de la billetera (opcional)",
    myMultiCryptoWallet: "Mi Billetera Multi-Cripto",
    importedWallet: "Billetera Importada",
    
    // Seed Phrase
    seedPhraseGenerated: "¡Frase de recuperación generada!",
    saveSeedPhraseSafely: "Guarda esta frase en un lugar seguro. Te permite recuperar todas tus cuentas cripto.",
    yourRecoveryPhrase: "Tu frase de recuperación (12 palabras)",
    recoveryPhrase12Words: "Frase de recuperación (12 o 24 palabras)",
    savedRecoveryPhrase: "He guardado mi frase de recuperación en un lugar seguro",
    continueWithWallet: "Continuar con esta billetera",
    generateNewWallet: "Generar una nueva billetera",
    enterRecoveryPhrase: "Ingresa tu frase de recuperación...",
    importWalletButton: "Importar billetera",
    
    // Security
    security: "Seguridad",
    supportedCryptocurrencies: "Criptomonedas soportadas:",
    
    // Errors
    errorCreatingWallet: "Error al crear la billetera",
    errorImporting: "Error al importar",
    invalidRecoveryPhrase: "Frase de recuperación inválida",
    generatedPhraseInvalid: "La frase mnemónica generada no es válida",
    invalidAddresses: "Una o más direcciones generadas no son válidas",
    
    // Crypto names
    bitcoin: "Bitcoin (BTC)",
    ethereum: "Ethereum (ETH) + tokens ERC-20",
    algorand: "Algorand (ALGO)",
    tokens: "tokens",
    addOtherAccounts: "Posibilidad de agregar otras cuentas"
  }
}

export function getTranslations(languageCode: string): Translations {
  return translations[languageCode] || translations.fr // Default to French
}

export function getSupportedLanguages(): Language[] {
  return [
    {
      code: "fr",
      name: "French",
      flag: "🇫🇷",
      nativeName: "Français"
    },
    {
      code: "en",
      name: "English",
      flag: "🇺🇸",
      nativeName: "English"
    },
    {
      code: "es",
      name: "Spanish",
      flag: "🇪🇸",
      nativeName: "Español"
    },
    {
      code: "de",
      name: "German",
      flag: "🇩🇪",
      nativeName: "Deutsch"
    },
    {
      code: "it",
      name: "Italian",
      flag: "🇮🇹",
      nativeName: "Italiano"
    },
    {
      code: "pt",
      name: "Portuguese",
      flag: "🇵🇹",
      nativeName: "Português"
    }
  ]
}