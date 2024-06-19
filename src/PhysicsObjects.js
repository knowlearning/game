export function createLinePhysicsObject(p1, p2) {
  const rigidBodyDesc = Rapier.RigidBodyDesc.fixed().setTranslation((p1.x + p2.x)/2, (p1.y + p2.y)/2)
  const colliderDesc = (
    Rapier
      .ColliderDesc
      .cuboid(Math.abs(p1.x - p2.x)/2 + this.lineWidth/2, Math.abs(p1.y - p2.y)/2 + this.lineWidth/2)
      .setActiveCollisionTypes(Rapier.ActiveCollisionTypes.ALL)
  )

  this.rigidBody = game.physics.createRigidBody(rigidBodyDesc)
  this.collider = game.physics.createCollider(colliderDesc, this.rigidBody)
}