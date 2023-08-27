/**
 * @param {import('socket.io').Server} server
 */
export default (server) => {
  server.of('/arduino').on('connection', (socket) => {
    console.log('/arduino connected')

    socket.on('motor:speed', (normalizedSpeed) => {
      socket.broadcast.emit('motor:speed', normalizedSpeed)
      console.log('Broadcasting: motor:speed', normalizedSpeed)
    })

    socket.on('motor:forward', () => {
      socket.broadcast.emit('motor:forward')
      console.log('Broadcasting: motor:forward')
    })

    socket.on('motor:backward', () => {
      socket.broadcast.emit('motor:backward')
      console.log('Broadcasting: motor:backward')
    })

    socket.on('sound:play', (soundtrack) => {
      socket.broadcast.emit('sound:play', soundtrack)
      console.log('Broadcasting: sound:play', soundtrack)
    })
  })
}
