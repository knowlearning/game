export default class Path {
  constructor(game) {
    this.game = game
    this.path = []
  }
  addPoint({ x, y }) {
    this.path.push({ x, y })
  }
  update() {}
  draw() {
    const ctx = this.game.context
    ctx.beginPath()
    ctx.moveTo(this.path[0].x, this.path[0].y)
    this.path.forEach(({ x, y }) => ctx.lineTo(x, y) )
    ctx.stroke()
  }
}