import Input from './Input.js'
import Pen from './Pen.js'
import Bug from './Bug.js'
import Line from './Line.js'
import collisions from './collisions.js'

export default class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    const { width, height } = canvas
    const p00 = { x: 0, y: 0 }
    const p10 = { x: width, y: 0 }
    const p01 = { x: 0, y: height }
    const p11 = { x: width, y: height }
    this.objects = [
      new Line(this, p00, p10), // top edge
      new Line(this, p01, p11), // bottom edge
      new Line(this, p00, p01), // left edge
      new Line(this, p10, p11), // right edge
      new Pen(this),
      new Bug(this, this.randomPosition()),
    ]
    this.input = new Input(this)
  }

  initialize() {
    let lastTimestamp = 0

    const animate = timestamp => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const dt = timestamp - lastTimestamp
      this.fps = 1000 / dt
      lastTimestamp = timestamp

      this.objects.forEach(object => object.update(dt))
      this.objects.forEach((obj1, i) => {
        for (let j=i+1; j<this.objects.length; j++) {
          const obj2 = this.objects[j]
          const collision = this.collide(obj1, obj2)
          if (collision) {
            obj1.collide({...collision, target: obj2})
            obj2.collide({...collision, target: obj1})
          }
        }
      })
      this.objects.forEach(object => object.draw())

      requestAnimationFrame(animate)
    }
    animate(0)
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
