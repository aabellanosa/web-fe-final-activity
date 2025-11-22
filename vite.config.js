import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/fs': {
        target: 'https://places-api.foursquare.com/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fs/, ''),
      },
    },
  },
})
