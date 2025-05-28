import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['ef1108a0-0562-4b6b-8a98-ad9642064979-00-ey6rfojnikxd.pike.replit.dev']
  }
})
