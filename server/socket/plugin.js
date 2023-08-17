import { Server } from 'socket.io'
import configureArduinoSocketIO from './arduino'

const injectWebsocketIO = (server) => {
  const io = new Server(server.httpServer)
  configureArduinoSocketIO(io)
}
/**
 * @returns {import('vite').PluginOption}
 */
export default () => ({
  name: 'socket-io',
  configureServer: injectWebsocketIO,
  configurePreviewServer: injectWebsocketIO
})
