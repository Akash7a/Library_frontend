import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get the backend API URL from environment variables or default to localhost for development
const apiUrl = import.meta.VITE_API_URL || "http://localhost:3000";

// Get the port from the environment variables (Render will provide it)
const port = process.env.PORT || 5173; // Fallback to 5173 for local development

// https://vite.dev/config/
export default defineConfig({
  server: {
    port, // Use the port from the environment variable or default to 5173
    host: true, // Expose server to the network
    proxy: {
      '/api': apiUrl, // Proxy API requests to backend server
    }
  },
  plugins: [react()],
});