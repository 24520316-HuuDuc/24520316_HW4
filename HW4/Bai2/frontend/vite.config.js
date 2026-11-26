import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Chuyển các request /api sang backend Express → không bị lỗi CORS khi dev
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
