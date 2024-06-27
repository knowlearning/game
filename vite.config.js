import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { execSync } from 'child_process'

const varFromEnv = command => JSON.stringify(execSync(command).toString().trim())

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    GIT_COMMIT_HASH: varFromEnv('git rev-parse HEAD')
  },
  plugins: [
    vue(),
    basicSsl()
  ]
})
