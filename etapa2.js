let mic, fft;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.9, 128);
  fft.setInput(mic);
  background(0);
}

function draw() {
  background(0, 40);

  // Datos de audio
  let spectrum = fft.analyze();
  let amp = mic.getLevel();
  let avgFreq = fft.getEnergy("mid"); 

  // Escalas normalizadas
  let ampPerc = nf(amp * 100, 1, 2) + "%";
  let freqPerc = nf((avgFreq / 255) * 100, 1, 2) + "%";

  // --- Pulso central rojo (vertical + onda) ---
  stroke(255, 0, 0);
  strokeWeight(2);

  // Línea vertical
  line(width / 2, 0, width / 2, height);

  // Onda central
  noFill();
  beginShape();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, width / 2 - 200, width / 2 + 200);
    let y = height / 2 + map(spectrum[i], 0, 255, -150, 150);
    vertex(x, y);
  }
  endShape();

  // --- Ondas abstractas ---
  noFill();
  strokeWeight(1.5);
  for (let j = 0; j < 6; j++) {
    stroke(j % 2 === 0 ? color(0, 100, 255) : 255);
    beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      let x = map(i, 0, spectrum.length, 0, width);
      let y = map(spectrum[i], 0, 255, height, 0);
      y += sin(i * 0.1 + frameCount * 0.02 + j) * 50;
      vertex(x, y);
    }
    endShape();
  }

  // --- Estrellas/partículas ---
  drawStars(amp, avgFreq);

  // --- Texto con datos ---
  noStroke();
  fill(255);
  textSize(16);
  text("Amplitud: " + ampPerc, 20, 30);
  text("Frecuencia media: " + freqPerc, 20, 55);
}

function drawStars(amp, freq) {
  let r = map(amp, 0, 1, 5, 25);
  let col = random([color(255, 0, 0), color(0, 100, 255)]); // rojo o azul
  push();
  translate(random(width), random(height));
  fill(col);
  noStroke();
  star(0, 0, r / 2, r, 5);
  pop();
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
