const { Board, Motor } = require('johnny-five')
const config = require('../config')
const io = require('socket.io-client')

// Connect to the socket server
const socket = io.connect(config.url)

const board = new Board()

board.on('ready', () => {
  /*
    Arduino Motor Shield R3
      Motor A
        pwm: 3
        dir: 12
        brake: 9

      Motor B
        pwm: 11
        dir: 13
        brake: 8
   */

  const motor = new Motor({
    pins: {
      pwm: 3,
      dir: 12,
      brake: 9
    }
  })

  const motorSpeed = 90 // speed 0-255
  let motorNormalizedSpeed = 1

  board.repl.inject({
    motor
  })

  motor.on('start', () => {
    console.log(`start: ${Date.now()}`)
  })

  motor.on('stop', () => {
    console.log(`automated stop on timer: ${Date.now()}`)
  })

  motor.on('brake', () => {
    console.log(`automated brake on timer: ${Date.now()}`)
  })

  // Set motor speed in the current direction when event motor:speed is received
  socket.on('motor:speed', function (normalizedSpeed) {
    motorNormalizedSpeed = normalizedSpeed
    if (normalizedSpeed === 0) {
      // Force a motor to stop (as opposed to coasting). Please note that this only works on boards with a dedicated brake pin. Other boards and interfaces will simply coast.
      motor.brake()
    } else {
      motor.start(motorNormalizedSpeed * motorSpeed)
    }
  })

  // Start motor at the current speed when event motor:forward is received
  socket.on('motor:forward', function () {
    motor.forward(motorSpeed)
  })

  // Start motor in reverse direction when event motor:backward is received
  socket.on('motor:backward', function () {
    motor.reverse(motorSpeed)
  })
})
