<script>
import { defineComponent } from 'vue'
import { socket } from '@/socket'
import nipplejs from 'nipplejs'
import _throttle from 'lodash/throttle'

export default defineComponent({
  mounted () {
    const joystickSize = 300

    const joystick = nipplejs.create({
      zone: this.$refs.joystick,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'white',
      // lockY: true,
      size: joystickSize,
      multitouch: true,
      restOpacity: 1
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
    <h2 class="title font-family-aurebesh">Joystick</h2>
    <div class="joystick" ref="joystick"></div>
  </div>
</template>

<style scoped>
.title {
  position: absolute;
  top: 1rem;
  left: 0;
  right: 0;
  text-align: center;
}
.joystick-container {
  position: relative;
}

.joystick-container:before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url('@/assets/Republic_Emblem.svg') no-repeat center;
  opacity: 0.5;
}

.joystick {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.joystick:deep(.back) {
  opacity: 0!important;
}

.joystick:deep(.front) {
  opacity: 0.7!important;
}

</style>
