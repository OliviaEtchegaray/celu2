let mic, fft;

// --- Texto máquina de escribir ---
let textos = [
  "El proyecto Confesionario Algorítmico parte de la premisa de que la intimidad ya no es solamente un acto emocional o personal, sino también un fenómeno tecnológico y social.",
  "Ni bien termina de escribirse arranca otro enfrenta la tensión que hay en depositar en un entorno controlado la realidad de que cualquier experiencia personal puede ser transformada en dato."
];
let textoActual = 0;
let textoMostrado = "";
let startTime;
let typing = false;
let charIndex = 0;
let typingSpeed = 3; // velocidad: frames por carácter

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.9, 128);
  fft.setInput(mic);
  background(0);

  startTime = millis(); // para contar los 4 segundos
}

function draw() {
  background(0, 40);

  // --- AUDIO Y VISUALES ---
  let spectrum = fft.analyze();
  let amp = mic.getLevel();
  let avgFreq = fft.getEnergy("mid");
  let ampPerc = nf(amp * 100, 1, 2) + "%";
  let freqPerc = nf((avgFreq / 255) * 100, 1, 2) + "%";

  // Pulso central
  stroke(255, 0, 0);
  strokeWeight(2);
  line(width / 2, 0, width / 2, height);
  noFill();
  beginShape();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, width / 2 - 200, width / 2 + 200);
    let y = height / 2 + map(spectrum[i], 0, 255, -150, 150);
    vertex(x, y);
  }
  endShape();

  // Ondas
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

  // Estrellas
  drawStars(amp, avgFreq);

  // Texto datos audio
  noStroke();
  fill(255);
  textSize(16);
  text("Amplitud: " + ampPerc, 20, 30);
  text("Frecuencia media: " + freqPerc, 20, 55);

  // --- Texto máquina de escribir ---
  if (millis() - startTime > 4000) {
    typewriter();
  }
}

function drawStars(amp, freq) {
  let r = map(amp, 0, 1, 5, 25);
  let col = random([color(255, 0, 0), color(0, 100, 255)]);
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

// --- Máquina de escribir ---
function typewriter() {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);

  if (!typing) {
    typing = true;
    charIndex = 0;
    textoMostrado = "";
  }

  if (frameCount % typingSpeed === 0 && charIndex < textos[textoActual].length) {
    textoMostrado += textos[textoActual][charIndex];
    charIndex++;
  }

  text(textoMostrado, 20, height - 150, width - 40);

  // Si terminó de escribir un texto, pasa al siguiente
  if (charIndex === textos[textoActual].length) {
    typing = false;
    if (textoActual < textos.length - 1) {
      textoActual++;
      textoMostrado = "";
      charIndex = 0;
      typing = true;
    }
  }
}
