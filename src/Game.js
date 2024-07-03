import Input from './Input.js'
import Pointer from './Pointer.js'
import Bug from './Bug.js'
import Path from './Path.js'
import Matter from 'matter-js'

const { Engine, Render, Runner, Bodies, Composite } = Matter

function rigidBodyFromColliderHandle(world, handle) {
  return world.colliders.get(handle).parent().handle
}

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

    Render.run(this.render)
    this.runner = Runner.create()
    Runner.run(this.runner, this.engine)

   let lastTimestamp = 0
    const tick = timestamp => {
      const dt = timestamp - lastTimestamp
      if (dt > 0) this.fps = 1000 / dt
      lastTimestamp = timestamp

      requestAnimationFrame(tick)
      this.objects.forEach(object => {
        object.update()
        object.draw()
      })
    }
    tick()
  }

  objectFromColliderHandle(handle) {
    return this.physicsHandles.get(rigidBodyFromColliderHandle(this.physics, handle))
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

// Function to draw the collider
function drawCollider(collider, ctx) {
  const shape = collider.shape;

  ctx.save();
  ctx.beginPath();
  if (shape.type === 0) {
    const radius = shape.radius
    const position = collider.translation()
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI)
  } else if (shape.type === 1) {
    const halfExtents = shape.halfExtents
    const position = collider.translation()
    const rotation = collider.rotation()

    ctx.translate(position.x, position.y)
    ctx.rotate(rotation)
    ctx.rect(-halfExtents.x, -halfExtents.y, halfExtents.x * 2, halfExtents.y * 2)
  }
  else console.log('UNKNOWN SHAPE!', shape)
  // Add more shape types if needed

  ctx.stroke();
  ctx.restore();
}
