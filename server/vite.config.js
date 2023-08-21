import socketVite from './socket/plugin'
import eslint from 'vite-plugin-eslint'

export default {
  plugins: [socketVite(), eslint()],
  server: {
    port: 1234,
    strictPort: true
  },
  preview: {
    port: 1234,
    strictPort: true
  },
}
