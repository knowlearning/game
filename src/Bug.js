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
    this.startSpeed = Math.random() * 100 + 100
    this.velocity = {
      x: Math.cos(angle) * this.startSpeed,
      y: Math.sin(angle) * this.startSpeed
    }

    const { x, y } = position

    const rigidBodyDesc = Rapier.RigidBodyDesc.dynamic().setTranslation(x, y)
    this.rigidBody = game.physics.createRigidBody(rigidBodyDesc)

    const colliderDesc = (
      Rapier
        .ColliderDesc
        .ball(42)
        .setActiveEvents(Rapier.ActiveEvents.COLLISION_EVENTS)
        .setFriction(0)
        .setRestitution(1)
    )
    this.collider = game.physics.createCollider(colliderDesc, this.rigidBody)

    this.rigidBody.setLinvel(this.velocity, true)
  }
  update() {
    this.position = this.rigidBody.translation()
    this.velocity = this.rigidBody.linvel()
    clampVelocity(this.rigidBody, this.startSpeed)
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
    
  }

  dragStart(position) {
    this.rigidBody.setLinvel({ x: 0, y: 0}, true)
  }

  drag(delta) {
    console.log('DRAGGGING BUG!!!!!!!!!', delta)
  }

  dragEnd() {
    this.rigidBody.setLinvel({
      x: Math.cos(this.angle) * this.startSpeed,
      y: Math.sin(this.angle) * this.startSpeed
    })
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