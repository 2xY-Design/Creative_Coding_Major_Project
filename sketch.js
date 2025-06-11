//Individual sketch Yin Ye yiye0713

// Color palette for noise spiral
const fullPalette = [
  "#E53935", "#FF5252", "#0097A7", "#5C91A1", "#B2DFDB", "#4E2424",
  "#FFB300", "#F48FB1", "#0D0477", "#BA68C8", "#AED581", "#7C2945",
  "#FB8C00", "#FFEB3B", "#0D0477", "#AB47BC", "#F0F4C3", "#4A154B",
  "#FF3D00", "#FF4081", "#004D61", "#A67C52", "#E1BEE7", "#103A44"
];

function setup() {
  //Create a responsive canvas where the artwork would fit the whole width
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  //Black background for high contrast
  background(0);

  // Eye dimensions and position responsive to window size, centered on canvas
  let eyeWidth = width;
  let eyeHeight = height * 0.5;
  let cx = width / 2;
  let cy = height / 2;
  let left   = cx - eyeWidth / 2;
  let right  = cx + eyeWidth / 2;
  let top    = cy - eyeHeight / 2;
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
}

function windowResized() {
  // Canvas to stay fully responsive
  resizeCanvas(windowWidth, windowHeight);
}