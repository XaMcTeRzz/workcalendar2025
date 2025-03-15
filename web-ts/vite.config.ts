import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
        },
      },
    },
    // Обеспечиваем совместимость с Vercel
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  // Правильный префикс для переменных окружения
  envPrefix: 'VITE_',
  // Оптимизации для production
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-icons'],
  },
}); 