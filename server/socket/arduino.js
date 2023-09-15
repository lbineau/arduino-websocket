/**
 * @param {import('socket.io').Server} server
 */
export default (server) => {
  server.of('/arduino').on('connection', (socket) => {
    console.log('/arduino connected')

    socket.on('joystick:update', (normX, normyY, normDistance) => {
      socket.broadcast.emit('joystick:update', normX, normyY, normDistance)
      // console.log('Broadcasting: joystick:update', normX, normyY, normDistance)
    })

    socket.on('sound:play', (soundtrack) => {
      socket.broadcast.emit('sound:play', soundtrack)
      console.log('Broadcasting: sound:play', soundtrack)
    })
  })
}
