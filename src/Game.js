import Input from './Input.js'

export default class Game {
  constructor(canvas) {
    this.context = canvas.getContext('2d')
    this.width = canvas.width
    this.height = canvas.height
    this.objects = []
    this.input = new Input(canvas)
  }

  initialize() {
    let lastTimestamp = 0

    const animate = timestamp => {
      const dt = timestamp - lastTimestamp
      this.fps = 1000 / dt
      lastTimestamp = timestamp

      this.objects.forEach(object => object.update(dt))
      this.objects.forEach(object => object.draw())

      requestAnimationFrame(animate)
    }
    animate(0)
  }
}