import Rapier from '@dimforge/rapier2d-compat'

class WalkingState {
  constructor(bug) {
    this.bug = bug
    this.bug.speed = Math.random() * 10 + 5
  }
  update() {
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
    this.turnTime = Math.random() * 2000
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
  update(dt) {
    if (!(this.state instanceof DraggingState)) {
      if (this.collisions.size) {
        const { rigidBody } = this
        let totalOffsetX = 0
        let totalOffsetY = 0
        this.game.physics.contactPairsWith(rigidBody.collider(0), collider => {
          this.game.physics.contactPair(rigidBody.collider(0), collider, (manifold, flipped) => {
            const normal = manifold.normal()
            const maxOffset = 10
            let distance = manifold.contactDist()
            const offsetX = normal.x * distance/2 * (flipped ? -1 : 1)
            const offsetY = normal.y * distance/2 * (flipped ? -1 : 1)
            this.position.x += offsetX
            this.position.y += offsetY

            totalOffsetX += offsetX
            totalOffsetY += offsetY
          })
        })
        if (totalOffsetX + totalOffsetY > 1 && !(this.state instanceof TurnState)) this.state = new TurnState(this)
      }
    }
    this.state.update(dt)
    this.rigidBody.setNextKinematicTranslation(this.position)
    this.position.x = Math.max(0, Math.min(this.game.canvas.width, this.position.x))
    this.position.y = Math.max(0, Math.min(this.game.canvas.height, this.position.y))
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
      this.state = new TurnState(this)
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
