
window.Game = (function() {
	'use strict';

	/* for checking if player has pressed a button for the first time*/
	var Controls = window.Controls;
	var death = document.getElementById('Death');
	death.volume = 0.4;
	var gameAudio = document.getElementById('Audio');
	gameAudio.volume = 1;
	var coinAudio = document.getElementById('Coin');
	coinAudio.volume = 0.7;

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */
	var Game = function(el) {
		this.el = el;
		this.player = new window.Player(this.el.find('.Player'), this);
		this.wings = new window.Wings(this.el.find('.Player-wings'), this);
		this.pipe = new window.Pipe(this.el.find('.Pipe'), this, 1);
		this.pipe2 = new window.Pipe(this.el.find('.Pipe2'), this, 2);
		this.ground = new window.Ground(this.el.find('.Ground'), this);
		this.cloud = new window.Cloud(this.el.find('.Cloud'), this);
		this.coin = new window.Coin(this.el.find('.Coin'), this);
		this.isPlaying = false;

		/* for starting game */
		this.hasStarted = false;

		this.highScore = 0;



		var fontsize = Math.min(
			window.innerWidth / 35,
			window.innerHeight / 75
		);
		el.css('fontSize',fontsize + 'px');

		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		/* first jump initiates gravity */
		if(Controls.keys.up || Controls.keys.space || Controls.keys.click){
			this.hasStarted = true;
		}



		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta, this.hasStarted);
		//this.wings.onFrame(delta, this.hasStarted);
		this.ground.onFrame(delta);
		this.cloud.onFrame(delta);
		this.pipe.onFrame(delta, this.hasStarted);
		this.pipe2.onFrame(delta, this.hasStarted);
		this.coin.onFrame(delta, this.hasStarted);
		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset(this);
		this.pipe.reset();
		this.pipe2.reset();
		this.coin.reset();
		/* resets the start playing state */
		this.hasStarted = false;
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;
		console.log('GAMEOVER');

		if(!Controls.getSoundMuted()){
			//var death = document.getElementById('Death');
			//death.volume = 0.4;
			$('#Death').trigger('play');
		}
		
		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('touchend click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});

		$('.Scoreboard-Score>span').html(this.player.score);
		if(this.player.score > this.highScore) {
			this.highScore = this.player.score;
		}
		$('.Scoreboard-Highscore>span').html(this.highScore);

		
	};
	

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 40;
	Game.prototype.WORLD_HEIGHT = 70;


	return Game;
})();


