import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router'
          }
          if (id.includes('node_modules/@tanstack/react-query') && !id.includes('devtools')) {
            return 'vendor-query'
          }
          if (id.includes('node_modules/dompurify')) {
            return 'vendor-sanitize'
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://fineract.us',
        changeOrigin: true,
        secure: true,
      },
      '/login': {
        target: 'https://fineract.us',
        changeOrigin: true,
        secure: true,
      },
      '/logout': {
        target: 'https://fineract.us',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
