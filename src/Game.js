import Input from './Input.js'
import Pointer from './Pointer.js'
import Bug from './Bug.js'
import Path from './Path.js'
import { Engine, Render, Runner, Bodies, Composite, Events, Body } from 'matter-js'

export default class Game {
  constructor(element) {
    this.objects = []
    this.input = new Input(this)
    this.fps = 0
    this.engine = Engine.create()
    this.render = Render.create({
      element,
      engine: this.engine,
      options: {
        width: 800,
        height: 600
      }
    })
    this.context = this.render.canvas.getContext('2d')
    this.engine.world.gravity.y = 0
    this.engine.world.gravity.x = 0

    const { bounds: { max, min } } = this.render

    this.border = new Path(this)
    this.border.addPoint(min)
    this.border.addPoint({ x: max.x, y: min.y })
    this.border.addPoint(max)
    this.border.addPoint({ x: min.y, y: max.y })
    this.border.addPoint(min)
    this.pointer = new Pointer(this)

    new Bug(this, this.randomPosition())
    new Bug(this, this.randomPosition())
    new Bug(this, this.randomPosition())
    new Bug(this, this.randomPosition())
    new Bug(this, this.randomPosition())
    new Bug(this, this.randomPosition())

    Render.run(this.render)
    this.runner = Runner.create()
    Runner.run(this.runner, this.engine)

    Events.on(this.engine, 'collisionStart', function(event) {
      var pairs = event.pairs

      pairs.forEach(function(pair) {
        const { bodyA, bodyB } = pair

        var overlap = pair.collision.penetration

        const negOverlap = {
            x: -overlap.x,
            y: -overlap.y
        }

        if (bodyA.collide) bodyA.collide(bodyB, { overlap })
        if (bodyB.collide) bodyB.collide(bodyA, { overlap: negOverlap})
      })
    })

    Events.on(this.engine, 'collisionEnd', function(event) {
      var pairs = event.pairs

      pairs.forEach(function(pair) {
        const { bodyA, bodyB } = pair

        if (bodyA.leave) bodyA.leave(bodyB)
        if (bodyB.leave) bodyB.leave(bodyA)
      })
    })

    let lastTimestamp = 0
    const tick = timestamp => {
      const dt = timestamp - lastTimestamp
      if (dt > 0) this.fps = 1000 / dt
      lastTimestamp = timestamp

      requestAnimationFrame(tick)
      this.objects.forEach(object => {
        object.update(dt)
        object.draw(dt)
      })
    }
    tick(0)
  }

  addObject(object) {
    this.objects.push(object)
  }

  randomPosition() {
    return {
      x: Math.floor(Math.random() * this.render.canvas.width),
      y: Math.floor(Math.random() * this.render.canvas.height)
    }
  }
}
