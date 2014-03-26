function Obstacle (canvasWidth, gapPos, gapSize, colWidth) {
	this.x = canvasWidth;
	this.gapPosition = gapPos;
	this.gapHeight = gapSize;
	this.width = colWidth;
	this.passed = false; 


	var topHeight = gapPos - gapSize/2; 
	var botHeight = canvasWidth - topHeight + gapSize; 
	this.topColumn = {x: this.x, y: 0, height: topHeight, width: colWidth};
	this.botColumn = {x: this.x, y: (gapPos + gapSize/2), height: botHeight, width: colWidth}; 

	this.hasCollidedWith = function(player) {
		//convenience 
		var botHeight = canvasWidth - topHeight + gapSize; 
		var bool = (this.collisionCheck(player, this.topColumn) || this.collisionCheck(player, this.botColumn));
		return bool;
	}

	this.collisionCheck = function(a, b) {
		//Rectangle 1′s bottom edge is higher than Rectangle 2′s top edge.
		if ((a.y + a.height) < (b.y)) {
			return false;
		}
		//Rectangle 1′s top edge is lower than Rectangle 2′s bottom edge.	
		if ((a.y) > (b.y + b.height)) {
			return false;
		}
		//Rectangle 1′s left edge is to the right of Rectangle 2′s right edge.
		if ((a.x) > (b.x + b.width)) {
			return false; 
		}
		//Rectangle 1′s right edge is to the left of Rectangle 2′s left edge
		if ((a.x + a.width) < (b.x)) {
			return false; 
		}
		return true;
	}

	this.hasScored = function(player) {
		if (!(player.x > this.topColumn.x) || this.passed) {
			return false; 
		}
		else {
			this.passed = true; 
			return true; 
		}
	}
}