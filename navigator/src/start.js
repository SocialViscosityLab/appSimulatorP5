/*** GLOBAL VARIABLES */

// The ghost, cyclists and cyclists's device
let ghost, cyclist, device;

let pGraphics;

let myMap;
let route;

let dataCoords = [];
// the update interval
let updateInterval;
// boolean starts with true
let tracking;

function sketch(p5) {
    console.log("running start.js")

    let myFont;

    p5.preload = function() {
        // route = p5.loadJSON('../routes/quad2.json');
        // myMap = p5.loadImage("../img/map_quad_HD.jpg");
        route = p5.loadJSON('./routes/ikenberry.json');
        myMap = p5.loadImage("./img/ikenberry.png");
        myFont = p5.loadFont("./fonts/Roboto/Roboto-Medium.ttf")
    }

    // 1 Instantiate p5 and ghost
    p5.setup = function() {
        p5.createCanvas(1000, 570, p5.WEBGL)

        // *** UTILS ****
        Utils.setP5(this);
        Utils.startTime = Date.now();

        // **** DEVICE ****
        device = new DevicePos();
        device.setup();

        tracking = true;

        // **** CYCLIST ****
        let centerMap = SMap.getCenterMapCoords();
        let cyclistXY = SMap.lonLatToXY({ lat: centerMap[0], lon: centerMap[1] });
        cyclist = new Cyclist(p5, cyclistXY.x, cyclistXY.y, 20);
        cyclist.initializeVectorField('radial', 2, p5.width, p5.height);

        // **** GHOST ****
        let routeStart = { lat: route.geometry.coordinates[0][0], lon: route.geometry.coordinates[0][1] }
        let gXY = SMap.lonLatToXY(routeStart);
        ghost = new Fantasma(Utils.p5, gXY.x, gXY.y);
        ghost.AddRoute(getRoute(route));

        // **** UPDATE INTERVAL ****
        setupInterval(500)

        // **** GRAPHICS ****
        // Create pgraphics
        pGraphics = p5.createGraphics(p5.width, p5.height, p5.WEBGL);
        //p5.frameRate(10);
        // Font settings
        p5.textFont(myFont);
        p5.textSize(50)
    }

    // display map, ghost and cyclist
    p5.draw = function() {
        p5.background(255)
        panoramic();
        if (tracking) {
            p5.image(pGraphics, -pGraphics.width / 2, -pGraphics.height / 2);
        } else {
            p5.background(0);
            p5.text(" Position tracking over", -pGraphics.width / 2, 100 + -pGraphics.height / 2);
        }
        //cyclist.updatePosition(ghost.pos)
    }

    function panoramic() {
        //rotate
        p5.rotateX(p5.map(p5.mouseY, 0, p5.width, -Math.PI / 2, Math.PI / 2));
        p5.rotateZ(p5.map(p5.mouseX, 0, p5.width, -Math.PI, Math.PI));
        // camera
        //settingMouseCamera(headHight);
        settingRotationCamera(260)
    }

    function settingRotationCamera(proximity) {
        GUI.rotX.textContent = p5.rotationX;
        GUI.rotY.textContent = p5.rotationY;
        GUI.rotZ.textContent = p5.rotationZ;
        proximity = p5.map(p5.rotationX, 10, 100, 1, 400)
        let oPosX = p5.cos(p5.radians(p5.rotationZ)) * proximity;
        let oPosY = p5.sin(p5.radians(p5.rotationZ)) * proximity;
        let camTargetZ = 10;
        let camUPX = 0;
        let camUPY = 0;
        let camUPZ = -1;
        p5.camera(cyclist.pos.x, cyclist.pos.y, GUI.camHeight.value, cyclist.pos.x - oPosX, cyclist.pos.y + oPosY, camTargetZ, camUPX, camUPY, camUPZ);
    }

    // Event save  button
    document.getElementById('save').onclick = function() {
        saveSession()
    }
}

let globalP5 = new p5(sketch, 'sketchHolder')

/**** AUXILIARY FUNCTIONS *****/

function setupInterval(millis) {
    updateInterval = setInterval(function() {
            // update ghost
            ghost.followRoute("", 3); // "", speed
            // record values
            let timeStamp = Utils.getEllapsedTime();
            let currentPos = { "lat": device.pos.lat, "lon": device.pos.lon }
            let ghostPos = SMap.fromPosToLoc(ghost.pos);
            // store record
            dataCoords.push({
                "stamp": timeStamp,
                "coord": currentPos,
                "gcoord": ghostPos
            });
            // update pGraphics
            pGraphics.background(255, 10);
            pGraphics.image(myMap, -pGraphics.width / 2, -pGraphics.height / 2)
            ghost.show(pGraphics);
            ghost.showRoute(pGraphics)
                //cyclist.updatePosition(Utils.p5.createVector(currentPos.lon, currentPos.lat, 20))
            cyclist.show(pGraphics, ghost)

            // update device status on GUI
            GUI.status.textContent = device.status;
            GUI.latLon.textContent = "Time: " + Utils.getEllapsedTime() + ', Latitude: ' + currentPos.lat + '°, Longitude: ' + currentPos.lon + '°';
            GUI.latLon.href = ('https://www.openstreetmap.org/#map=18/' + currentPos.lat + "/" + currentPos.lon);
            GUI.ghost.textContent = "Time: " + Utils.getEllapsedTime() + ', Latitude: ' + ghostPos.lat + '°, Longitude: ' + ghostPos.lon + '°';
        },
        millis);

}

function saveSession() {
    Utils.p5.saveJSON(dataCoords, "coords.json");
    clearInterval(updateInterval);
    tracking = false;
    console.log('JSON saved')
    alert("session ended")
}

function getRoute(object) {
    let tmp = [];
    for (let index = 0; index < object.geometry.coordinates.length; index++) {
        const element = object.geometry.coordinates[index];
        let tmp2 = SMap.fromLocToPos(Utils.p5.createVector(element[0], element[1]));
        tmp.push(tmp2);
    }
    return tmp;
}