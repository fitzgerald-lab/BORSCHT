import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), 
  tailwindcss()],
  // Optional: If your app uses specific aliases, configure here
  // resolve: {
  //   alias: {
  //     '@': '/src'
  //   }
  // }
})
