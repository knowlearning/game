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
    this.start = { ...this.pointer.game.input.pointer }
    this.last = { ...this.pointer.game.input.pointer }
  }
  update() {
    if (!this.pointer.game.input.keys.mouseleft) {
      this.object.dragEnd()
      this.pointer.state = new HoverState(this.pointer)
    }
    else {
      const { x, y } = this.pointer.game.input.pointer
      const dx = this.last.x - x
      const dy = this.last.y - y
      if (dx || dy) {
        this.object.drag({ x: dx, y: dy })
        this.last = { x, y }
      }
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
  }
  update() {
    if (this.game.input.keys.mouseleft && this.state instanceof HoverState) {
      const projection = this.game.physics.projectPoint(this.game.input.pointer, true)
      if (projection?.collider && projection.isInside) {
        const obj = this.game.objectFromColliderHandle(projection.collider.handle)
        if (obj.dragStart) {
          console.log(projection.collider.handle, obj)
          obj.dragStart(this.game.input.pointer)
          this.state = new DragState(this, obj)
        }
      }
    }
    this.state.update()
  }
  draw() {
    this.state.draw()
  }
}