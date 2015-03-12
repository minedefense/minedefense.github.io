function Point3D(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;

	this.normaInf = function(p){
		return Math.max(Math.max(Math.abs(this.x),Math.abs(this.y)),Math.abs(this.z));
	}

	this.norma2 = function(){
		return this.x*this.x + this.y*this.y + this.z*this.z;
	}

	this.dot = function(p){
		return this.x*p.x + this.y*p.y + this.z*p.z;
	}

	this.add = function(p,k){
		k = k || 1;
		return new Point3D(this.x + p.x*k,this.y + p.y*k,this.z + p.z*k);
	}
}

function directionVector(horRot,verRot){
	var x = Math.sin(horRot)*Math.cos(-verRot);
	var y = Math.sin(-verRot);
	var z = -(Math.cos(horRot)*Math.cos(-verRot));

	return new Point3D(x,y,z);
}


function CollisionDetector(){
	this.cubes = [];

	this.set = function(x,y,z){
		this.cubes.push(new Point3D(x,y,z));
	}

	this.collision = function(cube,x,y,z,r){
		//distanza norma infinito in R3
		var dist = Math.max(Math.max(Math.abs(cube.x-x),Math.abs(cube.y-y)),Math.abs(cube.z-z));
		return dist <= r;
	}

	this.get = function(x,y,z,r){
		for(var i = 0;i < this.cubes.length;i++){
			if(this.collision(this.cubes[i],x,y,z,r))return true;
		}
		return false;
	}

	this.getPointedCube = function(pos){
		var O = new Point3D(pos.x,pos.y,pos.z);
		var d = directionVector(pos.horRot,pos.verRot);

		var k = d.dot(O);
		var min = 1e300;
		var winner = null;

		for(var i = 0;i < this.cubes.length;i++){
			var t = d.dot(this.cubes[i]) - k;
			if(t > 0 && O.add(d,t).add(this.cubes[i],-1).normaInf() < 0.5){
			//if(this.cubes[i].add(O).add(d,t).normaInf() < 1){
				var dist = O.add(this.cubes[i],-1).norma2();
				if(dist < min){
					min = dist;
					winner = this.cubes[i];
				}
			}
		}

		return winner;
	}
}

/*function OctreeNode(s,d){
	this.size = s;

	this.childs = {};

	this.getChild = function(point){
		return 4*(point.z > size/2) + 2*(point.y > size/2) + 1*(point.x > size/2)
	}

	this.add = function(point){
		var c = this.getChild(point);
	}
}


//size of the world, center of the world
function CollisionDetector(size,center){
	this.root = new OctreeNode(size);
	this.center = center;

	this.add = function(point){
		this.root.add(point.sub(this.center));
	}
}*/