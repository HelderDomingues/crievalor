
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from "lovable-tagger"
import prerender from 'vite-plugin-prerender'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && prerender({
      staticDir: 'dist',
      routes: [
        '/',
        '/sobre',
        '/contato',
        '/projetos',
        '/mentorias',
        '/mar',
        '/lumia', 
        '/mentor-proposito',
        '/palestra',
        '/oficina-lideres',
        '/diagnostico-gratuito',
        '/material-exclusivo',
        '/identidade-visual',
        '/privacy-policy',
        '/terms-of-service',
        '/refund-policy',
        '/accessibility'
      ]
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 8080
  }
}))
