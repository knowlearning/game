import Rapier from '@dimforge/rapier2d-compat'

export default class Bug {
  constructor(game, position) {
    this.game = game
    this.position = position
    this.image = new Image()
    this.image.src = '/ladybug.svg'
    this.width = 84
    this.height = 86

    this.speed = Math.random() * 10 + 10
    this.angle = Math.PI * 2 * Math.random()

    const { x, y } = position

    const rigidBodyDesc = Rapier.RigidBodyDesc.kinematicPositionBased().setTranslation(x, y)
    this.rigidBody = game.physics.createRigidBody(rigidBodyDesc)

    const colliderDesc = (
      Rapier
        .ColliderDesc
        .ball(42)
        .setActiveEvents(Rapier.ActiveEvents.COLLISION_EVENTS)
        .setActiveCollisionTypes(Rapier.ActiveCollisionTypes.ALL)
        .setFriction(0)
        .setRestitution(1)
    )
    this.collider = game.physics.createCollider(colliderDesc, this.rigidBody)
  }
  update() {
    this.position.x += this.speed * Math.cos(this.angle)
    this.position.y += this.speed * Math.sin(this.angle)
    this.rigidBody.setNextKinematicTranslation(this.position)
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
  collide(object, started) {
    console.log('BUG COLLIDED WITH', object, started)
    this.speed = 0
  }

  dragStart(position) {
  }

  drag(delta) {
    console.log('DRAGGGING BUG!!!!!!!!!', delta)
  }

  dragEnd() {
  }
}

function clampVelocity(body, maxSpeed) {
  const velocity = body.linvel()
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)

  if (speed > maxSpeed) {
    const scale = maxSpeed / speed
    const targetVelocity = { x: velocity.x * scale, y: velocity.y * scale }
    const impulse = {
      x: (targetVelocity.x - velocity.x) * body.mass(),
      y: (targetVelocity.y - velocity.y) * body.mass()
    }

    body.applyImpulse(impulse, true)
  }
}