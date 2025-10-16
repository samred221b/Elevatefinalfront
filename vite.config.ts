import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // Faster and no additional dependencies required
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 5174,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'elevate1-production.up.railway.app',
      '.railway.app',
      '.up.railway.app'
    ],
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    host: '0.0.0.0',
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'elevate1-production.up.railway.app',
      '.railway.app',
      '.up.railway.app'
    ],
  },
})
