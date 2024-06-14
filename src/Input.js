export default class Input {
  constructor(game) {
    this.keys = {}
    this.pointer = { x: 0, y: 0 }

    game.canvas.addEventListener('contextmenu', event => event.preventDefault())

    game.canvas.addEventListener('mousedown', event => {
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

    game.canvas.addEventListener('mouseup', event => {
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

    game.canvas.addEventListener('mousemove', event => {
      const { top, left } = game.canvas.getBoundingClientRect()
      const { pointer } = this
      pointer.x = event.x - left
      pointer.y = event.y - top
    }, false)

    window.addEventListener('keydown', event => {
        this.keys[event.key] = true
    }, false)

    window.addEventListener('keyup', event => {
        delete this.keys[event.key]
    }, false)
  }
}
