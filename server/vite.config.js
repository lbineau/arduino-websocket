import socketVite from './socket/plugin'
import eslint from 'vite-plugin-eslint'

export default {
  plugins: [socketVite(), eslint()]
}
