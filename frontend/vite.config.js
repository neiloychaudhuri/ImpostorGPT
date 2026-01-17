import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000
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

