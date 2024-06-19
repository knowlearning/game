import Rapier from '@dimforge/rapier2d-compat'

export default class Bug {
  constructor(game, position) {
    this.game = game
    this.position = position
    this.image = new Image()
    this.image.src = '/ladybug.svg'
    this.width = 84
    this.height = 86

    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 100 + 400
    this.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    }

    const { x, y } = position

    const rigidBodyDesc = Rapier.RigidBodyDesc.dynamic().setTranslation(x, y)
    this.rigidBody = game.physics.createRigidBody(rigidBodyDesc)

    const colliderDesc = (
      Rapier
        .ColliderDesc
        .ball(42)
        .setActiveEvents(Rapier.ActiveEvents.COLLISION_EVENTS)
        .setRestitution(1)
    )
    this.collider = game.physics.createCollider(colliderDesc, this.rigidBody)

    this.rigidBody.setLinvel(this.velocity, true)

    this.physicsHandle = this.rigidBody.handle
  }
  update() {
    this.position = this.rigidBody.translation()
    this.velocity = this.rigidBody.linvel()
  }
  draw() {
    const ctx = this.game.context
    const { x, y } = this.position
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(Math.atan2(this.velocity.y, this.velocity.x))
    ctx.drawImage(
      this.image,
      -this.width/2, -this.height/2, 
      this.width, this.height
    )
    ctx.restore()
  }
  collide(object, started) {
    console.log('BUG COLLIDED WITH OBJECT!', object, started)
  }
}
