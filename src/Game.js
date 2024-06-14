import Input from './Input.js'
import Pen from './Pen.js'
import Bug from './Bug.js'

export default class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.objects = [new Pen(this), new Bug(this, this.randomPosition())]
    this.input = new Input(this)
  }

  initialize() {
    let lastTimestamp = 0

    const animate = timestamp => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const dt = timestamp - lastTimestamp
      this.fps = 1000 / dt
      lastTimestamp = timestamp

      this.objects.forEach(object => object.update(dt))
      this.objects.forEach(object => object.draw())

      requestAnimationFrame(animate)
    }
    animate(0)
  }

  randomPosition() {
    return {
      x: Math.floor(Math.random() * this.canvas.width),
      y: Math.floor(Math.random() * this.canvas.height)
    }
  }
}
