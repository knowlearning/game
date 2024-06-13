<script setup>
  import { ref, onMounted } from 'vue'
  import Game from './Game.js'

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 600

  const myCanvas = ref(null)
  const fps = ref(null)

  onMounted(() => {
    const canvas = myCanvas.value

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    const context = canvas.getContext('2d')
    const game = new Game(context, CANVAS_WIDTH, CANVAS_HEIGHT)

    game.initialize()

    const sampleGameMetrics = () => {
      fps.value = game.fps
      setTimeout(sampleGameMetrics, 100)
    }

    sampleGameMetrics()
})
</script>

<template>
  <canvas ref="myCanvas" />
  <pre>Game Data
FPS: {{ fps.toFixed(1) }}
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
