import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
    base: '/loan-graph/',
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
            manifest: {
                name: 'Loan Graph — расчёт досрочных погашений',
                short_name: 'Кредитный калькулятор',
                description: 'Калькулятор графика платежей с досрочными погашениями',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/loan-graph/',
                scope: '/loan-graph/',
                icons: [
                    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
                    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
                navigateFallback: '/loan-graph/index.html',
            },
        })
    ],
    resolve: {
        alias: { '@': path.resolve(import.meta.dirname, './src') },
    },
})