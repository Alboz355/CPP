# Crypto Wallet App

This is a crypto wallet application built with Next.js, React, and Shadcn UI.

## Features

-   **Wallet Generation**: Generate new Bitcoin (SegWit), Ethereum, and Algorand wallets.
-   **Wallet Import/Export**: Import wallets using 12/24-word mnemonic phrases.
-   **PIN Security**: Secure your wallet with a PIN for sensitive operations.
-   **Real-time Prices**: View real-time prices for BTC, ETH, ALGO.
-   **Buy Crypto**: Integrate with Mt Pelerin for direct crypto purchases.
-   **Responsive UI**: Optimized for iOS, Android, and desktop.
-   **Dark Mode**: Full dark mode support.
-   **Error Handling**: Comprehensive error boundaries and informative messages.

## Getting Started

1.  **Clone the repository**:
    \`\`\`bash
    git clone [repository-url]
    cd crypto-wallet-app
    \`\`\`
2.  **Install dependencies**:
    \`\`\`bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    \`\`\`
3.  **Run the development server**:
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router pages and layout.
-   `components/`: Reusable React components, including UI components from Shadcn UI.
-   `hooks/`: Custom React hooks.
-   `lib/`: Utility functions and blockchain-related logic.
-   `public/`: Static assets.
-   `styles/`: Global CSS.

## Technologies Used

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Shadcn UI
-   `bip39` for mnemonic phrases
-   `ethers` for Ethereum wallet generation
-   `bech32` for Bitcoin SegWit addresses
-   `@noble/hashes` for cryptographic hashing
-   `@scure/base` for Base32 encoding
-   `ed25519-hd-key` for Algorand key derivation
-   CoinGecko API for real-time prices
-   Mt Pelerin API for crypto purchases

## Production Readiness

### Critical fixes included

- Removed dependency on online Google Fonts during build to avoid production build failures in restricted/offline CI environments.
- Hardened browser-only storage managers (`SecureStorage`, `OfflineManager`) so they do not break during static generation or server-side rendering.
- Added a typed storage layer (`lib/app-db.ts`) to validate and sort transaction history before UI rendering.
- Added a default ESLint configuration to avoid blocking interactive prompts in CI/CD.

### Deploy (static export)

This project uses `output: "export"`, so deployment is static:

```bash
npm ci
npm run build
```

Then publish the generated `out/` folder on any static host (Vercel static output, Netlify, Cloudflare Pages, S3+CloudFront, etc.).

### Notes

- `next.config.mjs` contains security headers, but static export hosts may require setting equivalent headers at CDN/hosting level.
- For Electron, keep using the `electron` and `dist:*` scripts after `npm run build`.
