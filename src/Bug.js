export default class Bug {
  constructor(game, position) {
    this.game = game
    this.position = position
    this.image = new Image()
    this.image.src = '/ladybug.svg'
    this.angle = Math.random() * Math.PI * 2
    this.width = 84
    this.height = 86
    this.speed = Math.random() * 4 + 1
    this.hitbox = { x:0, y:0, r: 32 }
  }
  update() {
    const { position, angle, speed, hitbox } = this
    position.x += Math.cos(angle) * speed
    position.y += Math.sin(angle) * speed
    hitbox.x = position.x
    hitbox.y = position.y
    this.handleCollideEdge()
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
  collide(target, angle) {}
  handleCollideEdge() {
    //  TODO: handle collisions in a more composable way
    const { canvas: { width, height } } = this.game
    const { x, y } = this.position
    if (x < 0 || x > width) {
      this.angle = Math.PI - this.angle
    }
    if (y < 0 || y > height) {
      this.angle = - this.angle
    }
  }
}
