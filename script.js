// Javascript Based Minesweeper

function setup(width, height) {
	Window.bombCount = 0;
	Window.a = createArray(width, height);
	Window.width = width;
	Window.height = height;
	printArray();
	Window.blankCount = width*height - Window.bombCount;
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
		    if (this.innerHTML == "") {
				// console.log("abs-pos = " + this.z 
				// + " x-pos = " + this.x
				// + " y-pos = " + this.y);
				if(Window.a[this.y][this.x] == "b") {
					alert("bombed");
					location.reload();
				} else {
					this.zeroTest();
				}
				if(Window.count == Window.blankCount) {
					alert("You won!");
				}
			}
			var hit = Window.zArray.filter( el => !isNaN(parseInt(el.innerHTML))).length;
			if(hit == Window.blankCount) {
				alert("chicken dindins");
			}
		});
		this.addEventListener('contextmenu', function(event) { 
			event.preventDefault();
			if (!this.innerHTML) {
				this.innerHTML = "\u2690";
			} else if(this.innerHTML == "\u2690") {
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
		var bombs = get(this).filter(el => Window.a[el.y][el.x] == "b").length;
		if(bombs != 0) {
			this.innerHTML = bombs;
		} else if(Window.a[this.y][this.x] != '0' && !parseInt(this.innerHTML)) {
			Window.a[this.y][this.x] = '0';
			this.innerHTML = 0;
			var ess = get(this);
			ess.forEach(function(element) {
				console.log(element);
				if(element) {
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
			if(Math.random() <= 0.85) {
				x.push(" ");
			} else {
				x.push("b");
				Window.bombCount++;
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

function get(Box) {
	var zArray = Window.zArray;
	var w = Window.width;
	var h = Window.height;
	var x = Box.x;
	var y = Box.y;
	var z = Box.z;

	Window.s = [];
	function getNorth() {
		if(y != 0) {
			Window.s.push(zArray[z-w]);
		}
	}
	getNorth();
	function getNorthEast() {
		if(x != w-1 && y != 0) {
			Window.s.push(zArray[z-w+1]);
		}
	}
	getNorthEast(); 
	function getEast() {
		if(x != w-1) {
			Window.s.push(zArray[z+1]);
		}
	}
	getEast();
	function getSouthEast() {
		if(x != w-1 && y != h-1) {
			Window.s.push(zArray[z+w+1]);
		}
	}
	getSouthEast();
	function getSouth() {
		if(y != h-1) {
			Window.s.push(zArray[z+w]);
		}
	}
	getSouth();
	function getSouthWest() {
		if(x != 0 && y != h-1) {
			Window.s.push(zArray[z+w-1]);
		}
	}
	getSouthWest();
	function getWest() {
		if(x != 0) {
			Window.s.push(zArray[z-1]);
		}
	}
	getWest();
	function getNorthWest() {
		if(x != 0 && y != 0) {
			Window.s.push(zArray[z-w-1]);
		}
	}
	getNorthWest();
	return Window.s;
}