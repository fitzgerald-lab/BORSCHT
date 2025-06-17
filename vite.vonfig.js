import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Optional: If your app uses specific aliases, configure here
  // resolve: {
  //   alias: {
  //     '@': '/src'
  //   }
  // }
})
