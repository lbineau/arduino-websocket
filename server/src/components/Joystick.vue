<script>
import { defineComponent } from 'vue'
import { socket } from '@/socket'
import nipplejs from 'nipplejs'
import _throttle from 'lodash/throttle'

export default defineComponent({
  mounted () {
    const joystickSize = 300

    const joystick = nipplejs.create({
      zone: document.getElementById('joystick'),
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'orange',
      // lockY: true,
      size: joystickSize,
      multitouch: true
    })

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
  }
})
</script>

<template>
  <div class="joystick-container">
    <div class="joystick" id="joystick"></div>
  </div>
</template>

<style scoped>
.joystick-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.joystick {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
}

</style>
