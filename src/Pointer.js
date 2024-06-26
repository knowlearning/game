import Rapier from '@dimforge/rapier2d-compat'
import Path from './Path.js'

class HoverState {
  constructor(pointer) {
    this.pointer = pointer
  }
  update() {
    if (this.pointer.game.input.keys.mouseleft) {
      this.pointer.state = new DrawState(this.pointer)
    }
  }
  draw() {
    const { x, y } = this.pointer.game.input.pointer
    const ctx = this.pointer.game.context
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fill()
  }
}

class DrawState {
  constructor(pointer) {
    this.pointer = pointer
    this.path = new Path(this.pointer.game)
    this.pointer.game.addObject(this.path)
    this.path.addPoint(this.pointer.game.input.pointer)
  }
  update() {
    if (!this.pointer.game.input.keys.mouseleft) {
      this.pointer.state = new HoverState(this.pointer)
    }
    else {
      this.path.addPoint(this.pointer.game.input.pointer)
    }
  }
  draw() {
  }
}

class DragState {
  constructor(pointer, object) {
    this.pointer = pointer
    this.object = object
  }
  update() {
    if (!this.pointer.game.input.keys.mouseleft) {
      this.pointer.state = new HoverState(this.pointer)
    }
    else {
      this.object.drag()
    }
  }
  draw() {
    const { x, y } = this.pointer.game.input.pointer
    const ctx = this.pointer.game.context
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fill()
  }
}

export default class Pointer {
  constructor(game) {
    this.game = game
    this.state = new HoverState(this)

    const rigidBodyDesc = Rapier.RigidBodyDesc.dynamic().setTranslation(0, 0)
    this.rigidBody = game.physics.createRigidBody(rigidBodyDesc)

    const colliderDesc = (
      Rapier
        .ColliderDesc
        .ball(1)
        .setActiveEvents(Rapier.ActiveEvents.COLLISION_EVENTS)
        .setFriction(0)
        .setRestitution(1)
    )
    this.collider = game.physics.createCollider(colliderDesc, this.rigidBody)
  }
  update() {
    if (this.game.input.keys.mouseleft && !(this.state instanceof DrawState)) {
      const projection = this.game.physics.projectPoint(this.game.input.pointer, true)
      if (projection?.collider?.handle) {
        const obj = this.game.objectFromColliderHandle(projection.collider.handle)
        if (obj.drag) {
          this.state = new DragState(this, obj)
        }
      }
    }
    //this.rigidBody.setTranslation(x, y)
    this.state.update()
  }
  draw() {
    this.state.draw()
  }
}