import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = import.meta.dirname;
  const env = {
    ...loadEnv('main', envDir, ''),
    ...loadEnv(mode, envDir, ''),
  };
  const serverUrl = env.VITE_SERVER_URL || 'http://localhost:3001';

  return {
    envDir,
    plugins: [
      vue(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: Number(env.PORT) || 5173,
      proxy: {
        '/api': {
          target: serverUrl,
          changeOrigin: true,
        },
        '/uploads': {
          target: serverUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
