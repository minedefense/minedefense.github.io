

function Rect(ctx,x,y,z,hx,hy,hz,vx,vy,vz,texture){
	var gl = ctx.gl;
    
    this.x = x;this.y = y;this.z = z;
    this.texture = texture;

    var vert = [x-hx-vx,y-hy-vy,z-hz-vz, x-hx+vx,y-hy+vy,z-hz+vz, x+hx+vx,y+hy+vy,z+hz+vz, x+hx-vx,y+hy-vy,z+hz-vz];
    var tex;

    tex = [0,0, 0,1, 1,1, 1,0]; 

    /*if(hx > hy){
    	
    }else{
     	tex = [0,0, 1,0, 1,1, 0,1];
    }*/

    var normal = vec3.normalize(vec3.cross([hx,hy,hz],[vx,vy,vz]));
    normal = normal.concat(normal).concat(normal).concat(normal);

    this.vertexes = glBuffer(gl,vert,3);
    this.textureCoord = glBuffer(gl,tex,2);
    this.vertexIndexes = glBufferUint(gl,[0,1,2, 2,3,0],1);
    this.vertexNormals = glBuffer(gl,normal,3);

    this.matrix = mat4.create();
    mat4.identity(this.matrix);

    this.move = function(x,y,z){
        this.x = x;this.y = y;this.z = z;
        mat4.identity(this.matrix);
        mat4.translate(this.matrix, [x, y, z]);
    }

    this.draw = function(gl,shader){
        //push the model matrix
        gl.uniformMatrix4fv(shader.modelMatrix, false, this.matrix);

        //set vertex positions
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexes);
        gl.vertexAttribPointer(shader.vertexPos, this.vertexes.itemSize, gl.FLOAT, false, 0, 0);

        //set normal directions
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormals);
        gl.vertexAttribPointer(shader.vertexNormals, this.vertexNormals.itemSize, gl.FLOAT, false, 0, 0);

        //set texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoord);
        gl.vertexAttribPointer(shader.textureCoord, this.textureCoord.itemSize, gl.FLOAT, false, 0, 0);
    
        this.texture.push(gl,shader);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexes);

        gl.drawElements(gl.TRIANGLES, this.vertexIndexes.numItems, gl.UNSIGNED_SHORT, 0);

    }
}

function Rect3D(ctx,x,y,z,dx,dy,dz,front,left,rigth,top,bot,back){
	this.parts = [];
    this.x = x;this.y = y;this.z = z;


	//sides
	this.parts.push(new Rect(ctx, x-dx,y,z, 0,0,dz, 0,dy,0, left));
	this.parts.push(new Rect(ctx, x+dx,y,z, 0,0,-dz, 0,dy,0, rigth));

	//top bottom
	this.parts.push(new Rect(ctx, x,y-dy,z, dx,0,0, 0,0,dz, bot));
	this.parts.push(new Rect(ctx, x,y+dy,z, dx,0,0, 0,0,dz, top));

	//front back
	this.parts.push(new Rect(ctx, x,y,z+dz, dx,0,0, 0,dy,0, front));
	this.parts.push(new Rect(ctx, x,y,z-dz, -dx,0,0, 0,dy,0, back));

	this.draw = function(gl,shader){
		for (var i = 0; i < this.parts.length; i++) {
			this.parts[i].draw(gl,shader);
		};
	}

    this.move = function(x,y,z){
        this.x = x;this.y = y;this.z = z;
        for (var i = 0; i < this.parts.length; i++) {
            this.parts[i].move(x,y,z);
        };
    }
}