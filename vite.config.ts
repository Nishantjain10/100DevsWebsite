import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js'
  },
  define: {
    'import.meta.env.VITE_APPWRITE_PROJECT_ID': JSON.stringify('67afd13e0020182e22da'),
    'import.meta.env.VITE_APPWRITE_DATABASE_ID': JSON.stringify('67afdbad00263aa6ad91'),
  }
})
