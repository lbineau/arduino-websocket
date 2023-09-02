<script setup>
import Joystick from './components/Joystick.vue'
import SoundCtrl from './components/SoundCtrl.vue'
</script>

<template>
  <div class="grid">
    <SoundCtrl />
    <Joystick />
  </div>
</template>

<style scoped>
.grid {
  min-height: 100%;
  display: grid;
  grid-template-areas:
    "sounds"
    "joystick"
  ;
  grid-template-rows: min-content 1fr;
  gap: 2rem;
  padding: 2rem;
}
.grid > * {
  padding: 1rem;
  border: 2px solid;
  box-shadow:
    0 0 3px,
    0 0 3px inset
  ;
}
.sound-container {
  grid-area: "sounds";
}
.joystick-container {
  grid-area: "joystick";
}
</style>
