import './reset.css'
import './style.css'
import nipplejs from 'nipplejs'
import { io } from 'socket.io-client'
import _throttle from 'lodash/throttle'

const joystickSize = 300

const joystick = nipplejs.create({
  zone: document.getElementById('joystick'),
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'orange',
  lockY: true,
  size: joystickSize,
  multitouch: true
})

// Connect to the socket server
const socket = io('/arduino')

// debounce speed update to prevent flooding the server
const debouncedEmitSpeed = _throttle((speed) => socket.emit('motor:speed', speed), 100)

joystick.on('end', () => {
  debouncedEmitSpeed(0)
})

joystick.on('move', (evt, data) => {
  const normalizedSpeed = data.distance / (joystickSize / 2)
  debouncedEmitSpeed(normalizedSpeed)
})

joystick.on('dir:up', (evt, data) => {
  socket.emit('motor:forward')
})

joystick.on('dir:down', () => {
  socket.emit('motor:backward')
})

// When the event motor:forward is received
socket.on('motor:forward', () => {
  // TODO add information on the interface
  console.log('motor:forward')
})

// When the event motor:backward is received
socket.on('motor:backward', () => {
  // TODO add information on the interface
  console.log('motor:backward')
})

document.querySelector('.js-button-sound')?.addEventListener('click', () => {
  socket.emit('sound:play', 1)
})
