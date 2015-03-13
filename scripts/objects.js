function WoodWall(ctx,textures,x,y,z){
	this.x = x;this.y = y;this.z = z;

	var t = textures.wood;
	this.cube = new Rect3D(ctx,x,y,z,0.5,0.5,0.5,t,t,t,t,t,t);//new Cube(ctx,x,y,z,textures.wood);

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

	var t = textures.stone;
	this.cube = new Rect3D(ctx,x,y,z,0.5,0.5,0.5,t,t,t,t,t,t);

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

	var t = textures.grass;
	this.cube = new Rect3D(ctx,x,y,z,0.5,0.5,0.5,t,t,t,t,t,t);

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


function Gold(ctx,textures,x,y,z){
	this.x = x;this.y = y;this.z = z;

	var t = textures.gold;
	this.cube = new Rect3D(ctx,x,y,z,0.5,0.5,0.5,t,t,t,t,t,t);

	this.draw = function(gl,shader){
		this.cube.draw(gl,shader);
	}

	this.stringify = function(){
		return 3+" "+this.x+" "+this.y+" "+this.z+"\n";
	}

	ctx.add(this);
};

Gold.prototype.revive = function(ctx,textures,collisions,args){
	var r = new Gold(ctx,textures,parseFloat(args[1]),parseFloat(args[2]),parseFloat(args[3]));
	return r;
}
/*

	//legs
	this.ctx.add(new Rect3D(this.ctx, 0.15,-0.1,3, 0.1,0.4,0.08, this.textures.leg,this.colors.legTop,this.colors.legBot));
	this.ctx.add(new Rect3D(this.ctx, -0.15,-0.1,3, 0.1,0.4,0.08, this.textures.leg,this.colors.legTop,this.colors.legBot));
	//body
	this.ctx.add(new Rect3D(this.ctx, 0,0.7,3, 0.25,0.4,0.08, this.colors.legTop,this.colors.legTop,this.colors.legTop));
	//arms
	this.ctx.add(new Rect3D(this.ctx, 0.34,0.77,3, 0.07,0.33,0.08, this.textures.arm,this.colors.legTop,this.colors.skin));
	this.ctx.add(new Rect3D(this.ctx, -0.34,0.77,3, 0.07,0.33,0.08, this.textures.arm,this.colors.legTop,this.colors.skin));
	//head
	this.ctx.add(new Rect3D(this.ctx, 0,1.3,3, 0.15,0.15,0.15, this.colors.skin,this.colors.skin,this.colors.skin));

*/

var SCENEOBJECTS = [WoodWall,StoneWall,Grass,Gold];