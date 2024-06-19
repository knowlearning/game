import Input from './Input.js'
import Pen from './Pen.js'
import Bug from './Bug.js'
import Line from './Line.js'
import Rapier from '@dimforge/rapier2d-compat'

export default class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    const { width, height } = canvas
    this.objects = []
    this.input = new Input(this)
    this.pyhsicsHandles = new Map()
  }

  async initialize() {
    let lastTimestamp = 0

    await Rapier.init()

    const gravity = { x: 0, y: 0 }
    this.physics = new Rapier.World(gravity)
    this.physicsEventQueue = new Rapier.EventQueue(true)

    const topLeft = { x: 0, y: 0 }
    const topRight = { x: this.canvas.width, y: 0 }
    const bottomLeft = { x: 0, y: this.canvas.height }
    const bottomRight = { x: this.canvas.width, y: this.canvas.height }

    this.addObject(new Line(this, topLeft, topRight))
    //  TODO: investigate why the first added line does not trigger collisions...
    this.addObject(new Line(this, topLeft, topRight))
    this.addObject(new Line(this, topRight, bottomRight))
    this.addObject(new Line(this, topLeft, bottomLeft))
    this.addObject(new Line(this, bottomLeft, bottomRight))
    this.addObject(new Bug(this, this.randomPosition()))
    this.addObject(new Pen(this))

    const animate = timestamp => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const dt = timestamp - lastTimestamp
      this.fps = 1000 / dt
      lastTimestamp = timestamp

      this.physics.step(this.physicsEventQueue)
      this.physicsEventQueue.drainContactForceEvents(event => {
        let handle1 = event.collider1()
        let handle2 = event.collider2()
      })
      this.physicsEventQueue.drainCollisionEvents((handle1, handle2, started) => {
        const o1 = this.pyhsicsHandles.get(handle1)
        const o2 = this.pyhsicsHandles.get(handle2)
        if (o1.collide) o1.collide(o2, started)
        if (o2.collide) o2.collide(o1, started)
      })
      this.objects.forEach(object => object.update(dt))
      this.objects.forEach(object => object.draw())

      this.physics.forEachCollider(
        collider => drawCollider(collider, this.context)
      )

      requestAnimationFrame(animate)
    }
    animate(0)
  }

  addObject(object) {
    if (object.physicsHandle) {
      this.pyhsicsHandles.set(object.physicsHandle, object)
    }
    this.objects.push(object)
  }

  randomPosition() {
    return {
      x: Math.floor(Math.random() * this.canvas.width),
      y: Math.floor(Math.random() * this.canvas.height)
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
    ctx.rect(position.x - halfExtents.x, position.y - halfExtents.y, halfExtents.x * 2, halfExtents.y * 2)
  }
  else console.log('UNKNOWN SHAPE!', shape)
  // Add more shape types if needed

  ctx.stroke();
  ctx.restore();
}