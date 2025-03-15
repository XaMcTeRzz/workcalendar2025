// Специальный файл для обнаружения Vite в проекте Vercel
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Это дополнительный файл, который помогает Vercel правильно определить проект как Vite
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
}); 