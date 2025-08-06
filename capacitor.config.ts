import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cpp.com',
  appName: 'CryptoPayPro',
  // La correction la plus importante est ici :
  // On pointe vers 'out', le dossier qui contient votre site compilé.
  webDir: 'out',
  // C'est une bonne pratique à ajouter pour les frameworks modernes.
  bundledWebRuntime: false
};

export default config;
