import five from 'johnny-five'
import config from './config.js'
import io from 'socket.io-client'
import PlaySound from 'play-sound'
import { gsap } from 'gsap'
let audio
const { Board, Motor } = five

// Connect to the socket server
const socket = io.connect(config.url)

// S'il y a plusieurs ports, il faut forcer un port en particulier
// exemple sur windows new Board({ port: "COM3" })
const board = new Board({
  repl: false
})

const motorMaxSpeed = 255 // speed 0-255
const tresholdX = 0.3 // seuil minimal des départ des moteurs -0.3 | 0.3
const tresholdY = 0.3 // seuil minimal des départ des moteurs -0.3 | 0.3
const tweenDuration = 3 // durée d'interpolation entre 2 valeurs de moteur
const motorVars = {
  normSpeedL: 0,
  normSpeedR: 0
}

const normSpeedLTo = gsap.quickTo(motorVars, 'normSpeedL', { duration: tweenDuration })
const normSpeedRTo = gsap.quickTo(motorVars, 'normSpeedR', { duration: tweenDuration })

// transform normSpeed to speed
const normSpeedToSpeed = gsap.utils.pipe(
  // transform normalized speed from 0-1 to 0-255(motorMaxSpeed)
  gsap.utils.mapRange(0, 1, 0, motorMaxSpeed),
  // increase by 10
  gsap.utils.snap(20),
  // force to stay between 0-255(motorMaxSpeed)
  gsap.utils.clamp(0, motorMaxSpeed)
)

// Set motor speed in the current direction when event motor:speed is received
socket.on('joystick:update', (normX, normY, normDistance) => {
  let motorLeftNormSpeed = 0
  let motorRightNormSpeed = 0
  // Si le joystick n'est pas au centre (en tenant compte du seuil)
  if (!(normX < tresholdX && normX > -tresholdX && normY < tresholdY && normY > -tresholdY)) {
    motorLeftNormSpeed = (normY + normX) * normDistance
    motorRightNormSpeed = (normY - normX) * normDistance
  }
  // tween number
  normSpeedLTo(motorLeftNormSpeed)
  // tween number
  normSpeedRTo(motorRightNormSpeed)
})

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
      dir: 12
    }
  })

  const motorR = new Motor({
    pins: {
      pwm: 11,
      dir: 13
    }
  })

  const moveMotor = (motor, normSpeed) => {
    const speed = normSpeedToSpeed(Math.abs(normSpeed))

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

  // everytime the motor variables changes, call moveMoto()
  normSpeedLTo.tween.eventCallback('onUpdate', function (motor, vars) {
    moveMotor(motor, vars.normSpeedL)
  }, [motorL, motorVars])
  normSpeedRTo.tween.eventCallback('onUpdate', function (motor, vars) {
    moveMotor(motor, vars.normSpeedR)
  }, [motorR, motorVars])

  board.on('exit', () => {
    // kill tweens
    normSpeedLTo.tween.kill()
    normSpeedRTo.tween.kill()

    // stop motors
    moveMotor(motorL, 0)
    moveMotor(motorR, 0)
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
 