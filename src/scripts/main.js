import '../styles/main.scss'
import './polyfills'
import $ from 'jquery'
import Game from './game'

/**
 * Bootstrap and start the game.
 */
$(() => {
    const game = new Game($('.GameCanvas'))
    game.start()
})
