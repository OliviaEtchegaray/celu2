let mic, amplitude, stars = [], mobileAlertShown=false;
let isMobile = /Mobi|Android/i.test(navigator.userAgent);

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  mic = new p5.AudioIn();
  mic.start();
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);

  if(isMobile && !mobileAlertShown){
    alert("Tocá la pantalla y hablá para activar el confesionario.");
    mobileAlertShown = true;
  }

  textFont('Arial');textSize(24);fill(255,0,0);textAlign(CENTER,CENTER);
  text("Hablá tu secreto...", width/2, height/2);
}

function draw() {
  background(0,50);

  let level = amplitude.getLevel();
  let nStars = floor(level * 1000);

  for(let i=0;i<nStars;i++){
    let s = {x:random(width),y:random(height),outer:random(10,30),inner:random(5,15),spikes:5};
    stars.push(s);
  }

  for(let s of stars){
    drawStar(s.x,s.y,s.spikes,s.outer,s.inner);
  }

  if(isMobile){
    textSize(32);fill(255,0,0);textAlign(RIGHT,BOTTOM);
    text("@estrella_", width-10,height-10);
  }

  if(stars.length>500){stars.splice(0,stars.length-500);}
}

function drawStar(cx,cy,spikes,outer,inner){
  let angle = TWO_PI/spikes;
  let halfAngle = angle/2;
  beginShape();
  noFill();
  stroke(255,0,0);strokeWeight(2);
  for(let a=0;a<TWO_PI;a+=angle){
    let sx = cx + cos(a)*outer;
    let sy = cy + sin(a)*outer;
    vertex(sx,sy);
    sx = cx + cos(a+halfAngle)*inner;
    sy = cy + sin(a+halfAngle)*inner;
    vertex(sx,sy);
  }
  endShape(CLOSE);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
