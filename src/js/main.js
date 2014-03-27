(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();


var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	width = window.innerWidth,
	height = window.innerHeight,
	player = {
	  x : width/2,
	  y : height/2 - 100,
	  width : 35,
	  height : 35,
	  velX: 0, 
	  velY: 1
	},
	keys = []; 

 
canvas.width = width;
canvas.height = height;
 
var groundHeight = 60; 
var enterPressed = false;  
var obstacles = []; 
var clouds = [];
var distSinceLastObstacle = 9999;
var gapHeight = 110;
var obstWidth = 40; 
var score = 0; 
var dead = false; 

var cloudImg = new Image(); 
cloudImg.src ='cloud.png';


//Grass image is 386 pixels wide
var grassImg = new Image(); 
grassImg.src = 'grass.png';
var grass = []; 
grass.push(new Grass(0, canvas.height - groundHeight, 1, 1)); 
while (grass[grass.length-1].x < canvas.width) {
	grass.push(new Grass(grass[grass.length-1].x + 386, canvas.height - groundHeight, 1, 1));
}

//Initialize sprites
var playerImg1 = new Image(); 
playerImg1.src = 'bear2.png';
var playerImg2 = new Image(); 
playerImg2.src = 'bear3.png'; 
var playerImg3 = new Image(); 
playerImg3.src = 'bear4.png';

var backgroundImg = new Image(); 
backgroundImg.src = 'background.png';
backgrounds = [];
backgrounds.push(new Background(0, canvas.height - 340 - groundHeight, 1, 1));  
while (backgrounds[backgrounds.length-1].x < canvas.width) {
	backgrounds.push(new Background(backgrounds[backgrounds.length-1].x + 405, canvas.height - 340 - groundHeight, 1, 1));
}

var obstacleImg = new Image(); 
obstacleImg.src = 'pipe.png';

var topObstacleImg = new Image(); 
topObstacleImg.src = 'pipedown.png';

var started = false; 

var time = 0; 

function reset() {
	player.y = 120; 
	player.velY = 1; 
	time = 0; 
	obstacles = [];
	dead = false; 
}

function update() {
	//resize canvas
	ctx.canvas.width = window.innerWidth; 
	ctx.canvas.height = window.innerHeight;


	time++;
	//clear canvas
	ctx.clearRect(0,0,canvas.width, canvas.height);

	
	//render background 
	ctx.fillStyle = "#71c5d0";
	ctx.fillRect(0,0,canvas.width, canvas.height);

	for (var i = 0; i < backgrounds.length; i++) {
		if (backgrounds[i].x < -500) {
			backgrounds.splice(i, 1); 
		}
		else {
			ctx.drawImage(backgroundImg, backgrounds[i].x, backgrounds[i].y); 
			backgrounds[i].x -= backgrounds[i].velocity; 
		}
	}
	//add new grass if current image is running out 
	if (backgrounds[backgrounds.length-1].x < canvas.width - backgroundImg.width) {
		backgrounds.push(new Background(canvas.width-3, canvas.height - 340 - groundHeight, 1, 1));
	}


	//render ground
	ctx.fillStyle = "#FAD66A";
	ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
	//brown outline at bottom edge of grass
	ctx.fillStyle = "#BFA450";
	ctx.fillRect(0, canvas.height-groundHeight+10, canvas.width, 2);
	//darker brown outline at top edge of grass
	ctx.fillStyle = "5C4F27"; 
	ctx.fillRect(0, canvas.height-groundHeight-2, canvas.width, 2); 

	//add new grass if current strip is running out 
	if (grass[grass.length-1].x < canvas.width - 385) {
		grass.push(new Grass(canvas.width, canvas.height - groundHeight, 1, 1));
	}
	//render grass
	for (i = 0; i < grass.length; i++) {
		if (grass[i].x < -500) {
			grass.splice(i, 1); 
		}
		else {
			ctx.drawImage(grassImg, grass[i].x, grass[i].y);
			grass[i].x -= grass[i].velocity;
		}
	}

	//render clouds
	/*for (i = 0; i < clouds.length; i++) {
		if(clouds[i].x < -50) {
			clouds.splice(i, 1);
		}
		else {
			ctx.drawImage(cloudImg, clouds[i].x, clouds[i].y, 
				cloudImg.width * clouds[i].scale, cloudImg.height * clouds[i].scale);
			//ctx.drawImage(cloudImg,clouds[i].x, clouds[i].y);
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
	}*/



	//render player
	//ctx.fillStyle = "red";
	//ctx.fillRect(player.x, player.y, player.width, player.height);

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
			var imgPos = obstacles[i].topColumn.height - topObstacleImg.height;
			//ctx.fillRect(obstacles[i].topColumn.x, obstacles[i].topColumn.y, obstacles[i].topColumn.width, obstacles[i].topColumn.height);
			ctx.drawImage(topObstacleImg, obstacles[i].topColumn.x, imgPos,
				obstacles[i].width, topObstacleImg.height);
			//render bottom part of obstacles
			//ctx.fillRect(obstacles[i].botColumn.x, obstacles[i].botColumn.y, obstacles[i].botColumn.width, obstacles[i].botColumn.height);
			ctx.drawImage(obstacleImg, obstacles[i].botColumn.x, obstacles[i].botColumn.y,
				obstacles[i].width, obstacleImg.height);
			//move the obstacle to the left
			obstacles[i].topColumn.x -= 1; 
			obstacles[i].botColumn.x -= 1; 
		}
	}

	if (!started) {
		renderText("Spurdo burde :DDDD", canvas.width/2 - 200, canvas.height/2 - 120);
		renderText("bres ender key :D:D", canvas.width/2 - 200, canvas.height/2);
	}
	if (!dead) {

		renderPlayer(player, time, 15);
		//check for collision
		for (i = 0; i < obstacles.length; i++) {
			if (obstacles[i].hasCollidedWith(player)) {
				dead = true; 
			}
		}
		if (player.y < 0 || player.y > canvas.height - groundHeight -
		 player.height) { 
			dead = true; 
		}

		//gravity
		player.velY += 0.2;

		//player movement
		if (enterPressed == true) {
			started = true;
			enterPressed = false; 
			player.velY = -5;
		}
		if (started) {
			player.y += player.velY;
		}

		//add obstacle
		if (distSinceLastObstacle > 200) {
			if (started) {
				var gapPos = Math.floor(getRandomNumberInRange(150, canvas.height-150));
				obstacles.push(new Obstacle(canvas.width, gapPos, gapHeight, obstWidth));
				distSinceLastObstacle = 0; 
			}
		}

		//calulate score 
		for (i = 0; i < obstacles.length; i++) {
			if (obstacles[i].hasScored(player)) {
				console.log("obstacle scored " + score);
				score++; 
			}
		}
		if (started) {
			distSinceLastObstacle++;
		}
	}
	else {
		//render text
		//ctx.clearRect(0,0,canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.font = "bold 22px sans-serif"; 
		ctx.fillText("FUG :D:D:D", canvas.width/2 - 50, canvas.height/2 -150);
		if (score < 5){
			ctx.fillText("yuo just god " + score + " boints :D:D:D:D", canvas.width/2 - 120, canvas.height/2 - 50)
		}
		else {
			ctx.fillText("yuo god " + score + " boints bretty good :D:D:D:D", canvas.width/2 - 160 , canvas.height/2 - 50)
		}
		ctx.fillText("bres ender buddon to pley agen :DDDD", canvas.width/2 - 150, canvas.height/2); 
		//renderText("fug :D:D:D", 200, 100);
		//renderText("yuo got " + score + " boints :D:D:D:D", 75, 300);
		if (enterPressed == true) {
			reset();
		}

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

function renderText(text, xpos, ypos) {
	//render text
	ctx.save(); 
	/*ctx.shadowColor="white"; 
	ctx.shadowOffsetX = 2; 
	ctx.shadowOffsetY = 2; 
	ctx.shadowBlur = 10; */

	/*gradient.addColorStop(0, '#EDFFC4');
 	gradient.addColorStop(1, '#ADFC6D');*/

	ctx.font = "40px FlappyBird"; 
	ctx.strokeStyle = '';
	//ctx.fillStyle = 'black';
	ctx.fillStyle = 'green';
	ctx.lineWidth=2;
	//ctx.strokeText(score, canvas.width/2, 100);
	ctx.strokeText(text, xpos, ypos);
	ctx.fillText(text, xpos, ypos);
	ctx.restore();
}

function renderPlayer(player, time, offset) {
	//ctx.drawImage(playerImg, player.x - x/2, player.y - x/2, player.width+x, player.height+x);
	if (player.velY > 0) {
		ctx.drawImage(playerImg1, player.x - offset/2, player.y - offset/2, player.width+offset, player.height+offset);
	}
	else {
		if (time%3 == 0) {
			ctx.drawImage(playerImg1, player.x - offset/2, player.y - offset/2, player.width+offset, player.height+offset);
		}
		if (time%3 == 1) {
			ctx.drawImage(playerImg2, player.x - offset/2, player.y - offset/2, player.width+offset, player.height+offset);
		}
		if (time%3 == 2) {
			ctx.drawImage(playerImg3, player.x - offset/2, player.y - offset/2, player.width+offset, player.height+offset);
		}
	}
}