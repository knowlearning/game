export default class Input {
  constructor(game) {
    this.keys = {}
    this.pointer = { x: 0, y: 0 }

    game.canvas.addEventListener('contextmenu', event => event.preventDefault())

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
      const { top, left, width, height } = game.canvas.getBoundingClientRect()
      this.pointer = {
        x: Math.max(0, Math.min(width, event.x - left)),
        y: Math.max(0, Math.min(height, event.y - top))
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
