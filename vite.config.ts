import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  build: {
    // Optimizaciones para producción
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Code splitting optimizado
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'services': ['./src/services/trackService', './src/services/imageService'],
        },
        // Optimizar nombres de chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Optimizaciones de chunk size
    chunkSizeWarningLimit: 1000,
    // Preload de módulos críticos
    modulePreload: {
      polyfill: true,
    },
  },
  // Optimizar dependencias
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [],
  },
})
