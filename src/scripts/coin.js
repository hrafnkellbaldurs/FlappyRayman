import $ from 'jquery'
import Controls from './controls'

// All these constants are in em's, multiply by 10 pixels
// for 640x420px canvas.
const posArr = [0, 5, 10, 15, 20, 25, 30, 35, 40]

let SPEED = 25// * 10 pixels per second
const WIDTH = 16
const INITIAL_POSITION_X = 51
const INITIAL_POSITION_Y = posArr[Math.floor(Math.random() * posArr.length)]

const Coin = function (el, game) {
    this.el = el
    this.game = game
    this.player = game.player
    this.pos = { x: 0, y: 0 }
}

/*
 * Resets the state of the Coin for a new game.
 */
Coin.prototype.reset = function () {
    this.pos.x = INITIAL_POSITION_X
    this.pos.y = INITIAL_POSITION_Y
    SPEED = 25
}

Coin.prototype.onFrame = function (delta, hasStarted) {
    if (hasStarted) {
        this.pos.x -= delta * SPEED
        SPEED += 0.000625
    }

    // Checks if the element has passed the left side of the game screen compconstely and respawns it on the right
    // side with a random y position from posArr
    if (this.pos.x < -WIDTH) {
        const newY = posArr[Math.floor(Math.random() * posArr.length)]
        this.pos.y = newY
        this.pos.x = INITIAL_POSITION_X
    }
    this.updateScore()

    // Update UI
    this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)')
}

// Player collects coin by crashing it... and poof u got point and
// coin disappears
Coin.prototype.updateScore = function () {
    const difx = Math.abs(this.player.pos.x - this.pos.x)
    const dify = Math.abs(this.player.pos.y - this.pos.y)
    if (difx < 4 && dify < 4) {
        // only play coin if sound is not muted
        if (!Controls.getSoundMuted()) {
            $('#Coin').trigger('play')
        }
        this.player.score++
        $('.Score').html(this.player.score)
        const newY = posArr[Math.floor(Math.random() * posArr.length)]
        this.pos.y = newY
        this.pos.x = INITIAL_POSITION_X
    }
}

export default Coin
