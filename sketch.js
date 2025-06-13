//Individual sketch Yin Ye yiye0713
//Animation method: Perlin noise. Please refer to README.md for more details

//Define pupil color palette from full palette (outer -> inner)
const pupilPalette = [
  "#AED581", "#B2DFDB", "#0097A7", "#5C91A1", "#0D0477",
  "#004D61", "#103A44"
];

//Keep group work color palette for noise background 
const fullPalette = [
  "#E53935", "#FF5252", "#0097A7", "#5C91A1", "#B2DFDB", "#4E2424",
  "#FFB300", "#F48FB1", "#0D0477", "#BA68C8", "#AED581", "#7C2945",
  "#FB8C00", "#FFEB3B", "#103A44", "#AB47BC", "#F0F4C3", "#4A154B",
  "#FF3D00", "#FF4081", "#004D61", "#A67C52", "#E1BEE7",
];

//As per the group artwork, pupil is composed with 7 centre aligned, noise‐driven circles with different hues
//The pupil sketch is inspired by the class-based, per-shape noise logic in tutorial wk 11.
//Animation inspiration: Hypnotic circles by Olaf Keller https://openprocessing.org/sketch/134155

let pcircles = [];
//Corresponding max-diameter percentages of the window height:
const sizePercents = [0.48, 0.40, 0.35, 0.30, 0.25, 0.20, 0.10];
//Set array of noise-speed factors for variety (one per circle)
const factors = [0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008];

function setup() {
  //Create a responsive canvas where the artwork would fit the whole width
  createCanvas(windowWidth, windowHeight);

  //one pupilCircle per palette
  for (let i = 0; i < pupilPalette.length; i++) {
    pcircles.push(
      new pupilCircle(
        //relative max diameter as a fraction of windowHeight
        sizePercents[i],
        //unique noise-step for each circle
        factors[i],
        //set colour for each circle
        pupilPalette[i]
      )
    );
  }
}

function draw() {
  //Black background for high contrast
  background(0);

  //✺ BACKGROUND PATTERN ✺
  //20 concentric rings to fill canvas, basis shape code logic is based on group work
  const cx = width / 2;
  const cy = height / 2;
  const maxLayers = 20;
  const startR = min(width, height);
  const layerGap = startR / maxLayers;
  const radialOffset = frameCount % (startR + layerGap);
  const noiseScale = 0.8;
  const noiseStrength = layerGap * 0.6;

  //Loop through each ring layer
  for (let layer = 0; layer < maxLayers; layer++) {
    let r = (startR - layer * layerGap + radialOffset) % (startR + layerGap);
    //shapes per ring
    let count = 70 + layer * 5;

    for (let i = 0; i < count; i++) {
      //Angle & base position on the ring
      let angle = TWO_PI * i / count;
      let x = cx + r * cos(angle);
      let y = cy + r * sin(angle);

      //Apply Perlin noise to jitter each shape’s position
      let nX = noise(layer * noiseScale, i * noiseScale);
      let nY = noise(layer * noiseScale, i * noiseScale + 100);
      let jitterX = map(nX, 0, 1, -noiseStrength, noiseStrength);
      let jitterY = map(nY, 0, 1, -noiseStrength, noiseStrength);
      let drawX = x + jitterX;
      let drawY = y + jitterY;

      //Determine shape size via noise,base size between 8px and 11px
      let sNoise = noise(layer * noiseScale, i * noiseScale + 200);
      let s = map(sNoise, 0, 1, 8, 11);

      fill(random(fullPalette));
      noStroke();

      //Three shapes in the circle: ellipse, rectangle, triangle
      if (i % 3 === 0) {
        ellipse(drawX, drawY, s, s);
      } else if (i % 3 === 1) {
        rect(drawX - s/2, drawY - s/2, s, s);
      } else {
        //draw triangle with slight rotation noise
        let rotNoise = noise(layer * noiseScale, i * noiseScale + 300);
        let rotAmt = map(rotNoise, 0, 1, -PI/8, PI/8);
        push();
          translate(drawX, drawY);
          rotate(rotAmt);
          triangle(0, -s/2, s/2, s/2, -s/2, s/2);
        pop();
      }
    }
  }

  //⬭ EYESHAPE ⬭
  //Based on group work logic
  //Eye dimensions and position responsive to window size, centered on canvas
  let eyeWidth = width;
  let eyeHeight = height * 0.5;
  let cxEye = width / 2;
  let cyEye = height / 2;
  let left = cxEye - eyeWidth / 2;
  let right = cxEye + eyeWidth / 2;
  let top = cyEye - eyeHeight / 2;
  let bottom = cyEye + eyeHeight / 2;

  //Draw the eye shape using the same logic as our group artwork. Based on p5.js bezierVertex() https://p5js.org/reference/p5/bezier
  fill(255);
  stroke('#F2570D');
  strokeWeight(15);

  beginShape();
    //Start eye shape at left midpoint
    vertex(left, cyEye);

    //Upper lid: a Bezier curve from left -> right. Lower lid: Bezier from right -> left. Control points 20% in from each corner at the top & bottom edge.
    bezierVertex(
      cxEye - eyeWidth * 0.2, top,
      cxEye + eyeWidth * 0.2, top,
      right, cyEye
    );
  
    bezierVertex(
      cxEye + eyeWidth * 0.2, bottom,
      cxEye - eyeWidth * 0.2, bottom,
      left, cyEye
    );
  endShape(CLOSE);

  //⌾ PUPILS ⌾
  //Overlay all the pupil circles in the center of the eye
  //Follows pattern from The Coding Train Perlin Noise tutorial https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/perlin/intro-to-perlin-noise
  for (let s of pcircles) {
    s.display();
  }
}

//A circle whose size changes over time using Perlin noise
class pupilCircle {
  constructor(sizePercent, factor, fillColor) {
    this.sizePercent = sizePercent;
    this.factor = factor;
    this.fillColor = fillColor;
    //Start at a random point on the Perlin noise curve
    this.noiseOffset = random(1000);
  }
  
  display() {
    //Calculate max diameter based on height changes, maxDiameter updates automatically
    let maxDiameter = this.sizePercent * height;
    
    //Get a number between 0 and 1 from noise, then scale up
    let diameter = noise(this.noiseOffset) * maxDiameter;
    
    //circle colour stay fixed
    noStroke();
    fill(this.fillColor);
    
    //Draw the circle in the middle of the canvas
    ellipseMode(CENTER);
    ellipse(width/2, height/2, diameter, diameter);
    
    //Move along the noise curve for next frame to change size
    this.noiseOffset += this.factor;
  }
}

function windowResized() {
  // Canvas to stay fully responsive
  resizeCanvas(windowWidth, windowHeight);
}