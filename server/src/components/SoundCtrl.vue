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
  <div class="sound-container font-family-aurebesh">
    <h2 class="title font-family-aurebesh">Sounds</h2>
    <button @click="onClick" class="js-button-sound">What wooo 🔈</button>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
}
</style>
