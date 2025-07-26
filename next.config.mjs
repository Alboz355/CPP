/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ajout de la ligne essentielle pour les styles dans Electron
  assetPrefix: './',

  // Vos configurations existantes que nous conservons
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
}

export default nextConfig
