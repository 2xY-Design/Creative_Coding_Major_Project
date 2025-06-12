//Individual sketch Yin Ye yiye0713

//Define pupil color palette from full palette (outer -> inner)
const pupilPalette = [
  "#AED581", "#B2DFDB", "#0097A7", "#5C91A1", "#0D0477",
  "#004D61", "#103A44"
];

//Keep group work color palette for noise background 
const fullPalette = [
  "#E53935", "#FF5252", "#0097A7", "#5C91A1", "#B2DFDB", "#4E2424",
  "#FFB300", "#F48FB1", "#0D0477", "#BA68C8", "#AED581", "#7C2945",
  "#FB8C00", "#FFEB3B", "#0D0477", "#AB47BC", "#F0F4C3", "#4A154B",
  "#FF3D00", "#FF4081", "#004D61", "#A67C52", "#E1BEE7", "#103A44"
];

//As per the group artwork, draws 7 centre aligned, noise‐driven circles with different hue
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

  // Instantiate one NoisyCircle per palette entry
  for (let i = 0; i < pupilPalette.length; i++) {
    pcircles.push(
      new wigglesCircle(
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

  // Eye dimensions and position responsive to window size, centered on canvas
  let eyeWidth = width;
  let eyeHeight = height * 0.5;
  let cx = width / 2;
  let cy = height / 2;
  let left = cx - eyeWidth / 2;
  let right = cx + eyeWidth / 2;
  let top = cy - eyeHeight / 2;
  let bottom = cy + eyeHeight / 2;

  //Draw the eye shape using the same logic as the main code from group artwork
  fill(255);
  stroke('#F2570D');
  strokeWeight(15);

  beginShape();
    //Start eye shape at left midpoint
    vertex(left, cy);

    //Upper lid: a Bezier curve from left -> right. Lower lid: Bezier from right -> left. Control points 20% in from each corner at the top & bottom edge.
    bezierVertex(
      cx - eyeWidth * 0.2, top,
      cx + eyeWidth * 0.2, top,
      right, cy
    );
  
    bezierVertex(
      cx + eyeWidth * 0.2, bottom,
      cx - eyeWidth * 0.2, bottom,
      left, cy
    );
  endShape(CLOSE);

  //Overlay all the pupil circles in the center of the eye
  for (let s of pcircles) {
    s.display();
  }
}

//A circle whose size wiggles over time using Perlin noise
class wigglesCircle {
  constructor(sizePercent, factor, fillColor) {
    this.sizePercent = sizePercent;
    this.factor      = factor;
    this.fillColor   = fillColor;
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