function initShaders(gl) {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPos = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPos);   

    shaderProgram.textureCoord = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoord);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.modelMatrix = gl.getUniformLocation(shaderProgram, "modelMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    return shaderProgram;
}

function glBuffer(gl,data,itemSize){
    res = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, res);
     
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    res.numItems = data.length/itemSize;
    res.itemSize = itemSize;

    return res;
}

function glBufferUint(gl,data,itemSize){
    res = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, res);
     
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

    res.numItems = data.length/itemSize;
    res.itemSize = itemSize;

    return res;
}

function Position(x,y,z,horRot,verRot){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.horRot = horRot || 0;
    this.verRot = verRot || 0;

    this.add = function(pos){
        return new Position(this.x+x,this.y+y,this.z+z,this.horRot+horRot,this.verRot+verRot);
    }

    this.sub = function(pos){
        return new Position(this.x-x,this.y-y,this.z-z,this.horRot-horRot,this.verRot-verRot);
    }    

    this.apply = function(matrix){
        mat4.rotate(matrix, this.verRot, [1, 0, 0]);
        mat4.rotate(matrix, this.horRot, [0, 1, 0]);
        //we subtract the position of the origin
        mat4.translate(matrix, [-this.x, -this.y, -this.z]);
    }
}

function WebGL(canvas,r,g,b){
    this.textureCount = 0;

    //create model view matrix and perspective matrix
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    
    //init WebGL
    try {
        this.gl = canvas.getContext("experimental-webgl");
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!this.gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }

    //init shaders
    this.shader = initShaders(this.gl);

    //set the background color and enable depth test
    this.gl.clearColor(r/255.0, g/255.0, b/255.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);

    this.pos = new Position();

    this.elements = [];

    this.add = function(el){
        this.elements.push(el);
    }

    this.move = function(x,y,z){
        this.pos.x = x;this.pos.y = y;this.pos.z = z;
    }
}

WebGL.prototype.draw = function() {
    var gl = this.gl

    //clean current view
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //initialize the camera
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.01, 100.0, this.pMatrix);
    mat4.identity(this.mvMatrix);

    //apply transformations
    this.pos.apply(this.mvMatrix);

    //push the model-view and perspective matrices
    gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, this.pMatrix);
    gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, this.mvMatrix);

    //draw the elements
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].draw(this.gl,this.shader);
    };
};

WebGL.prototype.Texture = function(src){
    this.textureCount++;
    var that = this;

    return new Texture(this.gl,src,function(){
        that.textureCount--;
        if(that.textureCount == 0 && that.onReady)that.onReady();
    });
}

WebGL.prototype.Color = function(r,g,b){
    return new Color(this.gl,r,g,b);
}