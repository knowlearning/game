export default class Bug {
  constructor(game, position) {
    this.game = game
    this.position = position
    this.image = new Image()
    this.image.src = '/ladybug.svg'
    this.angle = Math.random() * Math.PI * 2
    this.width = 84
    this.height = 86
    this.speed = 1
  }
  addPoint({ x, y }) {
    this.path.push({ x, y })
  }
  update() {
    const { position, angle, speed } = this
    position.x += Math.cos(angle) * speed
    position.y += Math.sin(angle) * speed
    if (this.onEdge()) {
      this.angle += Math.PI
    }
  }
  draw() {
    const ctx = this.game.context
    const { x, y } = this.position
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(this.angle)
    ctx.drawImage(
      this.image,
      -this.width/2, -this.height/2, 
      this.width, this.height
    )
    ctx.restore()
  }
  onEdge() {
    const { canvas: { width, height } } = this.game
    const { x, y } = this.position
    return x < 0 || y < 0 || y > height || x > width
  }
}
