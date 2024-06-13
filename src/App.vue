<script setup>
  import { ref, onMounted } from 'vue'
  import Game from './Game.js'

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 600

  const myCanvas = ref(null)
  const fps = ref(0)
  const pointer = ref({ x: 0, y: 0 })
  const keys = ref({})

  onMounted(() => {
    const canvas = myCanvas.value
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    const game = new Game(canvas)
    game.initialize()

    const sampleGameMetrics = () => {
      fps.value = game.fps
      pointer.value = game.input.pointer
      keys.value = game.input.keys
      setTimeout(sampleGameMetrics, 1000/60)
    }

    sampleGameMetrics()
})
</script>

<template>
  <canvas ref="myCanvas" />
  <pre>Game Data
FPS: {{ fps.toFixed(1) }}
Pointer: {{ pointer.x.toFixed(1) }}, {{ pointer.y.toFixed(1) }}
Keys: {{ keys }}
</pre>
</template>

<style scoped>
  canvas {
    width: 800px;
    height: 600px;
    border: 5px solid black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
