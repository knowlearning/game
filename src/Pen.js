import Path from './Path.js'

class HoverState {
  constructor(pen) {
    this.pen = pen
  }
  update() {
    if (this.pen.game.input.keys.mouseleft) {
      this.pen.state = new DrawState(this.pen)
    }
  }
  draw() {
    const { x, y } = this.pen.game.input.pointer
    const ctx = this.pen.game.context
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fill()
  }
}

class DrawState {
  constructor(pen) {
    this.pen = pen
    this.path = new Path(this.pen.game)
    this.pen.game.objects.push(this.path)
    this.path.addPoint(this.pen.game.input.pointer)
  }
  update() {
    if (!this.pen.game.input.keys.mouseleft) {
      this.pen.state = new HoverState(this.pen)
    }
    else {
      this.path.addPoint(this.pen.game.input.pointer)
    }
  }
  draw() {
  }
}

export default class Pen {
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