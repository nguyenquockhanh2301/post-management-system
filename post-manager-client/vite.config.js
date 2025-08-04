import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'https://post-management-system-production.up.railway.app',
      '/posts': 'https://post-management-system-production.up.railway.app',
      '/uploads': 'https://post-management-system-production.up.railway.app',
    },
  },
});
