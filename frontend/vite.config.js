import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['92ca8e6e-de92-4af9-8893-62d5d2353151-00-1atwjlg0z2lp2.sisko.replit.dev']
  }
})
