function Texture(gl,src,cb){
    var that = this;
    var res = gl.createTexture();

    res.image = new Image();
    res.image.onload = function () {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, res);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, res.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //create lower resolution textures for better rescaling
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);

        if(cb)cb(that);
    }

    res.image.src = src;
    this.res = res;

    this.push = function(gl,shader){
        //use texture #0
        gl.activeTexture(gl.TEXTURE0);
        //set #0 to my texture
        gl.bindTexture(gl.TEXTURE_2D, this.res);
        //tell to use texture #0
        gl.uniform1i(shader.samplerUniform,0);
    }
}

function Color(gl,r,g,b){
    this.res = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.res);
    var colorPixel = new Uint8Array([r, g, b, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, colorPixel);

    //use fastest rescaling method
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    this.push = function(gl,shader){
        //use texture #0
        gl.activeTexture(gl.TEXTURE0);
        //set #0 to my texture
        gl.bindTexture(gl.TEXTURE_2D, this.res);
        //tell to use texture #0
        gl.uniform1i(shader.samplerUniform,0);       
    }
}