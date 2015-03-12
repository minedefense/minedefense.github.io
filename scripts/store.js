function StoreItem(imageUrl,name,price,Class,cb){
	this.el = document.createElement("div");
	this.name = name;
	this.price = price;
	this.cb = cb;
	this.Class = Class;

	this.el.className = "item";
	var img = document.createElement("img");
	img.src = imageUrl;
	var label = document.createElement("label");
	label.innerHTML = name;
	this.el.appendChild(img);
	this.el.appendChild(label);

	var that = this;

	this.el.onclick = function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		that.cb(that.name,that.price,that.Class);
	}
}

function Store(el,moneyLabel,money,parent){
	this.el = el;
	this.moneyLabel = moneyLabel;
	this.money = money;
	this.parent = parent;

	this.items = [];

	this.moneyLabel.innerHTML = money;

	var that = this;

	this.addItem = function(imageUrl,name,price,Class){
		var it = new StoreItem(imageUrl,name,price,Class,function(n,p,c){that.hide();that.startBuying(n,p,c)});
		this.el.appendChild(it.el);
		this.items.push(it);
	}

	this.show = function(){
		console.log("show store");

		this.el.style.display = "block";
		document.exitPointerLock();
	}

	this.hide = function(){
		this.el.style.display = "none";
		document.body.requestPointerLock();		
	}

	this.startBuying = function(name,price,Class){
		var that = this;
		this.parent.setCursor(Class,function(){return that.onBuy(name,price,Class);});
	}

	this.onBuy = function(name,price,Class){
		if(this.money >= price){
			console.log("Buying "+name+" for "+price);		
			
			this.money -= price;
			this.moneyLabel.innerHTML = this.money;
		
			var that = this;
			this.parent.setCursor(Class,function(){return that.onBuy(name,price,Class);});
			return this.money >= price;
		}
		return false;
	}
}