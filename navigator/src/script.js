let helpText;
let realAngle;
let myCoord;
let pos;
let url = 'https://10.195.69.2:3100'

// communication
let socket = io.connect(url, { secure: true }); //,
console.log("Running code script.js. URL: " + url)

function sketchIt(p5) {
    let mapa;
    let cyclist;
    let ghost;
    // gui booleans
    let firstPersonView;
    let deemMap;
    let chase;
    let gravitate;

    let mapHight, mapWidth;
    let latMin, latMax, lonMin, lonMax;

    let headHight = 200;
    let cyclistHight = 20;

    let routeDP = [];

    p5.preload = function() {
        myFont = p5.loadFont("fonts/Roboto/Roboto-Medium.ttf")
        mapa = p5.loadImage("img/map_quad_HD.jpg")
    }

    p5.setup = function() {

        //Set the dimentions of the map and the range of it's coordiantes
        mapHight = 1900;
        mapWidth = 1000;
        latMin = 40.108897;
        latMax = 40.106182;
        lonMin = -88.228076;
        lonMax = -88.226213;

        //User's coordinates and mapped positions
        myCoord = p5.createVector(40.107546, -88.227257);
        pos = fromLocToPos(myCoord);
        // Ghost's route 
        routeDP.push(fromLocToPos(p5.createVector(40.108804, -88.227606)));
        routeDP.push(fromLocToPos(p5.createVector(40.108818, -88.226828)));
        routeDP.push(fromLocToPos(p5.createVector(40.108024, -88.227474)));
        routeDP.push(fromLocToPos(p5.createVector(40.108024, -88.226841)));
        routeDP.push(fromLocToPos(p5.createVector(40.108020, -88.226846)));
        routeDP.push(fromLocToPos(p5.createVector(40.107895, -88.226827)));
        routeDP.push(fromLocToPos(p5.createVector(40.107302, -88.227565)));

        routeDP.push(fromLocToPos(p5.createVector(40.106297, -88.227527)));


        canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
        canvas.position(0, 0);

        // initilize utils class
        Utils.setP5(p5)

        //Instantiate the cyclist
        //cyclist = new Cyclist(p5, posX, posY, cyclistHight)
        cyclist = new Cyclist(p5, pos.x, pos.y, cyclistHight)
        cyclist.initializeVectorField('radial', 3, p5.width, p5.height);
        // Instantiate ghost
        ghost = new Fantasma(p5, 0, 50);
        ghost.AddRoute(routeDP);
        // Graphics settings
        p5.smooth();
        p5.colorMode(p5.HSB)
        p5.textFont(myFont)
        p5.textSize(16)
            // GUI
        firstPersonView = true;
        deemMap = true;
        //chase = false;
        gravitate = false;
        document.getElementById('viewMode').onclick = switchViewMode;
        document.getElementById('deemMap').onclick = switchMapView;
        //document.getElementById('chase').onclick = switchChase;
        //document.getElementById('ghostMode').onclick = switchGravitate;
        document.getElementById('fullscreen').onclick = fullscreenMode;
        //window.addEventListener("deviceorientation", handleOrientation, true);
        helpText = document.getElementById('help');

    }

    p5.draw = function() {
        p5.background(200, 200, 255);
        // camera and canvas rotation
        if (firstPersonView) {
            panoramic()
        }
        // mapa
        if (deemMap) {
            p5.tint(180, 10, 50, 126);
        }
        p5.image(mapa, -(mapWidth / 2), -(mapHight / 2))

        // vectorfield
        cyclist.show(ghost)
            //cyclist.chase(chase, ghost, 0.008)
        pos = fromLocToPos(myCoord);
        cyclist.updatePosition(p5.createVector(pos.x, pos.y, cyclistHight))

        // ghost
        ghost.show(p5, 2, 50); //0 = bounce, 1 = gravitate, 2 = follow route
    }

    /*** CAMERA FUNCTIONS */

    function panoramic() {
        //rotate
        p5.rotateX(p5.map(p5.mouseY, 0, p5.width, -Math.PI / 2, Math.PI / 2));
        p5.rotateZ(p5.map(p5.mouseX, 0, p5.width, -Math.PI, Math.PI));
        // camera
        //settingMouseCamera(headHight);
        settingRotationCamera(1)
    }
    //The x and y here are exchange between the coordinates and the position because of the convention of lat/lon.
    function fromLocToPos(coors) {
        let posX = p5.map(coors.y, lonMin, lonMax, -(mapWidth / 2), (mapWidth / 2))
        let posY = p5.map(coors.x, latMin, latMax, -(mapHight / 2), (mapHight / 2))
        return p5.createVector(posX, posY)
    }
    /*
    let camTargetX = p5.map(p5.mouseX, 0, p5.width, -1, 1) * proximity;
        function settingMouseCamera(proximity) {
        let camTargetY = p5.map(p5.mouseY, 0, p5.height, -1, 1) * proximity;
        if (chase) {
          camTargetX = cyclist.pos.x;
          camTargetY = cyclist.pos.y;
        } 
        let camTargetZ = 0;
        let camUPX = 0;
        let camUPY = 0;
        let camUPZ = -1;
        p5.camera(posX, posY, headHight,
          camTargetX, camTargetY, camTargetZ,
          camUPX, camUPY, camUPZ);
      }
      */

    function settingRotationCamera(proximity) {
        if (p5.rotationX < 10) {
            proximity = 1;
        } else if (p5.rotationX > 100) {
            proximity = 400;
        } else {
            proximity = p5.map(p5.rotationX, 10, 100, 1, 400)
        }
        //helpText.innerHTML = "Rotation:"+p5.rotationZ+"<br>RotationReal:"+realAngle;

        let oPosX = p5.cos(p5.radians(p5.rotationZ)) * proximity;
        let oPosY = p5.sin(p5.radians(p5.rotationZ)) * proximity;
        let camTargetZ = 10;
        let camUPX = 0;
        let camUPY = 0;
        let camUPZ = -1;
        p5.camera(pos.x, pos.y, headHight, pos.x - oPosX, pos.y + oPosY, camTargetZ, camUPX, camUPY, camUPZ);
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
        deemMap = !deemMap
    }

    function switchGravitate() {
        gravitate = !gravitate;
        if (!gravitate) {
            document.getElementById('ghostMode').innerHTML = "Ghost Orbiting"
        } else {
            document.getElementById('ghostMode').innerHTML = "Ghost Bouncing"
        }
    }

    function switchChase() {
        chase = !chase;
        if (!chase) {
            document.getElementById('chase').innerHTML = "Chase the ghost"
        } else {
            document.getElementById('chase').innerHTML = "Stop chasing the ghost"
        }
    }
}

function fullscreenMode() {
    fullScreen = p5.fullscreen();
    p5.fullscreen(!fullScreen);
    if (fullScreen) {
        document.getElementById('fullscreen').innerHTML = "Turn fullscreen on"
    } else {
        document.getElementById('fullscreen').innerHTML = "Turn fullscreen off"
    }
}

let myp5 = new p5(sketchIt, "sketchHolder")


/***** FUNCTIONS for the location */


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    myCoord = new coordinate(lat, lon)
        //console.log( "Current coordinates is:"+myCoord.x+"/ "+myCoord.y)
}

var tid = setInterval(function() {
    if (document.readyState !== 'complete') return;
    //clearInterval( tid );      
    getLocation();
    // do your work
    socket.emit('message', myCoord);
}, 100);

function coordinate(x, y) {
    this.x = x;
    this.y = y;
}

function handleOrientation(event) {
    /*
      if(event.webkitCompassHeading) {
        realAngle = event.webkitCompassHeading;
       }else{
        realAngle    = event.alpha; //z axis rotation [0,360)
       }
       //helpText.style.color = "red";
       */
    realAngle = event.webkitCompassHeading; //z axis rotation [0,360)

}