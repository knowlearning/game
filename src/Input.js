export default class Input {
  constructor(game) {
    this.keys = {}
    this.pointer = { x: 0, y: 0 }

    window.addEventListener('contextmenu', event => event.preventDefault())

    window.addEventListener('mousedown', event => {
      event.preventDefault()
      switch (event.which) {
        case 1:
          this.keys['mouseleft'] = true
          break
        case 2:
          this.keys['mousecenter'] = true
          break
        case 3:
          this.keys['mouseright'] = true
          event.preventDefault()
          break
      }
    }, false)

    window.addEventListener('mouseup', event => {
      event.preventDefault()
      switch (event.which) {
        case 1:
          delete this.keys['mouseleft']
          break
        case 2:
          delete this.keys['mousecenter']
          break
        case 3:
          delete this.keys['mouseright']
          break
      }
    }, false)

    window.addEventListener('mousemove', event => {
      event.preventDefault()
      const { canvas } = game.render
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      // TODO: consider clamping pointer to viewport boundaries
      this.pointer = {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      }
    }, false)

    window.addEventListener('keydown', event => {
      event.preventDefault()
      this.keys[event.key] = true
    }, false)

    window.addEventListener('keyup', event => {
      event.preventDefault()
      delete this.keys[event.key]
    }, false)
  }
}
