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

export default class Pointer {
  constructor(game) {
    this.game = game
    this.state = new HoverState(this)
  }
  update() {
    this.state.update()
  }
  draw() {
    this.state.draw()
  }
}