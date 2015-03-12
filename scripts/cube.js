
function Cube(ctx,x,y,z,texture){
	var gl = ctx.gl;
    this.texture = texture;

    var points = [x-.5,y-.5,z+.5,x+.5,y-.5,z+.5,x+.5,y+.5,z+.5,x-.5,y+.5,z+.5,x-.5,y-.5,z-.5,x-.5,y+.5,z-.5,x+.5,y+.5,z-.5,x+.5,y-.5,z-.5,x-.5,y+.5,z-.5,x-.5,y+.5,z+.5,x+.5,y+.5,z+.5,x+.5,y+.5,z-.5,x-.5,y-.5,z-.5,x+.5,y-.5,z-.5,x+.5,y-.5,z+.5,x-.5,y-.5,z+.5,x+.5,y-.5,z-.5,x+.5,y+.5,z-.5,x+.5,y+.5,z+.5,x+.5,y-.5,z+.5,x-.5,y-.5,z-.5,x-.5,y-.5,z+.5,x-.5,y+.5,z+.5,x-.5,y+.5,z-.5];
	var texCoords = [0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1];
	var verInd = [0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23];

    this.vertexes = glBuffer(gl,points,3);
    this.textureCoord = glBuffer(gl,texCoords,2);
    this.vertexIndexes = glBufferUint(gl,verInd,1);

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

        //set texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoord);
        gl.vertexAttribPointer(shader.textureCoord, this.textureCoord.itemSize, gl.FLOAT, false, 0, 0);
    
        this.texture.push(gl,shader);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexes);

        gl.drawElements(gl.TRIANGLES, this.vertexIndexes.numItems, gl.UNSIGNED_SHORT, 0);

    }
}