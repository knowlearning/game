const Objects = []

export default class Game {
  constructor(context, width, height) {
    this.context = context
    this.width = width
    this.height = height
  }

  initialize() {
    let lastTimestamp = 0
    const animate = timestamp => {
      const dt = timestamp - lastTimestamp
      this.fps = 1000 / dt
      lastTimestamp = timestamp

      Objects.forEach(object => object.update(dt))
      Objects.forEach(object => object.draw())

      requestAnimationFrame(animate)
    }
    animate(0)
  }
}