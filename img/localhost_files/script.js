

function sketchIt(p5) {
  let mapa;
  let cyclist;
  let ghost;
  // gui booleans
  let firstPersonView;
  let showMap;
  let animate;

  p5.preload = function () {
    myFont = p5.loadFont("fonts/Roboto/Roboto-Medium.ttf")
    mapa = p5.loadImage("img/map2.png")
  }

  p5.setup = function () {
    canvas = p5.createCanvas(600, 900, p5.WEBGL);
    // initilize utils class
    Utils.setP5(p5)
    // Instantiate cyclist
    cyclist = new Cyclist(p5, 0, 0, 10)
    //cyclist.initializeVectorField ('phyllo', 100, p5.width, p5.height);
    cyclist.initializeVectorField('radial', 7, p5.width, p5.height);
    // Instantiate ghost
    ghost = new Fantasma(p5, 80, 0);
    // Graphics settings
    p5.smooth();
    p5.colorMode(p5.HSB)
    p5.textFont(myFont)
    p5.textSize(12)
    // GUI
    firstPersonView = true;
    showMap = true;
    animate = true;
    document.getElementById('viewMode').onclick = switchViewMode;
    document.getElementById('showMap').onclick = switchMapView;
    document.getElementById('animation').onclick = switchAnimate;
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
    cyclist.show(ghost)
    cyclist.chase(ghost, 0.0008)

    // ghost
    ghost.show(p5, 'bounce', 200); //'bounce' or gravitate
  }

  /*** CAMERA FUNCTIONS */

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
    if (animate) {
      camTargetX = cyclist.pos.x;
      camTargetY = cyclist.pos.y;
    } 
    let camTargetZ = 0;
    let camUPX = 0;
    let camUPY = 0;
    let camUPZ = -1;
    p5.camera(camPosX, camPosY, camPosZ,
      camTargetX, camTargetY, camTargetZ,
      camUPX, camUPY, camUPZ);
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

  /***** GUI FUNCTIONS */
  function switchViewMode() {
    firstPersonView = !firstPersonView;
    if (!firstPersonView) {
      document.getElementById('viewMode').innerHTML = "First person view"
    } else {
      document.getElementById('viewMode').innerHTML = "Aerial view"
    }
    p5.camera();
  }

  function switchMapView() {
    showMap = !showMap
  }

  function switchAnimate() {
    animate = !animate;
    if (!animate){
      document.getElementById('caption').innerHTML = "Touch the screen or move the mouse to change viewpoint"
      document.getElementById('animation').innerHTML = "Animate camera"
    } else {
      document.getElementById('caption').innerHTML ="Stop camera to control camera"
      document.getElementById('animation').innerHTML = "Stop camera"
    }
  }
}

let myp5 = new p5(sketchIt, "sketchHolder")