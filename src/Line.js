import Rapier from '@dimforge/rapier2d-compat'

export default class Line {
  constructor(game, p1, p2) {
    this.game = game
    this.p1 = p1
    this.p2 = p2
    this.lineWidth = 4

    const rigidBodyDesc = Rapier.RigidBodyDesc.fixed().setTranslation((p1.x + p2.x)/2, (p1.y + p2.y)/2)
    this.rigidBody = game.physics.createRigidBody(rigidBodyDesc)
    const colliderDesc = (
      Rapier
        .ColliderDesc
        .cuboid(Math.abs(p1.x - p2.x)/2 + this.lineWidth/2, Math.abs(p1.y - p2.y)/2 + this.lineWidth/2)
        .setActiveCollisionTypes(Rapier.ActiveCollisionTypes.ALL)
    )
    this.collider = game.physics.createCollider(colliderDesc, this.rigidBody)

    this.physicsHandle = this.rigidBody.handle
  }
  update() {}
  draw() {
    const ctx = this.game.context
    ctx.beginPath()
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.lineTo(this.p2.x, this.p2.y)
    ctx.stroke()
  }
}