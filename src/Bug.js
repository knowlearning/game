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
  collide(target, angle) {
    this.angle += Math.PI
  }
}
