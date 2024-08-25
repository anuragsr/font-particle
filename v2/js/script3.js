var l = console.log.bind(window.console);
var canvas = document.getElementById("scene")
, ctx = canvas.getContext("2d")
, ww = canvas.width
, wh = canvas.height
, mouse = {x:0, y:0}
, textArr = [
    { value: "S", x: 155, y: 115, ctxX: 80, ctxY: 210 - 2},
    { value: "T", x: 325, y: 235, ctxX: 230, ctxY: 325 },
    { value: "O", x: 115, y: 355, ctxX: -10, ctxY: 450 - 2},
    { value: "R", x: 325, y: 470, ctxX: 222, ctxY: 565 - 2},
    { value: "Y", x: 95, y: 590, ctxX: 5, ctxY: 680 - 2},
  ]
, colors = ["#FFFFFF"]
, mouseRadius = 30
, pixiApp = new PIXI.Application( canvas.width, canvas.height, {
    transparent:true,
    antialias: true
  })
, textGrArr = []
, imgScale = 1.5
, animArr = []
, currText
, animDist = 20
;

function initText(){

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
      currText = this;
      l("Mouse over", this.name)
      TweenMax.to(this, .5, { alpha: 0 });
      this.crosses.forEach(function(c){
        TweenMax.to(c, .5, { alpha: .7 });
      })
    }
    text.mouseout = function(e){
      // currText = this;
      l("Mouse out", this.name)
      TweenMax.to(this, 1, { alpha: 1 })
      this.crosses.forEach(function(c){
        TweenMax.to(c, .5, { 
          alpha: 0,
          x: c.origX,
          y: c.origY,
          rotation: c.origR
        });
      })
    }

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

  l(textGrArr)
  pixiApp.ticker.add(render);

  var textThe = new PIXI.Text("the", new PIXI.TextStyle({
    fontSize: "28px",
    fontVariant: "small-caps",
    fontFamily: "trojan",
    fill: "#fff"
  }));
  textThe.anchor.set(0.5);     
  textThe.position.set(60, 100);
  pixiApp.stage.addChild(textThe);
}

function Particle(x, y){
  // this.x =  Math.random()*ww;
  // this.y =  Math.random()*wh;
  this.x = x;
  this.y = y;

  this.dest = {
      x : x,
      y: y
  };
  // this.r =  0;
  this.r =  .5;
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

  ctx.fillStyle = this.color;
  ctx.beginPath();
  // ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
  ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
  ctx.fill();

  var a = this.x - mouse.x;
  var b = this.y - mouse.y;

  var distance = Math.sqrt( a*a + b*b );
  // l(distance)
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
  for(var i=0;i<ww;i+=10){
    for(var j=0;j<wh;j+=10){
      if(data[ ((i + j*ww)*4) + 3] == 255){
        var img = new PIXI.Sprite( new PIXI.Texture.fromImage("img/cross.png") );
        // img.alpha = .7;
        img.alpha = 0;
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
        pixiApp.stage.addChild(img);
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

function onMouseMove(e){
  // l(e)
  var x = e.offsetX;
  var y = e.offsetY;
  
  mouse.x = x;
  mouse.y = y;

  animArr = getClosest(x, y, 5, currText);
  // l(animArr)

  TweenMax.staggerTo(animArr, 1, {
    cycle:{
      ease: [Back.easeOut, Back.easeOut, Back.easeOut],
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
    // .filter(function(obj){
    //   return !obj.marked;
    // })
    .filter(function(obj){
      obj.dist = getDistance(x, y, obj.x, obj.y);
      return obj;
    })
    .sort(function(a,b) {
      return a.dist - b.dist;
    })
    .forEach(function(x, i){
      if(i < n && x.dist < mouseRadius){
        // x.marked = true;
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
    pixiApp.view.style.position  = "absolute";
    pixiApp.view.style.top = pixiApp.view.style.left = 0;
    pixiApp.view.style.zIndex = 2;
    pixiApp.view.style.opacity = 1;
    document.querySelector(".wrapper").append(pixiApp.view);      
    pixiApp.view.addEventListener("mousemove", onMouseMove);
    
    initText();  
  }
});

