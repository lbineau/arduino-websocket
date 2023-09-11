const { Board, Motor } = require('johnny-five')
const config = require('./config')
const io = require('socket.io-client')
const player = require('play-sound')()
let audio
console.log(('totot'))
/**
 * Re-maps a number from one range to another.
 *
 * For example, calling `map(2, 0, 10, 0, 100)` returns 20. The first three
 * arguments set the original value to 2 and the original range from 0 to 10.
 * The last two arguments set the target range from 0 to 100. 20's position
 * in the target range [0, 100] is proportional to 2's position in the
 * original range [0, 10].
 *
 * @method map
 * @param  {Number} value  the incoming value to be converted.
 * @param  {Number} start1 lower bound of the value's current range.
 * @param  {Number} stop1  upper bound of the value's current range.
 * @param  {Number} start2 lower bound of the value's target range.
 * @param  {Number} stop2  upper bound of the value's target range.
 * @return {Number}        remapped number.
 **/
function map (n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
}

// Connect to the socket server
const socket = io.connect(config.url)

const board = new Board()

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
    const speed = map(Math.abs(normSpeed), 0, 1, 0, motorMaxSpeed)
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
  audio?.kill()
  audio = player.play(`assets/sound/chopper-sound${soundtrack}.wav`, (err) => {
    if (err && !err.killed) {
      console.error(err)
      throw err
    }
  })
})
