// let myModel;
let mapa;
let pAngle;
let vField;
let arrow;


function preload() {
  myFont = loadFont("fonts/Roboto/Roboto-Medium.ttf")
  // myModel = loadModel('obj/fish.obj', true);
  arrow = loadImage("img/arrow.png")
  mapa = loadImage("img/map.png")
}

function setup() {
  canvas = createCanvas(600, 900, WEBGL);
  textFont(myFont)
  textSize(12)
  pAngle = 0;
  vField = new VectorField(-300, -450, 20, width, height);//_orgX, _orgY, _density, _w, _h
  smooth();
  colorMode(HSB)
}

function draw() {
  background(0);
  // rotate
  rotateX(map(mouseY, 0, width, -PI / 2, PI / 2));
  rotateZ(map(mouseX, 0, width, -PI, PI));
  // camera
  settingMouseCamera(200);
  //showAxes()
  // vectorfield

  vField.show(fantasma(200))
  //vField.showSink(fantasma(200))
  // mapa
  image(mapa, -828, -411)


}


function settingMouseCamera(proximity) {
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



function fantasma(radius) {
  if (pAngle > TWO_PI) {
    pAngle = 0;
  } else {
    pAngle += 0.001;
  }
  let pos = Utils.polarToCartesian(pAngle, radius)
  push()
  fill(125,100,100)
  translate(0,0,1)
  ellipse(pos.x, pos.y, 20, 20);
  pop()
  return pos
}

