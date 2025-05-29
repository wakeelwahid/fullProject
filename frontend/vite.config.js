import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['bbc0843b-f2ca-4013-b426-d8157c16036a-00-2p14m5q4t9hfe.sisko.replit.dev']
  }
})
