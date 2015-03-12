function WoodWall(ctx,textures,x,y,z){
	this.x = x;this.y = y;this.z = z;

	this.cube = new Cube(ctx,x,y,z,textures.wood);

	this.setSolid = function(collisions){
		collisions.set(this.x,this.y,this.z);
	}

	this.move = function(x,y,z){
		this.x = x;this.y = y;this.z = z;
		this.cube.move(x,y,z);
	}

	this.draw = function(gl,shader){
		this.cube.draw(gl,shader);
	}

	this.stringify = function(){
		return 0+" "+this.x+" "+this.y+" "+this.z+"\n";
	}

	ctx.add(this);
};

WoodWall.prototype.revive = function(ctx,textures,collisions,args){
	var r = new WoodWall(ctx,textures,parseFloat(args[1]),parseFloat(args[2]),parseFloat(args[3]));
	r.setSolid(collisions);
	return r;
}

function StoneWall(ctx,textures,x,y,z){
	this.x = x;this.y = y;this.z = z;

	this.cube = new Cube(ctx,x,y,z,textures.stone);

	this.setSolid = function(collisions){
		collisions.set(this.x,this.y,this.z);
	}

	this.move = function(x,y,z){
		this.x = x;this.y = y;this.z = z;
		this.cube.move(x,y,z);
	}

	this.draw = function(gl,shader){
		this.cube.draw(gl,shader);
	}

	this.stringify = function(){
		return 1+" "+this.x+" "+this.y+" "+this.z+"\n";
	}

	ctx.add(this);
};

StoneWall.prototype.revive = function(ctx,textures,collisions,args){
	var r = new StoneWall(ctx,textures,parseFloat(args[1]),parseFloat(args[2]),parseFloat(args[3]));
	r.setSolid(collisions);
	return r;
}


function Grass(ctx,textures,x,y,z){
	this.x = x;this.y = y;this.z = z;

	this.cube = new Cube(ctx,x,y,z,textures.grass);

	this.setSolid = function(collisions){
		collisions.set(this.x,this.y,this.z);
	}

	this.move = function(x,y,z){
		this.x = x;this.y = y;this.z = z;
		this.cube.move(x,y,z);
	}

	this.draw = function(gl,shader){
		this.cube.draw(gl,shader);
	}

	this.stringify = function(){
		return 2+" "+this.x+" "+this.y+" "+this.z+"\n";
	}

	ctx.add(this);
};

Grass.prototype.revive = function(ctx,textures,collisions,args){
	var r = new Grass(ctx,textures,parseFloat(args[1]),parseFloat(args[2]),parseFloat(args[3]));
	r.setSolid(collisions);
	return r;
}


var SCENEOBJECTS = [WoodWall,StoneWall,Grass];