import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      'process.env': {},
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY)
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'google-maps': ['@react-google-maps/api']
          }
        }
      }
    }
  };
});