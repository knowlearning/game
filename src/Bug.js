import { distance } from './utils.js'
import { Composite, Bodies } from 'matter-js'

class WalkingState {
  constructor(bug) {
    console.log('WALKING!')
    this.bug = bug
    this.maxSpeed = Math.random() * 10 + 5
    this.acceleration = 1
    this.bug.speed = 0
  }
  update() {
    if (this.bug.speed < this.maxSpeed) {
      this.bug.speed += this.acceleration
    }
  }
  draw() {}
}

class TurnState {
  constructor(bug) {
    console.log('NEW TURN!')
    this.bug = bug
    this.bug.speed = 0
    this.turnTime = Math.random() * 1000
    this.direction = Math.random() > 0.5 ? -1 : 1
    this.timeElapsed = 0
  }
  update(dt) {
    this.timeElapsed += dt
    this.bug.angle += Math.PI/60 * this.direction
    if (this.timeElapsed >= this.turnTime) this.bug.state = new WalkingState(this.bug)
  }
  draw() {}
}

class DraggingState {
  constructor(bug) {
    this.bug = bug
    const { x, y } = bug.game.input.pointer
    this.offset = {
      x: x - this.bug.position.x,
      y: y - this.bug.position.y
    }
  }
  update() {
    const { x, y } = this.bug.game.input.pointer
    this.bug.position = {
      x: x - this.offset.x,
      y: y - this.offset.y
    }
  }
  draw() {}
}

export default class Bug {
  constructor(game, position) {
    this.game = game
    this.position = position
    this.image = new Image()
    this.image.src = '/ladybug.svg'
    this.width = 84
    this.height = 86
    this.radius = 42

    this.speed = 0
    this.angle = Math.PI * 2 * Math.random()

    this.composite = Composite.create()
    Composite.add(game.engine.world, [this.composite])

    this.body = Bodies.circle(0, 0, this.radius,  { restitution: 0, density: 0.001 })
    Composite.add(this.composite, this.body)
    Composite.translate(this.composite, position)

    this.state = new WalkingState(this)
    this.collisions = new Map()

    this.game.addObject(this)

  }
  update(dt) {
    this.state.update(dt)
    const { position, speed, angle } = this
    Composite.translate(this.composite, {
      x: speed * Math.cos(angle),
      y: speed * Math.sin(angle)
    })
  }
  draw() {
    const ctx = this.game.context
    const { x, y } = this.body.position
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(this.angle)
    ctx.drawImage(
      this.image,
      -this.width/2, -this.height/2, 
      this.width, this.height
    )
    ctx.restore()
  }
  collide(otherObject, collisions) {
    console.log(collisions.length)
    if (!(this.state instanceof DraggingState) &&  !(this.state instanceof TurnState) && collisions.length) {
        this.state = new TurnState(this)
    }
  }

  dragStart(position) {
    this.state = new DraggingState(this)
  }
  drag(delta) {}
  dragEnd() {
    this.state = new WalkingState(this)
  }
}
