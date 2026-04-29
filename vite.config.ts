import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-website/',  // GitHub Pages 部署路徑，請根據你的 repo 名稱修改
})
