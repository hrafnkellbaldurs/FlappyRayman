import $ from 'jquery'
import Controls from './controls'

// All these constants are in em's, multiply by 10 pixels
// for canvas.
const WIDTH = 5
const HEIGHT = 5
const JUMPSPEED = 65
const GRAVITY = 250
const flap = document.getElementById('Flap')
let VERTSPEED = 0
let op = '+'
flap.volume = 0.1

const Player = function (el, game) {
    this.el = el
    this.game = game
    this.pos = { x: this.game.WORLD_WIDTH / 2 - 8, y: this.game.WORLD_HEIGHT / 2 + 3 }
    this.score = 0
    // Contains number of jump events registered since the key was first pressed
    this.lastFrameKeyPressed = false
    this.yb4 = this.pos.y
    this.continuousJump = false

    this.rotate = 15
}

/**
    * Resets the state of the player for a new game.
    */
Player.prototype.reset = function (game) {
    this.pos.x = game.WORLD_WIDTH / 2 - 8
    this.pos.y = game.WORLD_HEIGHT / 2 + 3
    this.score = 0
    this.rotate = 15
    $('.Score').html(this.score)
}

Player.prototype.getWidth = function () {
    return WIDTH
}

Player.prototype.getHeight = function () {
    return HEIGHT
}

Player.prototype.onFrame = function (delta, hasStarted) {
    if (hasStarted) {
        // reset css transition to 0 to make rayman move fluidly
        this.el.css('transition', '0s')
        // Check if the control keys or mouse is pressed
        if (Controls.isKeyPressed()) {
            // Check if the key was pressed in last frame
            // Assume fresh jump if not
            if (!this.lastFrameKeyPressed) {
                VERTSPEED = JUMPSPEED
                this.lastFrameKeyPressed = true
                this.yB4 = this.pos.y

                // only play flap if sound is not muted
                if (!Controls.getSoundMuted()) {
                    // var flap = document.getElementById('Flap');
                    // flap.volume = 0.1;
                    $('#Flap').trigger('play')
                }
            } else if (this.yB4 < this.pos.y) {
                // If the key was pressed in last frame, make sure it finishes
                // the first jump and set continous jump on
                VERTSPEED = JUMPSPEED
                this.continuousJump = true
            } else if (this.continuousJump) {
                // If continous jump is on, go to the sky!
                VERTSPEED = JUMPSPEED
            }

            // Upward motion, reset rotation
            this.rotate = 15
        } else {
            // Reset jump settings
            this.lastFrameKeyPressed = false
            this.continuousJump = false

            // Only start rotating when jump is finished and rayman starts descending
            if (this.yB4 < this.pos.y) {
                this.rotate = Math.max((this.rotate - 5), -30)
            }
        }

        /* Gravity */
        this.pos.y -= delta * VERTSPEED
        if (VERTSPEED > -180) {
            VERTSPEED -= GRAVITY * delta
        }
    } else {
        // this will make rayman float in the air if he has not started

        const start = this.game.WORLD_HEIGHT / 2 + 3

        if (this.pos.y < (start - 1.5)) {
            op = '+'
        }

        if (this.pos.y > (start + 1.5)) {
            op = '-'
        }

        if (op === '+') {
            this.pos.y += 0.05
        }

        if (op === '-') {
            this.pos.y -= 0.05
        }

        this.el.css('transition', '0.2s')
    }

    this.checkCollisionWithBounds()

    this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate(' + (-this.rotate) + 'deg)')
}

Player.prototype.checkCollisionWithBounds = function () {
    /* We only have to end game if player hits ground */
    if (this.pos.y + HEIGHT > this.game.WORLD_HEIGHT - 12) {
        return this.game.gameover()
    }
}

export default Player
