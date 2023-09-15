import JohnnyFive from 'johnny-five'
import { map, clamp } from './utils.js'
import config from './config.js'
import io from 'socket.io-client'
import PlaySound from 'play-sound'
let audio
const { Board, Motor } = JohnnyFive

// Connect to the socket server
const socket = io.connect(config.url)

// S'il y a plusieurs ports, il faut forcer un port en particulier
// exemple sur windows new Board({ port: "COM3" })

board.on('ready', () => {
  console.log('board ready')
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

  const motorL = new Motor({
    pins: {
      pwm: 3,
      dir: 12,
      brake: 9
    }
  })

  const motorR = new Motor({
    pins: {
      pwm: 11,
      dir: 13,
      brake: 8
    }
  })

  board.repl.inject({
    motorL,
    motorR
  })

  const motorMaxSpeed = 255 // speed 0-255
  const tresholdX = 0.3 // seuil minimal des départ des moteurs -0.3 | 0.3
  const tresholdY = 0.3 // seuil minimal des départ des moteurs -0.3 | 0.3

  const moveMotor = (motor, normSpeed) => {
    // transform normalized speed from 0-1 to 0-255(motorMaxSpeed)
    const speed = map(Math.abs(normSpeed), 0, 1, 0, motorMaxSpeed, true)
    switch (Math.sign(normSpeed)) {
      case 1:
        motor.forward(speed)
        break
      case -1:
        motor.reverse(speed)
        break
      default:
        motor.stop()
    }
  }

  // Set motor speed in the current direction when event motor:speed is received
  socket.on('joystick:update', (normX, normY, normDistance) => {
    let motorLeftNormSpeed = 0
    let motorRightNormSpeed = 0
    // Si le joystick n'est pas au centre (en tenant compte du seuil)
    if (!(normX < tresholdX && normX > -tresholdX && normY < tresholdY && normY > -tresholdY)) {
      motorLeftNormSpeed = (normY + normX) * normDistance
      motorRightNormSpeed = (normY - normX) * normDistance
    }
    moveMotor(motorL, motorLeftNormSpeed)
    moveMotor(motorR, motorRightNormSpeed)
  })
})

// Play specific sound
socket.on('sound:play', (soundtrack) => {
  console.log('sound:play', soundtrack)
  const player = new PlaySound()
  audio?.kill()
  audio = player.play(`assets/sound/chopper-sound${soundtrack}.wav`, (err) => {
    if (err && !err.killed) {
      console.error(err)
      throw err
    }
  })
})
