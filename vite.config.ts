import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/emoji-mix/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  plugins: [
    vue(),
    VueSetupExtend(),
    VitePWA({
      registerType: 'autoUpdate',
      scope: '/emoji-mix/',
      manifest: {
        name: 'emoji-mix',
        short_name: 'emoji-mix',
        description: 'Combined two emojis into one',
        start_url: '/emoji-mix/',
        display: 'standalone',
        background_color: '#f78e48',
        theme_color: '#f78e48',
        prefer_related_applications: true,
      },
    })
  ]
})
