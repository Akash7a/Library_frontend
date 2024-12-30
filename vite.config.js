import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': apiUrl, // Proxy API requests to backend server
    }
  },
  plugins: [react()],
})