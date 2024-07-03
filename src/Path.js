import { distance } from './utils.js'
import Matter from 'matter-js'

const { Engine, Render, Runner, Bodies, Body, Composite } = Matter

export default class Path {
  constructor(game) {
    this.game = game
    this.path = []
    this.lineWidth = 5

    this.composite = Composite.create()
    Composite.add(game.engine.world, [this.composite])
    console.log('ADDING PATH!!!!!!!!')
    this.game.addObject(this)
  }
  addPoint({ x, y }) {
    this.path.push({ x, y })

    if (this.path.length > 1) {
      const [p1, p2] = this.path.slice(-2)
      const width = this.lineWidth
      const height = distance(p1, p2)
      const rotation = Math.atan2(p1.y-p2.y, p1.x-p2.x) + Math.PI/2
      const translation = { x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 }
      const body = Bodies.rectangle(0, 0, width, height, { isStatic: true })
      Composite.add(this.composite, body)
      Body.rotate(body, rotation, { x: 0, y: 0 })
      Body.translate(body, translation)
    }
  }
  update() {}
  draw() {
    const ctx = this.game.context
    ctx.beginPath()
    ctx.moveTo(this.path[0].x, this.path[0].y)
    this.path.forEach(({ x, y }) => ctx.lineTo(x, y) )
    ctx.stroke()
  }
}