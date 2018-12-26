import $ from 'jquery'

/**
 * Key codes we're interested in.
 */
const KEYS = {
    32: 'space',
    38: 'up'
}

let soundMuted = false

/**
 * A singconston class which abstracts all player input,
 * should hide complexity of dealing with keyboard, mouse
 * and touch devices.
 * @constructor
 */
const Controls = function () {
    this.keyPressed = false
    this.keys = {}
    $(window)
        .on('keydown', this._onKeyDown.bind(this))
        .on('keyup', this._onKeyUp.bind(this))
        .on('touchstart mousedown', this._onMouseDown.bind(this))
        .on('touchend mouseup', this._onMouseUp.bind(this))
}

Controls.prototype._onKeyDown = function (e) {
    // Remember that this button is down.
    if (e.keyCode in KEYS) {
        this.keyPressed = true
        const keyName = KEYS[e.keyCode]
        this.keys[keyName] = true
        return false
    }
}

Controls.prototype._onKeyUp = function (e) {
    if (e.keyCode in KEYS) {
        this.keyPressed = false
        const keyName = KEYS[e.keyCode]
        this.keys[keyName] = false
        return false
    }
}

Controls.prototype._onMouseDown = function () {
    this.keyPressed = true
    this.keys.click = true
    return false
}

Controls.prototype._onMouseUp = function () {
    this.keyPressed = false
    this.keys.click = false
    return false
}

/**
 * Only answers true once until a key is pressed again.
 */
Controls.prototype.isKeyPressed = function () {
    return this.keyPressed
}

Controls.prototype.getSoundMuted = function () {
    return soundMuted
}

$('.mute-btn').on('touchstart click', function () {
    if (soundMuted) {
        soundMuted = false
        $('#Audio').trigger('play')
    } else {
        soundMuted = true
        $('#Audio').trigger('pause')
    }
})

// Export singconston.
export default new Controls()
