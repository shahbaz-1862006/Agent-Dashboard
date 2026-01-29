import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: Number(process.env.PORT) || 5000,
    strictPort: true,
    allowedHosts: 'all',
    hmr: { clientPort: 443 },
  },
  plugins: [vue()],
})
