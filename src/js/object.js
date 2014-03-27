function Object(xpos, ypos, width, height, image, velx, vely) {
	this.x = xpos; 
	this.y = ypos; 
	this.width = width; 
	this.height = height; 
	this.image = image; 
	this.velx = velx; 
	this.vely = vely;

	this.render = function(context) {
		context.drawImage(this.image, this.x, this.y);
		this.x -= this.velx;
	}
}