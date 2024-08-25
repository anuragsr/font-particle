var l = console.log.bind(window.console);
var /*canvas = document.getElementById('scene')
, ctx = canvas.getContext('2d')
,*/ canvas2 = document.getElementById("scene2")
, ctx2 = canvas2.getContext("2d")
, ww = canvas2.width
, wh = canvas2.height
, mouse = {x:0, y:0}
, img = new Image()
, textArr = [
    { value: "S", x: 155, y: 115 },
    { value: "T", x: 325, y: 235 },
    { value: "O", x: 115, y: 355 },
    { value: "R", x: 325, y: 470 },
    { value: "Y", x: 95, y: 590 },
  ]
, colors = ["#FFFFFF"]
, bgImg = "img/design.png"
, particles = []
, amount = 0
, mouseRadius = 30
, imgSrc
, pixiApp = new PIXI.Application( canvas2.width, canvas2.height, {
    transparent:true,
    antialias: true
  })
;

function initText(){
  ctx2.font = "272px trojan";
  ctx2.fillStyle = '#FFFF00';
  ctx2.fillText(textArr[0].value, 80, 210);        
  ctx2.fillText(textArr[1].value, 230, 325);
  ctx2.fillText(textArr[2].value, -10, 450);
  ctx2.fillText(textArr[3].value, 222, 565);
  ctx2.fillText(textArr[4].value, 5, 685);

  pixiApp.view.style.position  = "absolute";
  pixiApp.view.style.top = pixiApp.view.style.left = 0;
  pixiApp.view.style.zIndex = 2;
  pixiApp.view.style.opacity = 1;
  document.querySelector(".wrapper").append(pixiApp.view);      
  
  pixiApp.view.addEventListener("mousemove", onMouseMove);

  textArr.forEach(function(obj){
    var text = new PIXI.Text(obj.value, new PIXI.TextStyle({
      fontSize: "272px",
      fontFamily: "trojan",
      fill: "#fff"
    }));
    text.name = obj.value;
    text.anchor.set(0.5);     
    text.position.set(obj.x, obj.y);
    pixiApp.stage.addChild(text);

    text.interactive = true;
    text.mouseover = function(e){
      l("Mouse over", this.name)
      // for (var i = 0; i < amount; i++) {
      //   particles[i].r = .7;
      // }
      TweenMax.to(this, .5, { alpha: 0 })
      // TweenMax.to("#scene2", 1, { opacity: 1 })
    }
    text.mouseout = function(e){
      l("Mouse out", this.name)
      // for (var i = 0; i < amount; i++) {
      //   particles[i].r = 0;
      // }
      TweenMax.to(this, 1, { alpha: 1 })
      // TweenMax.to("#scene2", .5, { opacity: 0 })
    }
  })
}

function drawHole(x, y){
  var radius = 70;
  ctx.clearRect(0,0,canvas.width, canvas.height);
  
  // ctx.fillStyle = '#FFFF00';
  // ctx.fillRect(0,0,canvas.width, canvas.height);

  if(typeof imgSrc !== "undefined")
      ctx.drawImage(imgSrc, 0,0,canvas.width, canvas.height);

  ctx.beginPath();                
  ctx.globalCompositeOperation = "destination-out";
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  // To include gradient
  // var grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
  // grd.addColorStop(0,"rgba(0, 0, 0, 0)");
  // grd.addColorStop(1,"rgba(0, 0, 0, 1)");
  // ctx.arc(x, y, 2*radius, 0, Math.PI * 2, false);
  // ctx.fillStyle = grd;
  // ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  // ctx.fill();
  ctx.closePath();
}

// class Dot extends PIXI.Graphics {
//   constructor(r, f) {
//     super();
//     this.r = r;
//     if(f != null){
//       this.fill = f;
//     }else{
//       this.fill = .1;
//     }
//     // this.vX = vX;
//     // this.vY = vY;
//     this.draw();
//   }  

//   draw() {
//     this
//     .beginFill(0xFFFFFF, this.fill)
//     .drawCircle(this.x, this.y, this.r)
//     .endFill()
//   }
// }

function Particle(x,y){
  // this.x =  Math.random()*ww;
  // this.y =  Math.random()*wh;
  this.x = x;
  this.y = y;

  this.dest = {
      x : x,
      y: y
  };
  // this.r =  0;
  this.r =  .7;
  // this.r =  Math.random()*5 + 2;
  this.vx = (Math.random()-0.5)*2;
  this.vy = (Math.random()-0.5)*2;

  this.vx = 0;
  this.vy = 0;
  // this.vx = (Math.random()-0.5)*20;
  // this.vy = (Math.random()-0.5)*20;
  this.accX = 0;
  this.accY = 0;
  this.friction = Math.random()*0.05 + .6;
  // this.friction = .2;
  // this.friction = Math.random()*0.05 + 0.94;

  this.color = colors[0];
  // this.color = colors[Math.floor(Math.random()*6)];
}

Particle.prototype.render = function() {
  this.accX = (this.dest.x - this.x)/10;
  this.accY = (this.dest.y - this.y)/10;
  this.vx += this.accX;
  this.vy += this.accY;
  this.vx *= this.friction;
  this.vy *= this.friction;

  this.x += this.vx;
  this.y +=  this.vy;

  ctx2.fillStyle = this.color;
  ctx2.beginPath();
  // ctx2.arc(this.x, this.y, this.r, Math.PI * 2, false);
  ctx2.arc(this.x, this.y, this.r, Math.PI * 2, false);
  ctx2.fill();

  var a = this.x - mouse.x;
  var b = this.y - mouse.y;

  var distance = Math.sqrt( a*a + b*b );
  // l(distance)
  if(distance < mouseRadius){
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
  // drawHole(mouse.x, mouse.y);
}

function initParticles(){
  var data  = ctx2.getImageData(0, 0, ww, wh).data;
  ctx2.clearRect(0, 0, ww, wh);
  ctx2.globalCompositeOperation = "screen";

  particles = [];
  for(var i=0;i<ww;i+=5){
      for(var j=0;j<wh;j+=5){
          if(data[ ((i + j*ww)*4) + 3] == 255){
              particles.push(new Particle(i,j));
          }
      }
  }
  amount = particles.length;
  render();
}

function render(a){
  ctx2.clearRect(0, 0, ww, wh);
  for (var i = 0; i < amount; i++) {
    particles[i].render();
  }
  requestAnimationFrame(render);
}


WebFont.load({
  custom: {
    families: ['trojan']
  },
  active: function(){
    l("font loaded")
    
    img.src = bgImg;
    img.onload = function(e){
      imgSrc = e.target;
      // ctx.drawImage(imgSrc, 0,0, canvas.width, canvas.height);
      // drawHole(100, 100);

      initText();
      initParticles();
    }
  }
});

