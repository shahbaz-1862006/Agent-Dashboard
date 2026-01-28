import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: true,
    port: Number(process.env.PORT) || 5000,
    strictPort: true,
    allowedHosts: 'all',
    hmr: { clientPort: 443 },
  },
  plugins: [react()],
})
