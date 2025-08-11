/** @type {import('next').NextConfig} */
const nextConfig = {
  // Indique à Next.js d'exporter des fichiers HTML, CSS et JavaScript statiques.
  // C'est essentiel pour que Capacitor puisse encapsuler votre application web.
  output: 'export',

  // Spécifie le répertoire de sortie pour les fichiers statiques générés par 'next export'.
  // Par défaut, c'est 'out', et il est recommandé de le conserver ainsi pour la compatibilité avec Capacitor.
  distDir: 'out',

  // Configuration pour la gestion des images.
  // 'unoptimized: true' est recommandé pour les exports statiques.
  // Cela désactive l'optimisation d'image de Next.js qui nécessite un serveur.
  // Si vous utilisez des images, assurez-vous qu'elles sont déjà optimisées ou utilisez des images statiques.
  images: {
    unoptimized: true,
  },

  // Vous pouvez ajouter d'autres configurations Next.js ici si nécessaire.
  // Par exemple, pour les variables d'environnement, les en-têtes, etc.
  // env: {
  //   MY_ENV_VAR: process.env.MY_ENV_VAR,
  // },
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'Cross-Origin-Opener-Policy',
  //           value: 'same-origin',
  //         },
  //         {
  //           key: 'Cross-Origin-Embedder-Policy',
  //           value: 'require-corp',
  //         },
  //       ],
  //     },
  //   ];
  // },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  webpack: (config) => {
    // Activer WebAssembly pour tiny-secp256k1
    config.experiments = { ...(config.experiments || {}), asyncWebAssembly: true }
    config.module.rules.push({ test: /\.wasm$/, type: 'webassembly/async' })
    return config
  },
};

export default nextConfig;
