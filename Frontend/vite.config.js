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
    cors: {
      origin: '*', // o especifica dominios permitidos ['http://localhost:3000', 'https://tudominio.com']
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  },
})
