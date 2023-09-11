<script>
import { defineComponent } from 'vue'
import { socket } from '@/socket'
import nipplejs from 'nipplejs'
import _throttle from 'lodash/throttle'

export default defineComponent({
  data () {
    return {
      joystickSize: 80,
      joystickWrapperMaxSize: 360
    }
  },
  mounted () {
    const joystickSize = this.joystickSize

    const joystick = nipplejs.create({
      zone: this.$refs.joystick,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'white',
      // lockY: true,
      size: joystickSize,
      multitouch: false,
      restOpacity: 1,
      dynamicPage: true
    })

    // debounce speed update to prevent flooding the server
    const debounceEmitJoystickUpdate = _throttle((normX, normyY, normDistance) => socket.emit('joystick:update', normX, normyY, normDistance), 100)

    joystick.on('end', () => {
      debounceEmitJoystickUpdate(0, 0, 0)
    })

    joystick.on('move', (evt, data) => {
      const normDistance = data.distance / (joystickSize / 2)
      debounceEmitJoystickUpdate(
        Math.cos(data.angle.radian),
        Math.sin(data.angle.radian),
        normDistance
      )
    })
  }
})
</script>

<template>
  <div class="joystick-container">
    <h2 class="title font-family-aurebesh">Joystick</h2>
    <div class="joystick-wrapper">
      <div class="joystick" ref="joystick"></div>
    </div>
  </div>
</template>

<style scoped>
.title {
  position: relative;
  z-index: 1;
  text-align: center;
}
.joystick-container {
  position: relative;
  display: flex;
  flex-direction: column;
  place-items: center;
}

.joystick-wrapper {
  position: relative;
  --size: clamp(200px, 100%, calc(v-bind(joystickWrapperMaxSize) * 1px));
  width: 100%;
  aspect-ratio: 1;
  max-width: var(--size);
  container-type: size;
  margin-top: auto;
  margin-bottom: auto;
  filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.8));
}

.joystick-wrapper:before {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 100%;
  height: 100%;
  background: url('@/assets/Republic_Emblem.svg') no-repeat center;
  opacity: 0.5;
  background-size: contain;
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
  --size-stick: calc(v-bind(joystickSize) * 100cqw / v-bind(joystickWrapperMaxSize));
  --size-stick-half-negative: calc(var(--size-stick) * -0.5);
  width: var(--size-stick) !important;
  height: var(--size-stick) !important;
  margin-top: var(--size-stick-half-negative) !important;
  margin-left: var(--size-stick-half-negative) !important;
}

</style>
