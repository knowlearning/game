import Rapier from '@dimforge/rapier2d-compat'

class WalkingState {
  constructor(bug) {
    this.bug = bug
    this.maxSpeed = Math.random() * 10 + 5
    this.acceleration = 1
    this.bug.speed = 0
  }
  update() {
    if (this.bug.speed < this.maxSpeed) {
      this.bug.speed += this.acceleration
    }
    const { position, speed, angle } = this.bug
    position.x += speed * Math.cos(angle)
    position.y += speed * Math.sin(angle)
  }
  draw() {}
}

class TurnState {
  constructor(bug) {
    this.bug = bug
    this.bug.speed = Math.random() * 10 + 10
    this.turnTime = Math.random() * 1000
    this.direction = Math.random() > 0.5 ? -1 : 1
    this.timeElapsed = 0
  }
  update(dt) {
    this.timeElapsed += dt
    this.bug.angle += Math.PI/60 * this.direction
    if (this.timeElapsed >= this.turnTime) {
      this.bug.state = new WalkingState(this.bug)
    }
  }
  draw() {}
}

class DraggingState {
  constructor(bug) {
    this.bug = bug
    const { x, y } = bug.game.input.pointer
    this.offset = {
      x: x - this.bug.position.x,
      y: y - this.bug.position.y
    }
  }
  update() {
    const { x, y } = this.bug.game.input.pointer
    this.bug.position = {
      x: x - this.offset.x,
      y: y - this.offset.y
    }
  }
  draw() {}
}

export default class Bug {
  constructor(game, position) {
    this.game = game
    this.position = position
    this.image = new Image()
    this.image.src = '/ladybug.svg'
    this.width = 84
    this.height = 86
    this.collisions = []

    this.speed = 0
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
    )
    this.collider = game.physics.createCollider(colliderDesc, this.rigidBody)

    this.state = new WalkingState(this)
    this.collisions = new Map()
  }
  update(dt) {
    this.state.update(dt)
    if (this.collisions.length && !(this.state instanceof DraggingState)) {
      console.log(this.collisions.length)
      this
        .collisions
        .forEach(({ normal, distance }) => {
          this.position.x += normal.x * distance
          this.position.y += normal.y * distance
        })
      if (!(this.state instanceof TurnState)) this.state = new TurnState(this)
    }
    const r = 42
    this.position.x = Math.max(r, Math.min(this.game.canvas.width-r, this.position.x))
    this.position.y = Math.max(r, Math.min(this.game.canvas.height-r, this.position.y))
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
  collide(object, collisions) {
    this.collisions = collisions
  }

  dragStart(position) {
    this.state = new DraggingState(this)
  }
  drag(delta) {}
  dragEnd() {
    this.state = new WalkingState(this)
  }
}
