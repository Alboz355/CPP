// main.js

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Crée la fenêtre du navigateur.
  const win = new BrowserWindow({
    width: 1200, // J'ai agrandi un peu la fenêtre par défaut
    height: 800,
    webPreferences: {
      // Note: preload est important pour la sécurité, même si le fichier est vide pour l'instant
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'out/favicon.ico') // Optionnel : ajoute une icône
  });

  // et charge le fichier index.html de votre application.
  // Ce fichier a été généré par la commande "npm run build" dans le dossier "out"
  win.loadFile('out/index.html');

  // Optionnel: Ouvre les outils de développement (équivalent de F12 dans Chrome)
  // win.webContents.openDevTools();
}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // Sur macOS, il est courant de recréer une fenêtre dans l'application quand
    // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quitte l'application quand toutes les fenêtres sont fermées, sauf sur macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
