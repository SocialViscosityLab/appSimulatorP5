let myModel;
let mapa;
let zoom;
let n;
let pAngle;

function preload() {
  myFont = loadFont("fonts/Roboto/Roboto-Medium.ttf")
  myModel = loadModel('obj/fish.obj', true);
  mapa = loadImage("img/map.png")
}

function setup() {
  createCanvas(600, 900, WEBGL);
  textFont(myFont)
  textSize(12)
  zoom = 1;
  n = 20;
  pAngle = 0;
  smooth();
  colorMode(HSB)
}

function draw() {
  background(200);
  // rotate
  rotateX(map(mouseY, 0, width, -PI / 2, PI / 2));
  rotateZ(map(mouseX, 0, width, -PI, PI));
  //scale(zoom)
  settingMouseCamera2(200);
  showAxes()
  let ghost = fantasma(200);
  vectorField(-300, -300, ghost.x, ghost.y)
  // mapa
  image(mapa, -828, -411)
}

function settingMouseCamera(proximity) {
  let nMouse = getNormalizedMouse();
  let nVect = get3DVector(nMouse.x, nMouse.y)
  nVect.mult(proximity)
  camera(nVect.x, nVect.y, nVect.z, 0, 0, 0, 0, 1, 0);
}

function settingMouseCamera2(proximity) {
  let camPosX = 0;
  let camPosY = 0;
  let camPosZ = 100;
  let camTargetX = map(mouseX, 0, width, -1, 1) * proximity;
  let camTargetY = map(mouseY, 0, height, -1, 1) * proximity;
  let camTargetZ = 0;
  let camUPX = 0;
  let camUPY = 0;
  let camUPZ = -1;
  camera(camPosX, camPosY, camPosZ,
    camTargetX, camTargetY, camTargetZ,
    camUPX, camUPY, camUPZ);
}

function settingRotationCamera(proximity) {
  let xRotNorm = map(rotationX, -180, 180, -1, 1)
  let yRotNorm = map(rotationY, -180, 180, -1, 1)
  let nVect = get3DVector(xRotNorm, yRotNorm)
  nVect.mult(proximity)
  camera(nVect.x, nVect.y, nVect.z, 0, 0, 0, 0, 1, 0);
}

function getNormalizedMouse() {
  let mVector = createVector(map(mouseX, 0, width, -1, 1), map(mouseY, 0, height, -1, 1))
  return mVector;
}

/** This method reduces the scale of the object if the xy coordinate proyection on the sphere falls infinite*/
function get3DVector2(x, y) {
  let xComp = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  let azimuth = Math.acos(xComp);
  let z = Math.sin(azimuth);
  return createVector(x, y, z)
}

/** This method reduces the scale of the object if the xy coordinate proyection on the sphere falls infinite*/
function get3DVector(x, y) {
  let xComp = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  let azimuth = Math.acos(xComp);
  let z = Math.sin(azimuth);
  return createVector(x, y, z)
}

/** This method returns infinite if the xy coordinate proyection on the sphere falls infinite*/
function get3DVectorAngles(x, y) {
  // polar coord
  let polar = atan2(y, x);
  // azimuth
  let xComp = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  let azimuth = Math.acos(xComp);
  return p5.Vector.fromAngles(polar, azimuth)
}

function showStage() {
  stroke(255);
  fill(255, 102, 94, 20);
  //box(90);
  normalMaterial();
  rotateZ(PI / 2)
  model(myModel);
  translate(0, 0, 400)
  model(myModel);
  noStroke()
  //rect(10, 10, 200, 200)
}

function showAxes(rotation) {
  strokeWeight(1)
  // Z
  stroke('blue')
  fill('blue')
  line(0, 0, 0, 0, 0, 200)
  if (rotation) {
    text("Z rotation: " + rotationZ, 0, 10, 40)
  } else {
    text("Z", 0, 10, 40)
  }
  // X
  stroke('red')
  fill('red')
  line(0, 0, 0, 200, 0, 0)
  if (rotation) {
    text("X rotation: " + rotationX, 40, 10, 0)
  } else {
    text("X", 40, 10, 0)
  }
  // Y
  stroke('green')
  fill('green')
  line(0, 0, 0, 0, 200, 0)
  if (rotation) {
    text("Y rotation: " + rotationY, 10, 40, 0)
  } else {
    text("Y", 10, 40, 0)
  }
}

function mouseWheel(event) {
  if (event.delta > 0) {
    if (zoom < 5) {
      zoom += 0.1
    }
  } else {
    if (zoom > 0.5) {
      zoom -= 0.1
    }
  }
}

function vectorField(orgX, orgY, targetX, targetY) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let xOrg = orgX + 10 + i * (width / n)
      let yOrg = orgY + 10 + j * (height / n)
      let length = width / (n * 2)
      drawVector(xOrg, yOrg, targetX, targetY, length)
    }
  }
}

function getColor(vX, vY, obX, obY){
  let close = dist(vX, vY, obX, obY)
  return map (close, 0, 300, 100, 0 )
}

function drawVector(xOrg, yOrg, directionX, directionY, radius) {
  let a = getHeading(xOrg, yOrg, directionX, directionY);
  let opacity = getColor(xOrg, yOrg, directionX, directionY)
  let pos = getXY(a, radius);
 
  stroke(0,opacity,100, 20);
  fill(0,opacity,100, 20);
  strokeWeight(1)
  normalMaterial();
  push()
  translate(xOrg, yOrg)
  rotate(a-(PI/2))
  cone(5, radius);
  pop()
  //line(xOrg, yOrg, 10, pos.x + xOrg, pos.y + yOrg, 10);
  //triangle(xOrg - (radius/4), yOrg, pos.x + xOrg, pos.y + yOrg, xOrg + (radius/4),yOrg)
}

function getHeading(x, y, pX, pY) {
  return atan2(pY - y, pX - x);
}


function getX(angle, radius) {
  return cos(angle) * radius;
}


function getY(angle, radius) {
  return sin(angle) * radius;
}

function getXY(angle, radius) {
  let xComp = getX(angle, radius);
  let yComp = getY(angle, radius);
  return ({
    x: xComp,
    y: yComp
  })
}

function fantasma(radius) {
  if (pAngle > TWO_PI) {
    pAngle = 0;
  } else {
    pAngle += 0.001;
  }
  return getXY(pAngle, radius)
}