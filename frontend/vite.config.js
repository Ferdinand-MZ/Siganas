import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      // Semua request /api/* diteruskan ke backend FastAPI
      // supaya tidak kena masalah CORS saat development.
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Endpoint publik traceability (tanpa prefix /api/v1)
      '/public': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
