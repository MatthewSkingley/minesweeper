// Javascript Based Minesweeper

function setup(width, height) {
	Window.a = createArray(width, height);
	Window.width = width;
	Window.height = height;
	printArray();
}

function dispBox(feature) {
	var box = document.createElement("div");
	box.className = "dispBox";
	if(feature == "b"){
		box.style.background = "black";
	} else {
		box.style.background = "white";
	}
	return box;
}

class Box extends HTMLElement {
	constructor(cell) {
		super();
		this.coordinates = null;
		this.addEventListener("click", function(event) {
			console.log("abs-pos = " + this.z 
			+ " x-pos = " + this.x
			+ " y-pos = " + this.y);
			if(Window.a[this.y][this.x] == "b") {
				alert("bombed");
				location.reload();
			} else {
				this.zeroTest();
			}
		});
		this.addEventListener('contextmenu', function(event) { 
			event.preventDefault();
			if (this.innerHTML != "\u2690") {
				this.innerHTML = "\u2690";
			} else {
				this.innerHTML = null;
			}
			return false;
		}, false);
	}

	initialise() {
		var nodes = this.parentNode.children;
		var zArray = Array.prototype.slice.call(nodes);
		function isCell(value) {
			if (value.outerHTML != "<br>") {
				return value;
			}
		}
		Window.zArray = zArray.filter(isCell);
		this.z = Window.zArray.indexOf(this);
		this.x = this.z % Window.width;
		this.y = Math.floor(this.z / Window.width);
	}

	zeroTest() {
		var bombs = get(this).filter(cell => cell == "b").length;
		if(bombs != 0) {
			this.innerHTML = bombs;
		} else if(Window.a[this.y][this.x] != '0') {
			Window.a[this.y][this.x] = '0';
			this.innerHTML = 0;
			var zArray = Window.zArray;
			var w = Window.width;
			var h = Window.height;
			var x = this.x;
			var y = this.y;
			var z = this.z;

			Window.s = [];
			function getNorth() {
				if(y != 0) {
					return zArray[z-w];
				}
			}
			Window.s.push(getNorth());
			function getNorthEast() {
				if(x != w-1 && y != 0) {
					return zArray[z-w+1];
				}
			} 
			Window.s.push(getNorthEast());
			function getEast() {
				if(x != w-1) {
					return zArray[z+1];
				}
			}
			Window.s.push(getEast());
			function getSouthEast() {
				if(x != w-1 && y != h-1) {
					return zArray[z+w+1];
				}
			}
			Window.s.push(getSouthEast());
			function getSouth() {
				if(y != h-1) {
					return zArray[z+w];
				}
			}
			Window.s.push(getSouth());
			function getSouthWest() {
				if(x != 0 && y != h-1) {
					return zArray[z+w-1];
				}
			}
			Window.s.push(getSouthWest());
			function getWest() {
				if(x != 0) {
					return zArray[z-1];
				}
			}
			Window.s.push(getWest());
			function getNorthWest() {
				if(x != 0 && y != 0) {
					return zArray[z-w-1];
				}
			}
			Window.s.push(getNorthWest());
			Window.s.forEach(function(element) {
				console.log(element);
				if(element) {
					console.log("true");
					element.zeroTest();
				}
			});
		}
	}
}
customElements.define('minefield-box', Box);


function createArray(width, height) {
	var a = [];
	function createX(width){
		var x = [];
		for(var i = 0; i < width; i++) {
			if(Math.random() <= 0.9) {
				x.push(" ");
			} else {
				x.push("b");
			}
		}
	return x;	
	}
	for(var i = 0; i < height; i++) {
		a.push(new createX(width));
	}
	return a;
}

function printArray() {
	var dispContainer = document.getElementById("dispContainer");
	var container = document.getElementById("container");
	Window.a.forEach(function(row){
		console.log(row);
		row.forEach(function(cell){
			dispContainer.appendChild(dispBox(cell));
			box = new Box(cell);
			container.appendChild(box);
			box.initialise();
		});
		dispContainer.appendChild(document.createElement("br"));
		container.appendChild(document.createElement("br"));
	});
}

function get(cell) {
	var y = cell.y;
	var x = cell.x;
	var a = Window.a;
	var s = [];
	try{s.push(a[y-1][x-1]	); } catch(ignore){}
	try{s.push(a[y-1][x]		); } catch(ignore){}
	try{s.push(a[y-1][x+1]	); } catch(ignore){}
	try{s.push(a[y]	[x-1]	); } catch(ignore){}
	try{s.push(a[y]	[x+1]	); } catch(ignore){}
	try{s.push(a[y+1][x-1]	); } catch(ignore){}
	try{s.push(a[y+1][x]		); } catch(ignore){}
	try{s.push(a[y+1][x+1]	); } catch(ignore){}
	return s;
}