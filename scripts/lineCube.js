        




function LineCube(ctx,x,y,z,texture){
	var gl = ctx.gl;
    this.texture = texture;

    /*this.move = function(x,y,z){
        var points = [x-.5,y-.5,z+.5,x+.5,y-.5,z+.5,x+.5,y+.5,z+.5,x-.5,y+.5,z+.5,x-.5,y-.5,z-.5,x+.5,y-.5,z-.5,x+.5,y+.5,z-.5,x-.5,y+.5,z-.5];
        this.vertexes = glBuffer(gl,points,3);
    }*/

    var points = [-.5,-.5,.5,.5,-.5,.5,.5,.5,.5,-.5,.5,.5,-.5,-.5,-.5,.5,-.5,-.5,.5,+.5,-.5,-.5,.5,-.5];
	var texCoords = [0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1];
    var verNormals = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var verInd = [0,1, 1,2, 2,3, 3,0,   4,5, 5,6, 6,7, 7,4,    0,4, 1,5, 2,6, 3,7];

    this.vertexes = glBuffer(gl,points,3);
    this.textureCoord = glBuffer(gl,texCoords,2);
    this.vertexNormals = glBuffer(gl,verNormals,3);
    this.vertexIndexes = glBufferUint(gl,verInd,1);

    this.matrix = mat4.create();
    
    this.move = function(x,y,z){
        mat4.identity(this.matrix);
        mat4.translate(this.matrix, [x, y, z]);
    }

    this.draw = function(gl,shader){
    	gl.disable(gl.DEPTH_TEST);

        //push the model matrix
        gl.uniformMatrix4fv(shader.modelMatrix, false, this.matrix);
        
        //set vertex positions
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexes);
        gl.vertexAttribPointer(shader.vertexPos, this.vertexes.itemSize, gl.FLOAT, false, 0, 0);

        //set vertex normals
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormals);
        gl.vertexAttribPointer(shader.vertexNormals, this.vertexNormals.itemSize, gl.FLOAT, false, 0, 0);

        //set texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoord);
        gl.vertexAttribPointer(shader.textureCoord, this.textureCoord.itemSize, gl.FLOAT, false, 0, 0);
    
        this.texture.push(gl,shader);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexes);

        gl.drawElements(gl.LINES, this.vertexIndexes.numItems, gl.UNSIGNED_SHORT, 0);

		gl.enable(gl.DEPTH_TEST);
    }
}