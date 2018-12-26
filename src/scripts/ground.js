
const SPEED = 20

const Ground = function (el, game) {
    this.el = el
    this.game = game
    this.player = game.player
    this.pos = { x: 0, y: 0 }
}

Ground.prototype.onFrame = function (delta) {
    this.pos.x -= delta * SPEED

    if (this.pos.x <= -13.44) {
        this.pos.x = 0
    }

    // Update UI
    this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)')
}

export default Ground
