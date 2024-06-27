import Rapier from '@dimforge/rapier2d-compat'

class WalkingState {
  constructor(bug) {
    this.bug = bug
    this.bug.speed = Math.random() * 10 + 10
  }
  update() {
    const { position, speed, angle } = this.bug
    position.x += speed * Math.cos(angle)
    position.y += speed * Math.sin(angle)
  }
  draw() {}
}

class ResolveCollisionState {
  constructor(bug) {
    this.bug = bug
    this.bug.speed = 0
  }
  update() {
    if (this.bug.collisions.size) {
      //  TODO: calculate correction direction to nudge the bug towards...
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
    this.collisions = new Set()
  }
  update() {
    this.state.update()
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
    if (started) {
      this.collisions.add(object)
      if (!(this.state instanceof DraggingState)) {
        this.state = new ResolveCollisionState(this)
      }
    }
    else this.collisions.delete(object)
  }

  dragStart(position) {
    this.state = new DraggingState(this)
  }

  drag(delta) {}

  dragEnd() {
    this.state = new WalkingState(this)
  }
}
