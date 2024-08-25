var l = console.log.bind(window.console);
var canvas = document.querySelector("#scene"),
		ctx = canvas.getContext("2d"),
		particles = [],
		amount = 0,
		mouse = {x:0,y:0},
		radius = 20;

	var colors = ["#FFFFFF"];

	var copy = {
		text1: "ST",
		text2: "OR",
		text3: "Y"
	}

	var ww = canvas.width;
	var wh = canvas.height;

	function initScene(){
		ww = canvas.width;
		wh = canvas.height;

		ctx.font = "bold 240px sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(copy.text1, ww/2, 200);		
		ctx.fillText(copy.text2, ww/2, 400);
		ctx.fillText(copy.text3, ww/2, 600);

		// l(data)
		var data  = ctx.getImageData(0, 0, ww, wh).data;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = "screen";

		particles = [];
		for(var i=0;i<ww;i+=10){
			for(var j=0;j<wh;j+=10){
				if(data[ ((i + j*ww)*4) + 3] == 255){
					particles.push(new Particle(i,j));
				}
			}
		}
		amount = particles.length;
		
		// drawSearchLight(ww/2, wh/2, ctx);
		// drawHole(ww/2, wh/2);
	}

	// function drawText(ctx){				
	// 	ctx.font = "bold 240px sans-serif";
	// 	ctx.textAlign = "center";
	// 	ctx.fillText(copy.text1, ww/2, 200);		
	// 	ctx.fillText(copy.text2, ww/2, 400);
	// 	ctx.fillText(copy.text3, ww/2, 600);
	// }

	// function drawSearchLight(x, y){
 //    var radius = 100;
 //    ctx2.clearRect(0,0,canvas2.width, canvas2.height);
    
 //    // ctx2.fillStyle = 'rgba(0, 0, 0, 1)';

 //  //   ctx2.beginPath()
	// 	// ctx2.arc(x, y, 100,0,Math.PI*2, false); // outer (filled)
	// 	// ctx2.arc(x, y, 55,0,Math.PI*2, true); // outer (unfills it)
	// 	// ctx2.fill();

	// 	ctx2.save();
 //    ctx2.beginPath();
 //    ctx2.arc(x, y, radius, 0, 2 * Math.PI, false);
 //    ctx2.clip();

 //    // ctx2.fillStyle = '#FF0000';
 //    // ctx2.fillRect(0,0,canvas2.width, canvas2.height);
 //    var img = document.getElementById("bg");
 //    ctx2.drawImage(img, 0,0,canvas2.width, canvas2.height);

 //    // ctx2.beginPath();				
 //    // ctx2.globalCompositeOperation = "destination-out";
 //    // ctx2.arc(x, y, radius, 0, Math.PI * 2, false);
 //    // ctx2.fill();
 //    // ctx2.globalCompositeOperation = "source-over";
 //    // var grd = ctx2.createRadialGradient(x, y, 0, x, y, radius);
 //    // grd.addColorStop(0,"rgba(0, 0, 0, 0)");
 //    // grd.addColorStop(.6,"rgba(0, 0, 0, 0)");
 //    // grd.addColorStop(1,"rgba(0, 0, 0, 1)");
 //    // ctx2.arc(x, y, 10*radius, 0, Math.PI * 2, false);
 //    // ctx2.fillStyle = grd;
 //    // ctx2.arc(x, y, radius, 0, Math.PI * 2, false);
 //    // ctx2.fill();
 //    // ctx2.closePath();	

 //    // ctx2.fillStyle = 'rgba(0, 0, 0, 1)';
 //    // ctx2.fillStyle = '#FF0000';
 //    // ctx2.fillRect(0,0,canvas2.width, canvas2.height);
		
	// 	ctx2.restore();
 //    ctx2.beginPath();
 //    ctx2.arc(x, y, radius, 0, 2 * Math.PI, false);
 //  }

  function drawSearchLight(x, y, currCtx){
    var radius = 100;
    // currCtx.clearRect(0,0,canvas2.width, canvas2.height);
    currCtx.clearRect(0,0,ww, wh);
    
    // ctx2.fillStyle = 'rgba(0, 0, 0, 1)';

  //   ctx2.beginPath()
		// ctx2.arc(x, y, 100,0,Math.PI*2, false); // outer (filled)
		// ctx2.arc(x, y, 55,0,Math.PI*2, true); // outer (unfills it)
		// ctx2.fill();

		currCtx.save();
    currCtx.beginPath();
    currCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
    currCtx.clip();

    // ctx2.fillStyle = '#FF0000';
    // ctx2.fillRect(0,0,canvas2.width, canvas2.height);
    // var img = document.getElementById("bg");
    // currCtx.drawImage(img, 0,0,canvas2.width, canvas2.height);

    // ctx2.beginPath();				
    // ctx2.globalCompositeOperation = "destination-out";
    // ctx2.arc(x, y, radius, 0, Math.PI * 2, false);
    // ctx2.fill();
    // ctx2.globalCompositeOperation = "source-over";
    // var grd = ctx2.createRadialGradient(x, y, 0, x, y, radius);
    // grd.addColorStop(0,"rgba(0, 0, 0, 0)");
    // grd.addColorStop(.6,"rgba(0, 0, 0, 0)");
    // grd.addColorStop(1,"rgba(0, 0, 0, 1)");
    // ctx2.arc(x, y, 10*radius, 0, Math.PI * 2, false);
    // ctx2.fillStyle = grd;
    // ctx2.arc(x, y, radius, 0, Math.PI * 2, false);
    // ctx2.fill();
    // ctx2.closePath();	

    // ctx2.fillStyle = 'rgba(0, 0, 0, 1)';
    // ctx2.fillStyle = '#FF0000';
    // ctx2.fillRect(0,0,canvas2.width, canvas2.height);
		
		currCtx.restore();
    currCtx.beginPath();
    currCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
  }

  function drawClip(x, y){
    var radius = 100;
    // ctx.clearRect(0,0,ww, wh);
		ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.clip();

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0,0,ww, wh);

		ctx.restore();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  }

	function Particle(x,y){
		// this.x =  Math.random()*ww;
		// this.y =  Math.random()*wh;
		this.x = x;
		this.y = y;

		this.dest = {
			x : x,
			y: y
		};
		this.r =  .7;
		// this.r =  Math.random()*5 + 2;
		this.vx = (Math.random()-0.5)*2;
		this.vy = (Math.random()-0.5)*2;
		// this.vx = (Math.random()-0.5)*20;
		// this.vy = (Math.random()-0.5)*20;
		this.accX = 0;
		this.accY = 0;
		this.friction = Math.random()*0.05 + .8;
		// this.friction = Math.random()*0.05 + 0.94;

		this.color = colors[0];
		// this.color = colors[Math.floor(Math.random()*6)];
	}

	Particle.prototype.render = function() {
		this.accX = (this.dest.x - this.x)/100;
		this.accY = (this.dest.y - this.y)/100;
		this.vx += this.accX;
		this.vy += this.accY;
		this.vx *= this.friction;
		this.vy *= this.friction;

		this.x += this.vx;
		this.y +=  this.vy;

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
		ctx.fill();

		var a = this.x - mouse.x;
		var b = this.y - mouse.y;

		var distance = Math.sqrt( a*a + b*b );
		// l(distance)
		if(distance < radius){
			this.accX = (this.x - mouse.x)/10;
			this.accY = (this.y - mouse.y)/10;
			this.vx += this.accX;
			this.vy += this.accY;
		}
	}

	function onMouseMove(e){
		// l(e)
		mouse.x = e.offsetX;
		mouse.y = e.offsetY;
		// drawSearchLight(mouse.x, mouse.y, ctx);
	}

	// function onTouchMove(e){
 //    if(e.touches.length > 0 ){
 //      mouse.x = e.touches[0].clientX;
 //      mouse.y = e.touches[0].clientY;
 //    }
	// }

	// function onTouchEnd(e){
	//   mouse.x = -9999;
	//   mouse.y = -9999;
	// }

	// function onMouseClick(){
	// 	radius++;
	// 	if(radius ===5){
	// 		radius = 0;
	// 	}
	// }

	function render(a) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// drawText(ctx2);    
		// drawClip(mouse.x, mouse.y);

		for (var i = 0; i < amount; i++) {
			particles[i].render();
		}
		requestAnimationFrame(render);
	}

	// copy.addEventListener("keyup", initScene);
	// window.addEventListener("resize", initScene);
	canvas.addEventListener("mousemove", onMouseMove);
	// canvas2.addEventListener("mousemove", onMouseMove);
	// window.addEventListener("touchmove", onTouchMove);
	// window.addEventListener("click", onMouseClick);
	// window.addEventListener("touchend", onTouchEnd);
	initScene();
	render();
	// requestAnimationFrame();

  

  // textArr.forEach(function(obj){
  //   var text = new PIXI.Text(obj.value, new PIXI.TextStyle({
  //     fontSize: "272px",
  //     fontFamily: "trojan",
  //     fill: "#fff"
  //   }));
  //   text.name = obj.value;
  //   text.anchor.set(0.5);     
  //   text.position.set(obj.x, obj.y);
  //   // pixiApp.stage.addChild(text);
  //   // text.crossGrArr = [];

  //   // obj.crosses.forEach(function(currText){      
  //   //   var img = new PIXI.Sprite( new PIXI.Texture.fromImage("img/cross.png") );
  //   //   img.width = 20;
  //   //   img.height = 30;
  //   //   img.anchor.set(0.5);
  //   //   img.rotation = currText.r;
  //   //   img.x = currText.x;
  //   //   img.y = currText.y;
  //   //   pixiApp.stage.addChild(img);
  //   //   text.crossGrArr.push(img);
  //   // })
  //     // particles.push(new Particle(i,j));
  //     // for(var j=0;j<wh;j+=5){
  //     //   if(data[ ((i + j*ww)*4) + 3] == 255){
  //     //   }
  //     // }

  //   text.interactive = true;
  //   text.mouseover = function(e){
  //     l("Mouse over", this)
  //     // for (var i = 0; i < amount; i++) {
  //     //   particles[i].r = .7;
  //     // }
  //     TweenMax.to(this, .5, { alpha: 0 })
  //     // TweenMax.to("#scene2", 1, { opacity: 1 })
  //   }
  //   text.mouseout = function(e){
  //     l("Mouse out", this)
  //     // for (var i = 0; i < amount; i++) {
  //     //   particles[i].r = 0;
  //     // }
  //     TweenMax.to(this, 1, { alpha: 1 })
  //     // TweenMax.to("#scene2", .5, { opacity: 0 })
  //   }
  // })

  
// function drawHole(x, y){
//   var radius = 70;
//   ctx.clearRect(0,0,canvas.width, canvas.height);
  
//   // ctx.fillStyle = '#FFFF00';
//   // ctx.fillRect(0,0,canvas.width, canvas.height);

//   if(typeof imgSrc !== "undefined")
//       ctx.drawImage(imgSrc, 0,0,canvas.width, canvas.height);

//   ctx.beginPath();                
//   ctx.globalCompositeOperation = "destination-out";
//   ctx.arc(x, y, radius, 0, Math.PI * 2, false);
//   ctx.fill();
//   ctx.globalCompositeOperation = "source-over";

//   // To include gradient
//   // var grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
//   // grd.addColorStop(0,"rgba(0, 0, 0, 0)");
//   // grd.addColorStop(1,"rgba(0, 0, 0, 1)");
//   // ctx.arc(x, y, 2*radius, 0, Math.PI * 2, false);
//   // ctx.fillStyle = grd;
//   // ctx.arc(x, y, radius, 0, Math.PI * 2, false);
//   // ctx.fill();
//   ctx.closePath();
// }