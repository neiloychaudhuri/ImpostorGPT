import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../dist')
  },
  server: {
    port: 3000,
    proxy: {
      '/generate-category': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})

