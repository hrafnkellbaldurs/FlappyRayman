window.Pipe = (function() {
	'use strict';

	// All these constants are in em's, multiply by 10 pixels
	// for 640x420px canvas.
	var posArr = [-28.5, -24.85, -21.5, -17.85, -14.2, -10.55, -6.9, -3.25, 0.4];
	var SPEED = 20; // * 10 pixels per second
	var WIDTH = 16;
	var DANGER_ZONE = 36;
	var GAP = 20;
	var INITIAL_POSITION_X = 51;
	var INITIAL_POSITION_Y = posArr[Math.floor(Math.random() * posArr.length)];
	var pipePassed = false;

	var Pipe = function(el, game, num) {
		this.el = el;
		this.game = game;
		this.player = game.player;
		this.pos = { x: 0, y: 0 };
		this.num = num;
		this.passedCanvas = false;
	};

	/*
	 * Resets the state of the Pipe for a new game.
	 */
	Pipe.prototype.reset = function() {
		if(this.num === 1){
			this.pos.x = INITIAL_POSITION_X;
		}
		else {
			this.pos.x = INITIAL_POSITION_X + (2 * WIDTH);
		}
		this.pos.y = INITIAL_POSITION_Y;
		pipePassed = false;
	};

	Pipe.prototype.onFrame = function(delta, hasStarted) {
		
		if(hasStarted){
			this.pos.x -= delta * SPEED;
		}

		// Checks if the element has passed the left side of the game screen completely and respawns it on the right
		// side with a random y position from posArr
		if(this.pos.x < -WIDTH){
			//var newY = Math.floor(Math.random() * (this.game.WORLD_HEIGHT));
			var newY = posArr[Math.floor(Math.random() * posArr.length)];
			this.pos.y = newY;
			this.pos.x = INITIAL_POSITION_X;
			pipePassed = false;
		}
		this.checkCollisionWithPlayer();
		this.updateScore();

		// Update UI
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Pipe.prototype.checkCollisionWithPlayer = function() {
		if(((this.player.pos.x + this.player.getWidth()) > this.pos.x) && (this.player.pos.x < (this.pos.x + (WIDTH / 2)))){

			if((this.player.pos.y < (this.pos.y + DANGER_ZONE)) || ((this.player.pos.y + this.player.getHeight()) > (this.pos.y + DANGER_ZONE + GAP))) {
				return this.game.gameover();
			}
		}
	};

	Pipe.prototype.updateScore = function() {
		if(((this.pos.x + WIDTH/2) < this.player.pos.x) && !pipePassed) {
			this.player.score++;
			$('.Score').html(this.player.score);
			pipePassed = true;
		}
	};

	return Pipe;

})();
