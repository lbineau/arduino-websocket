/**
 * @param {import('socket.io').Server} server
 */
export default (server) => {
  server.of('/arduino').on('connection', (socket) => {
    console.log('/arduino connected')

    socket.on('motor:speed', function (normalizedSpeed) {
      socket.broadcast.emit('motor:speed', normalizedSpeed)
      console.log('Broadcasting: motor:speed')
    })

    socket.on('motor:forward', function () {
      socket.broadcast.emit('motor:forward')
      console.log('Broadcasting: motor:forward')
    })

    socket.on('motor:backward', function () {
      socket.broadcast.emit('motor:backward')
      console.log('Broadcasting: motor:backward')
    })
  })
}
