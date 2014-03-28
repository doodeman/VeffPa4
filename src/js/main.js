(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

//Canvas initialization
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight;
var player = new Object(width/2, height/2-100, 35, 35, null, 0, 1);
canvas.width = width;
canvas.height = height;
 
//configuration variables
var groundHeight = 60; 
var enterPressed = false;  
var obstacles = []; 
var distSinceLastObstacle = 9999;
var gapHeight = 110;
var obstWidth = 40; 

//gamestate variables
var score = 0; 
var dead = false; 
var grass = []; 
var started = false; 
var time = 0; 
var backgrounds = [];
var keys = []; 

//touch support
canvas.addEventListener("touchstart", function (e) {
enterPressed = true}, false);

//images
var grassImg = new Image(); 
grassImg.src = 'grass.png';
var backgroundImg = new Image(); 
backgroundImg.src = 'background.png';
var obstacleImg = new Image(); 
obstacleImg.src = 'pipe.png';
var topObstacleImg = new Image(); 
topObstacleImg.src = 'pipedown.png';
player.img1 = new Image(); 
player.img1.src = 'bear2.png';
player.img2 = new Image(); 
player.img2.src = 'bear3.png'; 
player.img3 = new Image(); 
player.img3.src = 'bear4.png';

//sounds
var flapSound = new Audio('flap.wav'); 
flapSound.volume = 1;
var deathSound = new Audio('death.wav'); 
deathSound.volume = 1; 

//initial grass + backgrounds
grass.push(new Object(0, canvas.height - groundHeight, null, null, grassImg, 1, 0)); 
while (grass[grass.length-1].x < canvas.width) {
	grass.push(new Object(grass[grass.length-1].x + 386, canvas.height - groundHeight, null, null, grassImg, 1, 0));
}
backgrounds.push(new Object(0, canvas.height - 340 - groundHeight, null, null, backgroundImg, 0.5, 0));  
while (backgrounds[backgrounds.length-1].x < canvas.width) {
	backgrounds.push(new Object(backgrounds[backgrounds.length-1].x + 405, canvas.height - 340 - groundHeight, null, null, backgroundImg, 0.5, 0));
}

function reset() {
	player.y = 120; 
	player.velY = 1; 
	time = 0; 
	obstacles = [];
	dead = false; 
}


function update() {
	updateGameState();
	render(); 
	requestAnimationFrame(update);
}

function render() {
	//resize canvas
	//ctx.canvas.width = window.innerWidth; 
	//ctx.canvas.height = window.innerHeight;

	//clear canvas
	ctx.clearRect(0,0,canvas.width, canvas.height);

	//render fills 
	//render background 
	ctx.fillStyle = "#71c5d0";
	ctx.fillRect(0,0,canvas.width, canvas.height);
	//render ground
	ctx.fillStyle = "#FAD66A";
	ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
	//brown outline at bottom edge of grass
	ctx.fillStyle = "#BFA450";
	ctx.fillRect(0, canvas.height-groundHeight+10, canvas.width, 2);
	//darker brown outline at top edge of grass
	ctx.fillStyle = "5C4F27"; 
	ctx.fillRect(0, canvas.height-groundHeight-2, canvas.width, 2); 

	//render image objects
	renderGroup(grass);
	renderGroup(backgrounds);
	renderObstacles(obstacles);

	if (!dead) {
		renderPlayer(player, time, 15);
	}
	else {
		renderGameOverText();
	}

	//render text
	if (!started) {
		renderText("Spurdo burde :DDDD", canvas.width/2 - 200, canvas.height/2 - 120);
		renderText("bres ender key :D:D", canvas.width/2 - 200, canvas.height/2);
	}
	if (!dead && started) {
		renderText(score, canvas.width/2+10, 50);
	}

}

function updateGameState() {
	time++;

	//add new grass if current strip is running out 
	if (grass[grass.length-1].x < canvas.width - 385) {
		grass.push(new Object(canvas.width, canvas.height - groundHeight, null, null, grassImg, 1, 0));
	}

	//add new grass if current image is running out 
	if (backgrounds[backgrounds.length-1].x < canvas.width - backgroundImg.width) {
		backgrounds.push(new Object(canvas.width-3, canvas.height - 340 - groundHeight, null, null, backgroundImg, 0.5, 0));
	}

	if (!dead) {
		//check for collision
		for (i = 0; i < obstacles.length; i++) {
			if (obstacles[i].hasCollidedWith(player)) {
				dead = true; 
				deathSound.play();
			}
		}
		if (player.y < 0 || player.y > canvas.height - groundHeight -
		 player.height) { 
			dead = true; 
			deathSound.play();
		}

		//gravity
		player.vely += 0.2;

		//player movement
		if (enterPressed == true) {
			flapSound.play();
			started = true;
			enterPressed = false; 
			player.vely = -5;
		}
		if (started) {
			player.y += player.vely;
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
		if (enterPressed == true) {
			reset();
		}

	}
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
	ctx.save(); 
	ctx.font = "40px FlappyBird"; 
	ctx.strokeStyle = '';
	ctx.fillStyle = 'green';
	ctx.lineWidth=2;
	ctx.strokeText(text, xpos, ypos);
	ctx.fillText(text, xpos, ypos);
	ctx.restore();
}

function renderPlayer(player, time, offset) {
	//ctx.drawImage(playerImg, player.x - x/2, player.y - x/2, player.width+x, player.height+x);
	if (player.vely > 0) {
		ctx.drawImage(player.img1, player.x - offset/2, player.y - offset/2, player.width+offset, player.height+offset);
	}
	else {
		if (time%3 == 0) {
			ctx.drawImage(player.img1, player.x - offset/2, player.y - offset/2, player.width+offset, player.height+offset);
		}
		if (time%3 == 1) {
			ctx.drawImage(player.img2, player.x - offset/2, player.y - offset/2, player.width+offset, player.height+offset);
		}
		if (time%3 == 2) {
			ctx.drawImage(player.img3, player.x - offset/2, player.y - offset/2, player.width+offset, player.height+offset);
		}
	}
}

function renderGroup(group) {
	for (i = 0; i < group.length; i++) {
		if (group[i].x < -500) {
			group.splice(i, 1); 
		}
		else {
			group[i].render(ctx);
		}
	}
}

function renderObstacles(group) {
	for (i = 0; i < group.length; i++) {
		//remove if gone
		if (group[i].x < 20) {
			group.splice(i, 1);
		} 
		else {
			obstacles[i].render(ctx);
		}
	}
}

function renderGameOverText() {
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
}