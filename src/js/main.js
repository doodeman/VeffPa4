(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	width = 600,
	height = 400,
	player = {
	  x : width/2,
	  y : 0,
	  width : 25,
	  height : 25,
	  velX: 0, 
	  velY: 1
	},
	keys = []; 
 
canvas.width = width;
canvas.height = height;
 
var enterPressed = false;  
var obstacles = []; 
var distSinceLastObstacle = 9999;
var gapHeight = 100;
var obstWidth = 20; 
var score = 0; 
var dead = false; 

function update() {
	if (!dead) {
		//render player
		ctx.clearRect(0,0,canvas.width, canvas.height);
		ctx.fillStyle = "red";
		ctx.fillRect(player.x, player.y, player.width, player.height);

		//console.log(obstacles.length);
		//render obstacles
		for (var i = 0; i < obstacles.length; i++) {
			//remove if gone
			if (obstacles[i].x < 20) {
				obstacles.splice(i, 1);
			} 
			else {
				ctx.fillStyle = "blue"; 
				//render top part of obstacle
				ctx.fillRect(obstacles[i].topColumn.x, obstacles[i].topColumn.y, obstacles[i].topColumn.width, obstacles[i].topColumn.height);
				//render bottom part of obstacles
				ctx.fillRect(obstacles[i].botColumn.x, obstacles[i].botColumn.y, obstacles[i].botColumn.width, obstacles[i].botColumn.height);
				//move the obstacle to the left
				obstacles[i].topColumn.x -= 1; 
				obstacles[i].botColumn.x -= 1; 
			}
		}

		//render text
		ctx.font = "bold 12px sans-serif"; 
		ctx.fillText(score, canvas.width/2, 100);

		//check for collision
		for (i = 0; i < obstacles.length; i++) {
			if (obstacles[i].hasCollidedWith(player)) {
				dead = true; 
			}
		}
		if (player.y + player.height < 0 || player.y > canvas.height) { 
			dead = true; 
		}

		//gravity
		player.velY += 0.2;

		//player movement
		if (enterPressed == true) {
			enterPressed = false; 
			player.velY = -5;
		}
		player.y += player.velY;

		//add obstacle
		if (distSinceLastObstacle > 200) {
			var gapPos = Math.floor(Math.random()*(canvas.height-200)) + 100;
			obstacles.push(new Obstacle(canvas.width, gapPos, gapHeight, obstWidth));
			distSinceLastObstacle = 0; 
		}

		//calulate score 
		for (i = 0; i < obstacles.length; i++) {
			if (obstacles[i].hasScored(player)) {
				console.log("obstacle scored " + score);
				score++; 
			}
		}
		distSinceLastObstacle++;
	}
	else {
		//render text
		ctx.clearRect(0,0,canvas.width, canvas.height);
		ctx.font = "bold 22px sans-serif"; 
		ctx.fillText("ur ded", canvas.width/2, canvas.height/2);

	}
	
	requestAnimationFrame(update);
}

$(document).keypress(function(e) {
	if (e.which == 13) { //if e is enter
		enterPressed = true; 
	}
})
window.addEventListener("load", function() {
	update();
});