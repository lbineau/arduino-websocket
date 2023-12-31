import { reactive } from 'vue'
import { io } from 'socket.io-client'

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
})

export const socket = io('/arduino')

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})
