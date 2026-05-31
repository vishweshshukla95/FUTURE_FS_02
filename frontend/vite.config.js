import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/leads': 'http://localhost:3001',
      '/stats': 'http://localhost:3001',
    }
  }
})