let mic, fft;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  background(0);
}

function draw() {
  // Fondo negro con rastro
  background(0, 30);
  
  // Datos de audio
  let spectrum = fft.analyze();
  let amp = mic.getLevel();
  let avgFreq = fft.getEnergy("mid"); // energía media
  
  // Patrón de pulso central
  stroke(255, 0, 0);
  strokeWeight(2);
  let y = map(amp, 0, 1, height, 0);
  line(width/2, height, width/2, y);
  
  // Patrón de ondas
  noFill();
  beginShape();
  stroke(255);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let y = map(spectrum[i], 0, 255, height, 0);
    vertex(x, y);
  }
  endShape();
  
  // Patrón abstracto de partículas
  drawPattern(amp, avgFreq);
}

function drawPattern(amp, freq) {
  let r = map(amp, 0, 1, 10, 150);
  let col = color(
    map(freq, 0, 255, 200, 255), // rojo-blanco-azul
    50,
    map(freq, 0, 255, 255, 100),
    150
  );
  
  noStroke();
  fill(col);
  ellipse(random(width), random(height), r, r);
}
