var l = console.log.bind(window.console);
var middleCanvas = document.getElementById("ctn-particles")
, ctx = middleCanvas.getContext("2d")
, ww = middleCanvas.width
, wh = middleCanvas.height
, bottomCanvas = new PIXI.Application( middleCanvas.width, middleCanvas.height, {
    transparent:true,
  })
, topCanvas = new PIXI.Application( middleCanvas.width, middleCanvas.height, {
    transparent:true,
  })
, mouse = {x:0, y:0}
, textArr = [
    { value: "S", x: 155, y: 115, ctxX: 80, ctxY: 210 - 2},
    { value: "T", x: 325, y: 235, ctxX: 230, ctxY: 325 },
    { value: "O", x: 115, y: 355, ctxX: -10, ctxY: 450 - 2},
    { value: "R", x: 325, y: 470, ctxX: 222, ctxY: 565 - 2},
    { value: "Y", x: 95, y: 590, ctxX: 5, ctxY: 685},
  ]
, colors = ["rgba(255, 255, 255, 0)"]
, mouseRadius = 30
, textGrArr = []
, imgScale = 1.5
, animArr = []
, currText
, animDist = 20
;

// Circle to mask top layer containing crosses
var topCirc = new PIXI.Graphics();
topCirc
.beginFill(0x000000, 1)
.drawCircle(0, 0, 50)
// topCirc.position.set(10, 10);

// Circle to clip the bottom layer
var bottomCirc = new PIXI.Graphics();
bottomCirc
.beginFill(0x000000, 1)
.drawCircle(0, 0, 50)
// bottomCirc.position.set(10, 10);

bottomCirc.blendMode = PIXI.BLEND_MODES["DIFFERENCE"];

function initText(){

  var bg = new PIXI.Sprite( new PIXI.Texture.fromImage("img/design-tr.png") );
  bg.width = ww;
  bg.height = wh;
  bottomCanvas.stage.addChild(bg);

  textArr.forEach(function(obj){

    // Adding text to top layer with transparency
    var text = new PIXI.Text(obj.value, new PIXI.TextStyle({
      fontSize: "272px",
      fontFamily: "trojan",
      fill: "#fff"
    }));
    text.name = obj.value;
    text.anchor.set(0.5);
    text.alpha = 0;
    text.position.set(obj.x, obj.y);

    topCanvas.stage.addChild(text);

    // Text interactions
    text.interactive = true;
    text.mouseover = function(e){
      currText = this;
      // l("Mouse over", this.name)
      // TweenMax.to(this, .5, { alpha: 0 });
      this.particles.forEach(function(p){
        TweenMax.to(p, .5, { color: "rgba(255, 255, 255, 1)" });
      })

      // this.crosses.forEach(function(c){
      //   // TweenMax.to(c, .5, { alpha: .7 });
      // })
    }
    text.mouseout = function(e){
      // l("Mouse out", this.name)
      // TweenMax.to(this, 1, { alpha: 1 })
      
      this.particles.forEach(function(p){
        TweenMax.to(p, .5, { color: "rgba(255, 255, 255, 0)" });
      })

      this.crosses.forEach(function(c){
        TweenMax.to(c, .5, { 
          // alpha: 0,
          x: c.origX,
          y: c.origY,
          rotation: c.origR
        });
      })
    }

    // Adding particles to middle layer, crosses to top layer
    ctx.font = "272px trojan";
    // ctx.fillStyle = '#FFFF00';
    ctx.clearRect(0, 0, ww, wh);
    ctx.fillText(obj.value, obj.ctxX, obj.ctxY);
    ctx.globalCompositeOperation = "screen";
    var data = ctx.getImageData(0, 0, ww, wh).data;
    text.particles = initParticles(data);    
    text.crosses = initCrosses(data);    
    textGrArr.push(text);

  })

  // l(textGrArr)
  document.querySelector(".the").style.opacity = 1;

  bottomCanvas.ticker.add(render);

  topCanvas.stage.addChild(topCirc);
  bottomCanvas.stage.addChild(bottomCirc);

}

function Particle(x, y){
  this.x = x;
  this.y = y;

  this.dest = {
    x : x,
    y: y
  }

  this.r =  .5;
  this.vx = 0;
  this.vy = 0;
  this.accX = 0;
  this.accY = 0;
  this.friction = Math.random()*0.05 + .6;
  this.color = colors[0];
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

  ctx.fillStyle = this.color;  
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
  ctx.fill();

  var a = this.x - mouse.x;
  var b = this.y - mouse.y;

  var distance = Math.sqrt( a*a + b*b );
  if(distance < mouseRadius){
    this.accX = (this.x - mouse.x)/3;
    this.accY = (this.y - mouse.y)/3;
    this.vx += this.accX;
    this.vy += this.accY;
  }
}

function initParticles(data){
  var particles = [];
  for(var i=0;i<ww;i+=4){
    for(var j=0;j<wh;j+=4){
      if(data[ ((i + j*ww)*4) + 3] == 255){
        particles.push(new Particle(i , j));
      }
    }
  }  

  return particles;
}

function initCrosses(data){
  var crosses = [];
  for(var i=0;i<ww;i+=15){
    for(var j=0;j<wh;j+=15){
      if(data[ ((i + j*ww)*4) + 3] == 255){
        var img = new PIXI.Sprite( new PIXI.Texture.fromImage("img/cross.png") );
        img.alpha = .7;
        // img.alpha = 0;
        img.width = 10*imgScale;
        img.height = 15*imgScale;
        img.anchor.set(0.5);
        // img.rotation = Math.random()*(1 - -1);
        var r = getRandom(0, 2*Math.PI);
        img.x = i;
        img.y = j;
        img.rotation = r;
        img.origX = JSON.parse(JSON.stringify(i));
        img.origY = JSON.parse(JSON.stringify(j));
        img.origR = JSON.parse(JSON.stringify(r));
        img.mask = topCirc;

        topCanvas.stage.addChild(img);
        crosses.push(img);
      }
    }
  }

  return crosses;
}

function render(a){
  ctx.clearRect(0, 0, ww, wh);

  textGrArr.forEach(function(obj){
    obj.particles.forEach(function(p){
      p.render();
    })
  })
}

function drawPixiHole(){
  var x = mouse.x;
  var y = mouse.y;
  topCirc.position.set(x, y);
  bottomCirc.position.set(x, y);
}

function onMouseLeave(e){
  mouse.x = -100;
  mouse.y = -100;
  drawPixiHole();
}

function onMouseMove(e){
  var x = e.offsetX;
  var y = e.offsetY;
  
  mouse.x = x;
  mouse.y = y;

  drawPixiHole(x, y)
  animArr = getClosest(x, y, 5, currText);
  // l(animArr)

  TweenMax.staggerTo(animArr, 1, {
    cycle:{
      ease: [Back.easeOut],
      x: function(key, target){
        return target.origX + getRandom(-1*animDist, 1*animDist);
        // return target.x + getRandom(-1*animDist, 1*animDist);
      },
      y: function(key, target){
        return target.origY + getRandom(-1*animDist, 1*animDist);
        // return target.y + getRandom(-1*animDist, 1*animDist);
      },
      rotation: function(key, target){
        return target.origR + getRandom(-0.02, 0.02);
        // return target.rotation + getRandom(-0.02, 0.02);
      }
    },
    repeat: -1,
    yoyo: true,
  })
}

function getRandom(min, max){
    return Math.random()*(max-min+1)+min;
}

function getDistance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function getClosest(x, y, n, currText){
  var ret = [];

  if(currText){  
    currText.crosses
    .filter(function(obj){
      obj.dist = getDistance(x, y, obj.x, obj.y);
      return obj;
    })
    .sort(function(a,b) {
      return a.dist - b.dist;
    })
    .forEach(function(x, i){
      if(i < n && x.dist < mouseRadius){
        ret.push(x);
      }
    })
  }
  
  return ret;
}

WebFont.load({
  custom: {
    families: ['trojan']
  },
  active: function(){
    // l("font loaded")
    bottomCanvas.view.style.position  = "absolute";
    bottomCanvas.view.style.top = bottomCanvas.view.style.left = 0;
    bottomCanvas.view.style.zIndex = 1;
    // bottomCanvas.view.style.opacity = 1;
    document.querySelector(".wrapper").append(bottomCanvas.view);      
    
    topCanvas.view.style.position  = "absolute";
    topCanvas.view.style.top = topCanvas.view.style.left = 0;
    topCanvas.view.style.zIndex = 3;
    // topCanvas.view.style.opacity = 1;
    document.querySelector(".wrapper").append(topCanvas.view);      
    
    topCanvas.view.addEventListener("mousemove", onMouseMove);
    topCanvas.view.addEventListener("mouseleave", onMouseLeave);
    
    initText();
  }
});

