import Input from './Input.js'
import Pointer from './Pointer.js'
import Bug from './Bug.js'
import Path from './Path.js'
import Rapier from '@dimforge/rapier2d-compat'

function rigidBodyFromColliderHandle(world, handle) {
  return world.colliders.get(handle).parent().handle
}

export default class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    const { width, height } = canvas
    this.objects = []
    this.input = new Input(this)
    this.physicsHandles = new Map()
    this.fps = 0
  }

  async initialize() {
    let lastTimestamp = 0

    await Rapier.init()

    const gravity = { x: 0, y: 0 }
    this.physics = new Rapier.World(gravity)
    this.physicsEventQueue = new Rapier.EventQueue(true)

    const border = new Path(this)
    border.addPoint({ x: 0, y: 0 })
    border.addPoint({ x: this.canvas.width, y: 0 })
    border.addPoint({ x: this.canvas.width, y: this.canvas.height })
    border.addPoint({ x: 0, y: this.canvas.height })
    border.addPoint({ x: 0, y: 0 })

    this.addObject(border)
    this.addObject(new Bug(this, this.randomPosition()))
    this.addObject(new Bug(this, this.randomPosition()))
    this.addObject(new Bug(this, this.randomPosition()))
    this.addObject(new Bug(this, this.randomPosition()))
    this.addObject(new Bug(this, this.randomPosition()))
    this.addObject(new Bug(this, this.randomPosition()))
    this.addObject(new Pointer(this))

    const animate = timestamp => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const dt = timestamp - lastTimestamp
      if (dt > 0) this.fps = 1000 / dt
      lastTimestamp = timestamp

      this.physics.step(this.physicsEventQueue)
      this.physicsEventQueue.drainContactForceEvents(event => {
        let handle1 = event.collider1()
        let handle2 = event.collider2()
      })
      this.physicsEventQueue.drainCollisionEvents((colliderHandle1, colliderHandle2, started) => {
        const o1 = objectFromColliderHandle(colliderHandle1)
        const o2 = objectFromColliderHandle(colliderHandle2)
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

  objectFromColliderHandle(handle) {
    return this.physicsHandles.get(rigidBodyFromColliderHandle(this.physics, handle))
  }

  addObject(object) {
    if (object.rigidBody) {
      this.physicsHandles.set(object.rigidBody.handle, object)
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