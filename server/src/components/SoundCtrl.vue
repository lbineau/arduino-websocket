<script>
import { defineComponent } from 'vue'
import { socket } from '@/socket'

export default defineComponent({
  methods: {
    onClick () {
      socket.emit('sound:play', 1)
    }
  }
})
</script>

<template>
  <div class="sound-container">
    <button @click="onClick" class="js-button-sound">What wooo 🔈</button>
  </div>
</template>

<style scoped>
.sound-container {
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
  padding: 1rem;
}
</style>
