import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: true,  // Necesario para Docker en algunos sistemas
    },
    proxy: {
      '/api': {
        target: 'https://fictional-eureka-7vp5v496qqwrfx45v-1234.app.github.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
