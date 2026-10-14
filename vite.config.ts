import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/*.crdownload', '**/*.tmp', '**/*.zip']
    }
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three')) {
            return 'three-core';
          }
          if (id.includes('node_modules/@react-three/postprocessing')) {
            return 'postprocessing';
          }
          if (id.includes('node_modules/@react-three')) {
            return 'three-fiber';
          }
        }
      }
    }
  }
})
