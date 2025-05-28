import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['66de33cc-12f7-4b7c-9f57-e6d0c1c6dcb1-00-274hzvlk4e5m1.pike.replit.dev']
  }
})
