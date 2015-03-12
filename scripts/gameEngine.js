function GameEngine(label,ui,storeEl){
	var that = this;


	this.label = label;
	this.ui = ui;
	this.store = new Store(document.getElementById("store"),document.getElementById("balance"),100,this);


	//show loading text
	label.innerHTML = "Loading...";

	//create a fullpage canvas
	var canvas = document.createElement("canvas");
	canvas.className = "game";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);

    this.canvas = canvas;

	this.ctx = new WebGL(canvas,135, 206,250);
	this.inputs = new KeyManager(canvas);
	this.collisions = new CollisionDetector();

	this.ctx.onReady = function(){console.log("Textures loaded");that.onReady()};

	this.store.addItem("textures/stone.png","Stone Wall",10,StoneWall);
	this.store.addItem("textures/wood.png","Wood Wall",5,WoodWall);


	this.inputs.onTab = function(){
		that.store.show();
	}

	this.inputs.onSave = function(){
		that.save();
	}

	//define the game textures
	this.textures = {};
	this.textures.stone = this.ctx.Texture("textures/stone2.png");
	this.textures.grass = this.ctx.Texture("textures/grass2.png");
	this.textures.wood = this.ctx.Texture("textures/wood.png");


	//define the game colors
	this.colors = {};
	this.colors.white = this.ctx.Color(255,255,255);

}

GameEngine.prototype.onReady = function(){
	this.label.innerHTML = "START GAME";
	this.label.style.cursor = "pointer";

	var that = this;	
	this.label.onclick = function(){
        //lock the pointer
        document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
        document.body.requestPointerLock();
		//start tracking the mouse
		that.inputs.bind(document.body);

		this.onclick = null;

		console.log("Starting the game");
		that.startGame();
	};
};

GameEngine.prototype.startGame = function(){
	this.label.style.display = "none";
	this.ui.style.display = "block";

	//load the world from saved or from server
	var saved = localStorage.getItem("world");
	if(saved == null){
		saved = HTTPGetSync("/levels/1/world");
		localStorage.setItem("world",saved);
	}
	this.load(saved);

	this.cursor = new LineCube(this.ctx,0,0,0,this.colors.white);

	this.ctx.move(0,0.6,10);

	this.draw();
};

GameEngine.prototype.setCursor = function(Class,cb){
	this.cursorObj = {obj: new Class(this.ctx,this.textures,0,0,0)};
	this.cursorObj.Class = Class;
	this.cursorObj.cb = cb;
}

GameEngine.prototype.draw = function(){
	//request another call to this function when next frame is needed
	var that = this;
	requestAnimFrame(function(){that.draw()});

	this.inputs.update();
	this.ctx.draw();

	var clicked = this.inputs.getClick();
	var rigthClicked = this.inputs.getRightClick();

	var newPos = this.inputs.move(this.ctx.pos);
	//console.log(newPos);
	if(!this.collisions.get(newPos.x,newPos.y,newPos.z,0.8)){
		this.ctx.pos = newPos;
	}

	var pointed = this.collisions.getPointedCube(this.ctx.pos);
	if(pointed != null){
		this.cursor.move(pointed.x,pointed.y,pointed.z);
		this.cursor.draw(this.ctx.gl,this.ctx.shader);
		if(this.cursorObj != null){
			this.cursorObj.obj.move(pointed.x,pointed.y+1,pointed.z)
			this.cursorObj.obj.draw(this.ctx.gl,this.ctx.shader);
			if(clicked){
				var c = new this.cursorObj.Class(this.ctx,this.textures,this.cursorObj.obj.x,this.cursorObj.obj.y,this.cursorObj.obj.z);
				c.setSolid(this.collisions);
				if(!this.cursorObj.cb()){
					this.cursorObj = null;
				}
			}
			if(rigthClicked){
				this.cursorObj = null;
			}
		}
	}
}

GameEngine.prototype.save = function(){
	console.log("Saving current World");

	var res = "";
	for (var i = 0; i < this.ctx.elements.length; i++) {
		res += this.ctx.elements[i].stringify();
	};

	localStorage.setItem("world",res);

	return res;
};

GameEngine.prototype.load = function(str){
	this.ctx.elements = [];
	var list = str.split("\n");
	for (var i = 0; i < list.length-1; i++) {
		var parts = list[i].split(" ");
		try{
			SCENEOBJECTS[parseInt(parts[0])].prototype.revive(this.ctx,this.textures,this.collisions,parts);
		}catch(err){
			console.log(parts,err);
		}
	};
}