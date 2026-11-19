import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { target: 'es2019', chunkSizeWarningLimit: 800 },
  // host:true lets you open the dev site from an iPhone/Android on the same Wi-Fi
  server: { host: true },
})
