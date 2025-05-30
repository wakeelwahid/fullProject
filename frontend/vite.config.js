import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['ec6f988c-d038-4682-ac07-7a507891b5b1-00-rc6in6agvjnm.sisko.replit.dev']
  }
})
