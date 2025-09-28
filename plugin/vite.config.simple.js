import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/index.html'),
        maximized: path.resolve(__dirname, 'src/maximized/index.html')
      }
    },
    outDir: 'dist'
  }
})