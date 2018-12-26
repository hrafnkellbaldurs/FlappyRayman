const SPEED = 5

const Cloud = function (el, game) {
    this.el = el
    this.game = game
    this.player = game.player
    this.pos = { x: 0, y: 0 }
}

Cloud.prototype.onFrame = function (delta) {
    this.pos.x -= delta * SPEED

    if (this.pos.x <= -30) {
        this.pos.x = 0
    }

    // Checks if the element has passed the left side of the game screen completely and respawns it on the right
    // side with a random y position from posArr

    // Update UI
    this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)')
}

export default Cloud
