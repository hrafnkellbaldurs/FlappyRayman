window.Wings = (function() {
	'use strict';

	//var Controls = window.Controls;

	var Wings = function(el, game) {
		this.el = el;
		this.game = game;
		// Contains number of jump events registered since the key was first pressed
	};



	/*Wings.prototype.onFrame = function() {
		if(Controls.isKeyPressed()){
			this.el.css('transform', 'translateZ(0) rotateX(180deg) rotateY(-90deg)');
		}
	};*/
	return Wings;

})();
