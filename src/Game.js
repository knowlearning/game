import Input from './Input.js'
import Pen from './Pen.js'
import Bug from './Bug.js'
import Line from './Line.js'
import collisions from './collisions.js'
import Rapier from '@dimforge/rapier2d-compat'

export default class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    const { width, height } = canvas
    this.objects = []
    this.input = new Input(this)
  }

  async initialize() {
    let lastTimestamp = 0

    await Rapier.init()

    const gravity = { x: 0, y: 0 }
    this.physics = new Rapier.World(gravity)

    const topLeft = { x: 0, y: 0 }
    const topRight = { x: this.canvas.width, y: 0 }
    const bottomLeft = { x: 0, y: this.canvas.height }
    const bottomRight = { x: this.canvas.width, y: this.canvas.height }

    this.addObject(new Line(this, topLeft, topRight))
    this.addObject(new Line(this, topRight, bottomRight))
    this.addObject(new Line(this, topLeft, bottomLeft))
    this.addObject(new Line(this, bottomLeft, bottomRight))
    this.addObject(new Pen(this))
    this.addObject(new Bug(this, this.randomPosition()))

    const animate = timestamp => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const dt = timestamp - lastTimestamp
      this.fps = 1000 / dt
      lastTimestamp = timestamp

      this.physics.step()
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
    this.objects.push(object)
  }

  randomPosition() {
    return {
      x: Math.floor(Math.random() * this.canvas.width),
      y: Math.floor(Math.random() * this.canvas.height)
    }
  }

  collide(obj1, obj2) {
    if (!obj1.hitbox || !obj2.hitbox) return

    const t1 = obj1.hitbox.r ? 'Circle' : 'Line'
    const t2 = obj2.hitbox.r ? 'Circle' : 'Line'
    const collisionType = [t1, t2].join('')

    return collisions[collisionType](obj1.hitbox, obj2.hitbox)
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