function KeyManager(element){
    this.el = element;
    this.pressed = {};

    this.pos = new Position();
    this.clicked = false;
    this.rightClicked = false;


    var that = this;

    document.onkeydown = function(evt){
        console.log(evt.keyCode);

        switch(evt.keyCode){
            case 9://tab
                if(that.onTab)that.onTab();
                break;
            case 35://fine
                if(that.onSave)that.onSave();
                break;
            default:
                that.pressed[evt.keyCode] = true;
        }

        evt.stopPropagation();
        evt.preventDefault();
    }

    document.onkeyup = function(evt){
        that.pressed[evt.keyCode] = false;
        evt.stopPropagation();
        evt.preventDefault();
    }

    this.bind = function(el){
        this.el = el;

        if ("onpointerlockchange" in document) {
            document.addEventListener('pointerlockchange', this.onLockChange, false);
        } else if ("onmozpointerlockchange" in document) {
            document.addEventListener('mozpointerlockchange', this.onLockChange, false);
        } else if ("onwebkitpointerlockchange" in document) {
            document.addEventListener('webkitpointerlockchange', this.onLockChange, false);
        }

        this.el.addEventListener("mousemove", that.onMouse, false);
        this.el.addEventListener("click", that.onClick, false);

    }

    this.onLockChange = function(){
        if(document.pointerLockElement === that.el ||
          document.mozPointerLockElement === that.el ||
          document.webkitPointerLockElement === that.el) {
            console.log('Pointer Locked');
            that.el.addEventListener("mousemove", that.onMouse, false);
            that.el.addEventListener("click", that.onClick, false);
          } else {
            console.log('Pointer Unlocked');
            that.el.removeEventListener("mousemove", that.onMouse, false);
            that.el.removeEventListener("click", that.onClick, false);
          }        
    }

    this.unbind = function(){
        this.el.removeEventListener("mousemove", that.onMouse, false);
        this.pos.horRot = 0;
        this.pos.verRot = 0; 
    }

    this.onClick = function(e){
        if(e.path[0].id !== "label"){
            //console.log("click");
            if(e.which == 1){
                that.clicked = true;
            }
            if(e.which == 3){
                that.rightClicked = true;
            }
        }         
    }

    this.getClick = function(){
        if(this.clicked === true){
            this.clicked = false;
            return true;
        }
        return false;
    }

    this.getRightClick = function(){
        if(this.rightClicked === true){
            this.rightClicked = false;
            return true;
        }
        return false;
    }
    /*ctx.canvas.onclick = function(){
        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', that.pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', that.pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', that.pointerLockChange, false);

        ctx.canvas.requestPointerLock = ctx.canvas.requestPointerLock || ctx.canvas.mozRequestPointerLock || ctx.canvas.webkitRequestPointerLock;
        ctx.canvas.requestPointerLock();

    }

    this.pointerLockChange = function(e){
        if(document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement){//on lock
            document.addEventListener("mousemove", that.onMouse, false);
        }else{//on unlock
            document.removeEventListener("mousemove", that.onMouse, false);
            that.horSpeed = 0;
            that.verSpeed = 0;  
        }
    }*/

    this.onMouse = function(e){
        var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    
        that.pos.horRot += movementX/2000.0;
        that.pos.verRot += movementY/2000.0;

    }

    this.update = function(){

        //left/right or A/D
        //Right versor = (1,0,0)
        if(this.pressed[37] || this.pressed[65]){//left 
            this.pos.x = -0.005;
        }else if(this.pressed[39] || this.pressed[68]){//right
            this.pos.x = 0.005;
        }else{
            this.pos.x = 0;
        }

        //up/down or W/S
        //Forward versor = (0,0,-1)
        if(this.pressed[38] || this.pressed[87]){//Forward
            this.pos.z = -0.01;
        }else if(this.pressed[40] || this.pressed[83]){//Backt
            this.pos.z = 0.01;
        }else{
            this.pos.z = 0;
        }

        //T 84  G 71
        //Up versor = (0,1,0)
        if(this.pressed[84]){//Up
            this.pos.y = 0.03;
        }else if(this.pressed[71]){
            this.pos.y = -0.03;
        }else{
            this.pos.y = 0;
        }            
    }

    this.lastTime = 0;

    this.move = function(ctxPos){
        var timeNow = new Date().getTime();
        var res = new Position(ctxPos.x,ctxPos.y,ctxPos.z,ctxPos.horRot,ctxPos.verRot);

        if (this.lastTime != 0) {
            var elapsed = timeNow - this.lastTime;

            res.x = ctxPos.x + (Math.cos(ctxPos.horRot) * this.pos.x - Math.sin(ctxPos.horRot) * this.pos.z) * elapsed;
            res.y = ctxPos.y + this.pos.y;
            res.z = ctxPos.z + (Math.sin(ctxPos.horRot) * this.pos.x + Math.cos(ctxPos.horRot) * this.pos.z) * elapsed;

            res.verRot += this.pos.verRot;
            res.horRot += this.pos.horRot;

            this.pos.verRot = 0;
            this.pos.horRot = 0;

        }
        this.lastTime = timeNow;

        return res;
    }

}