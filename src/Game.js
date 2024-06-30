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
    this.objectCollisions = new Map()
    this.collisionManifolds = new Map()
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
    this.addObject(new Bug(this, this.randomPosition()))
    this.addObject(new Bug(this, this.randomPosition()))
    this.addObject(new Pointer(this))

    const animate = timestamp => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const dt = timestamp - lastTimestamp
      if (dt > 0) this.fps = 1000 / dt
      lastTimestamp = timestamp

      const objectsWithCollisionEvents = new Set()
      const doneCollisions = new Map()

      this.physics.step(this.physicsEventQueue)
      this.physicsEventQueue.drainCollisionEvents((colliderHandle1, colliderHandle2, started) => {
        const o1 = this.objectFromColliderHandle(colliderHandle1)
        const o2 = this.objectFromColliderHandle(colliderHandle2)

        if (o1.collide) objectsWithCollisionEvents.add(o1)
        if (o2.collide) objectsWithCollisionEvents.add(o2)

        const collisionId = [colliderHandle1, colliderHandle2].sort().join('-')

        if (started) {
          this.objectCollisions.get(o1).add(collisionId)
          this.objectCollisions.get(o2).add(collisionId)
          doneCollisions.delete(o1)
          doneCollisions.delete(o2)
        }
        else {
          this.objectCollisions.get(o1).delete(collisionId)
          this.objectCollisions.get(o2).delete(collisionId)
          if (this.objectCollisions.get(o1).size === 0) doneCollisions.set(o1, o2)
          if (this.objectCollisions.get(o2).size === 0) doneCollisions.set(o2, o1)
        }

        this
          .collisionManifolds
          .set(collisionId, { colliderHandle1, colliderHandle2, o1, o2 })

      })
      objectsWithCollisionEvents
        .forEach(object => {
          const otherObjectToManifolds = new Map()
          this
            .objectCollisions
            .get(object)
            .forEach(collisionId => {
              const { o1, o2, colliderHandle1, colliderHandle2 } = this.collisionManifolds.get(collisionId)
              this
                .physics
                .contactPair(
                  this.physics.colliders.get(colliderHandle1),
                  this.physics.colliders.get(colliderHandle2),
                  (manifold, flipped) => {
                    //  TODO: deal with complexities for "flipped" info
                    const originalNormal = manifold.normal()
                    const distance = manifold.contactDist()
                    const otherObject = o1 === object ? o2 : o1
                    const normal = {
                      x: o1 === object ? originalNormal.x : -originalNormal.x,
                      y: o1 === object ? originalNormal.y : -originalNormal.y
                    }
                    const manifolds = otherObjectToManifolds.get(otherObject) || []
                    manifolds.push({ normal, distance })
                    otherObjectToManifolds.set(otherObject, manifolds)
                  }
                )
            })
          otherObjectToManifolds
            .forEach((manifolds, otherObject) => {
              object.collide(otherObject, manifolds)
            })
        })

      doneCollisions.forEach((o1, o2) => o1.collide && o1.collide(o2, []))

      this.objects.forEach(object => object.update(dt))
      this.objects.forEach(object => object.draw())

      this.physics.forEachCollider(c => drawCollider(c, this.context))

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
    this.objectCollisions.set(object, new Set())
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
