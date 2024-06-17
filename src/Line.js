export default class Line {
  constructor(game, p1, p2) {
    this.game = game
    this.p1 = p1
    this.p2 = p2
    this.hitbox = {
        x1: p1.x, y1: p1.y,
        x2: p2.x, y2: p2.y}
  }
  update() {}
  draw() {
    const ctx = this.game.context
    ctx.beginPath()
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.lineTo(this.p2.x, this.p2.y)
    ctx.stroke()
  }
  collide({ target }) {
    const { hitbox } = target
    console.log('COLLIDED!!!!!!', target, this)
  }
}