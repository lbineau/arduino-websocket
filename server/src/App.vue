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
  grid-template-rows: min-content minmax(0, 1fr);
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  padding: 1rem;
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
  grid-area: sounds;
}
.joystick-container {
  grid-area: joystick;
}

@media screen and (orientation: landscape) {
  .grid {
    grid-template-areas: "sounds joystick";
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    grid-template-rows: minmax(0, 1fr);
  }
}
</style>
