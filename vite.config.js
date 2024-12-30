import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get the backend API URL from environment variables or default to localhost for development
const apiUrl = import.meta.VITE_API_URL || "http://localhost:3000";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': apiUrl, // Proxy API requests to backend server
    }
  },
  plugins: [react()],
})