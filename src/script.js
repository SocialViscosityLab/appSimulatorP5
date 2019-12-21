

function sketchIt(p5) {
  let mapa;
  let vField;
  let ghost;
  // gui booleans
  let firstPersonView;
  let showMap;

  p5.preload = function () {
    myFont = p5.loadFont("fonts/Roboto/Roboto-Medium.ttf")
    mapa = p5.loadImage("img/map2.png")
  }

  p5.setup = function () {
    canvas = p5.createCanvas(600, 900, p5.WEBGL);
    Utils.setP5(p5)
    p5.textFont(myFont)
    p5.textSize(12)
    vField = new VectorField(p5, 'phyllo', -300, -450, 100, p5.width, p5.height);//_orgX, _orgY, _density, _w, _h
    ghost = new Fantasma(p5, 80, 0);
    p5.smooth();
    p5.colorMode(p5.HSB)
    // GUI
    firstPersonView = true;
    showMap = true;
    document.getElementById('viewMode').onclick = switchViewMode;
    document.getElementById('showMap').onclick = switchMapView;
  }

  p5.draw = function () {
    p5.background(200, 200, 255);
    // camera and canvas rotation
    if (firstPersonView) {
      panoramic()
    }
    // mapa
    if (showMap) {
      p5.tint(180, 10, 50, 126);
    }
    p5.image(mapa, -300, -450)
    // vectorfield
    vField.show(p5, ghost.pos)
    //vField.showSink(fantasma(200))
    // ghost
    ghost.show(p5, 'bounce', 200); //'bounce' or gravitate
    // you
    p5.ellipse(0, 0, 20, 20)
  }

  function switchViewMode() {
    firstPersonView = !firstPersonView;
    p5.camera();
  }
  function switchMapView(){
    showMap = !showMap
  }

  function panoramic() {
    //rotate
    p5.rotateX(p5.map(p5.mouseY, 0, p5.width, -Math.PI / 2, Math.PI / 2));
    p5.rotateZ(p5.map(p5.mouseX, 0, p5.width, -Math.PI, Math.PI));
    // camera
    settingMouseCamera(200);
  }

  function settingMouseCamera(proximity) {
    let camPosX = 0;
    let camPosY = 0;
    let camPosZ = 90;
    let camTargetX = p5.map(p5.mouseX, 0, p5.width, -1, 1) * proximity;
    let camTargetY = p5.map(p5.mouseY, 0, p5.height, -1, 1) * proximity;
    let camTargetZ = 0;
    let camUPX = 0;
    let camUPY = 0;
    let camUPZ = -1;
    p5.camera(camPosX, camPosY, camPosZ,
      camTargetX, camTargetY, camTargetZ,
      camUPX, camUPY, camUPZ);
  }

  function showStage() {
    p5.stroke(255);
    p5.fill(255, 102, 94, 20);
    //box(90);
    p5.normalMaterial();
    p5.rotateZ(Math.PI / 2)
    p5.model(myModel);
    p5.translate(0, 0, 400)
    p5.model(myModel);
    p5.noStroke()
    //rect(10, 10, 200, 200)
  }

  function showAxes(rotation) {
    p5.strokeWeight(1)
    p5.push()
    p5.translate(0, 0, 1)
    // Z
    p5.stroke('blue')
    p5.fill('blue')
    p5.line(0, 0, 0, 0, 0, 200)
    if (rotation) {
      p5.text("Z rotation: " + p5.rotationZ, 0, 10, 40)
    } else {
      p5.text("Z", 0, 10, 40)
    }
    // X
    p5.stroke('red')
    p5.fill('red')
    p5.line(0, 0, 0, 200, 0, 0)
    if (rotation) {
      p5.text("X rotation: " + p5.rotationX, 40, 10, 0)
    } else {
      p5.text("X", 40, 10, 0)
    }
    // Y
    p5.stroke('green')
    p5.fill('green')
    p5.line(0, 0, 0, 0, 200, 0)
    if (rotation) {
      p5.text("Y rotation: " + p5.rotationY, 10, 40, 0)
    } else {
      p5.text("Y", 10, 40, 0)
    }
    p5.pop()
  }
}

let myp5 = new p5(sketchIt, "sketchHolder")