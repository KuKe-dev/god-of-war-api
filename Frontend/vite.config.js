import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'god-of-war-api-fjw3.onrender.com', // Add your API host here
      // You can keep other allowed hosts if they exist
    ],
    host: '0.0.0.0',
    watch: {
      usePolling: true,  // Necesario para Docker en algunos sistemas
    },
    
  },
})
