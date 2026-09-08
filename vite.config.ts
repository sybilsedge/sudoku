import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@sybilsedge/blueprint-design/css': path.resolve(__dirname, '../blueprint-design/src/index.css'),
      '@sybilsedge/blueprint-design/tailwind-v4': path.resolve(__dirname, '../blueprint-design/src/tailwind-v4.css'),
      '@sybilsedge/blueprint-design/variables': path.resolve(__dirname, '../blueprint-design/src/variables.css'),
      '@sybilsedge/blueprint-design/utilities': path.resolve(__dirname, '../blueprint-design/src/utilities.css'),
      '@sybilsedge/blueprint-design/fonts': path.resolve(__dirname, '../blueprint-design/src/fonts.css'),
      '@sybilsedge/blueprint-design/tokens': path.resolve(__dirname, '../blueprint-design/src/tokens.json'),
      '@sybilsedge/blueprint-design': path.resolve(__dirname, '../blueprint-design/src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Sudoku Classic PWA',
        short_name: 'Sudoku',
        description: 'Zero-cost, ad-free, mobile-first Sudoku Progressive Web App',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}']
      }
    })
  ],
  worker: {
    format: 'es'
  }
})
