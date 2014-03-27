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
var clouds = [];
var distSinceLastObstacle = 9999;
var gapHeight = 100;
var obstWidth = 20; 
var score = 0; 
var dead = false; 
var img = new Image(); 
img.src ='cloud.png';

function update() {
	if (!dead) {
		//clear canvas
		ctx.clearRect(0,0,canvas.width, canvas.height);
		
		//render background 
		ctx.fillStyle = "#8AF1F2";
		ctx.fillRect(0,0,canvas.width, canvas.height);

		//render clouds
		for (var i = 0; i < clouds.length; i++) {
			if(clouds[i].x < -50) {
				clouds.splice(i, 1);
			}
			else {
				ctx.drawImage(img, clouds[i].x, clouds[i].y, 
					img.width * clouds[i].scale, img.height * clouds[i].scale);
				//ctx.drawImage(img,clouds[i].x, clouds[i].y);
				//move the cloud to the left 
				clouds[i].x -= clouds[i].velocity; 
			}
		}

		//2.5% chance per frame of adding new cloud 
		var random = Math.random(); 
		if (random <= 0.025) {
			console.log("adding cloud " + clouds.length);
			var velocity = Math.floor(getRandomNumberInRange(2, 4)); 
			var scalingMultiplier = getRandomNumberInRange(0.1,0.3);
			var cloudHeight = getRandomNumberInRange(10, canvas.height-200);
			clouds.push(new Cloud(canvas.width, cloudHeight, scalingMultiplier, velocity));
		}



		//render player
		ctx.fillStyle = "red";
		ctx.fillRect(player.x, player.y, player.width, player.height);

		//console.log(obstacles.length);
		//render obstacles
		for (i = 0; i < obstacles.length; i++) {
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
			var gapPos = Math.floor(getRandomNumberInRange(100, canvas.height-100));
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

//returns a random number between min and max
function getRandomNumberInRange(min, max) {
	return Math.random() * (max - min) + min; 
}