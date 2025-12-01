import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Modulo-Aulas/',
  server: {
    port: 3000, // Fija el puerto en 3000 (http://localhost:3000)
    open: true, // Abre el navegador automáticamente al iniciar
  }
})