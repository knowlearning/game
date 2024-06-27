import Rapier from '@dimforge/rapier2d-compat'
import { distance } from './utils.js'

export default class Path {
  constructor(game) {
    this.game = game
    this.path = []
    this.lineWidth = 5

    const rigidBodyDesc = Rapier.RigidBodyDesc.fixed().setTranslation(0, 0)
    this.rigidBody = game.physics.createRigidBody(rigidBodyDesc)
  }
  addPoint({ x, y }) {
    this.path.push({ x, y })

    if (this.path.length > 1) {
      const [p1, p2] = this.path.slice(-2)
      const width = this.lineWidth
      const height = distance(p1, p2)
      const colliderDesc = (
        Rapier
          .ColliderDesc
          .cuboid(width/2, height/2)
          .setFriction(0)
          .setRestitution(1)
          .setRotation(Math.atan2(p1.y-p2.y, p1.x-p2.x) + Math.PI/2)
          .setTranslation((p1.x + p2.x)/2, (p1.y + p2.y)/2)
          .setActiveCollisionTypes(Rapier.ActiveCollisionTypes.ALL)
      )
      this.collider = this.game.physics.createCollider(colliderDesc, this.rigidBody)
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