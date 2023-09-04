<script>
import { defineComponent } from 'vue'
import { socket } from '@/socket'
import ChopperSVG from '@/assets/chopper-wireframe.svg?raw'

export default defineComponent({
  data () {
    return {
      svg: ChopperSVG
    }
  },
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
    <div class="svg" v-html="svg"></div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
}
button {
  color: #fff;
  border: 2px solid #fff;
  padding: .5em 1em;
  font-size: 18px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  outline: none;
}
button:hover {
  background-color: #fff;
  color: #000;
}
.svg {
  width: clamp(150px, 40%, 500px);
  max-width: 100%;
  display: block;
  margin: 1rem auto;
}

.svg:deep(svg .cls-1) {
  stroke: white;
  stroke-width: 2px;
  filter: drop-shadow(0px 0px 10px white);
}
</style>
