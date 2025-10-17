import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for Brewstops
export default defineConfig({
  plugins: [react()],
  root: '.', // tells Vite to use the repo root as the working directory
  build: {
    outDir: 'dist', // output folder for built files
    emptyOutDir: true // clears old files before building
  },
  server: {
    port: 5173, // local dev port (optional, can remove)
    open: true
  }
})

