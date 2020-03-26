/*** GLOBAL VARIABLES */

// The ghost, cyclists and cyclists's device
let ghost, cyclist, device;
let ghostCoords;

let pGraphics;


let sMap;
let route;

let dataCoords = [];
let camera1; // controlled by mouse
let isMobile;
// the update interval
let updateInterval;
// boolean starts with true
let tracking;

//The intance of the communication
let comm;

function sketch(p5) {
    console.log("running start.js")

    let myFont;

    p5.preload = function() {
        route = p5.loadJSON('./routes/ikenberry.json')
        p5.loadImage("./img/ikenberry1365.png", function(val) {
            // **** MAP ****
            // instantiate simple amp andset the boundaries of the map
            sMap = new SimpleMap(val, 40.103852453920026, 40.1012315395875, -88.23941313195974, -88.23332451749593) // north, south, west, east
        });
        myFont = p5.loadFont("./fonts/Roboto/Roboto-Medium.ttf")
    }

    // 1 Instantiate p5 and ghost
    p5.setup = function() {
        comm = new Communication();
      
        p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL)

        // *** UTILS ****
        Utils.setP5(this);
        Utils.startTime = Date.now();

        // **** DEVICE ****
        device = new DevicePos();
        device.setup();

        // **** CYCLIST ****
        cyclist = new Cyclist(p5, 0, 0, 100);
        cyclist.initializeVectorField('radial', 2, p5.width, p5.height);

        // **** GHOST ****
        //let routeStart = { lat: route.geometry.coordinates[0][0], lon: route.geometry.coordinates[0][1] }
        ghostCoords = { lat: route.geometry.coordinates[0][0], lon: route.geometry.coordinates[0][1] }
        let gXY = sMap.lonLatToXY(ghostCoords, "asPVector");
        ghost = new Fantasma(Utils.p5, gXY.x, gXY.y);
        ghost.AddRoute(getRoute(route));

        // **** UPDATE INTERVAL ****
        // This interval controls the update pace of the entire APP except p5's draw() function
        setupInterval(500)

        // **** CAMERA ****/
        camera1 = new GCamera(p5); // controlled by mouse
        p5.setCamera(camera1.cam);
        isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            GUI.mobile.textContent = "running on mobile"
        } else {
            GUI.mobile.textContent = "running on computer"

        }

        // **** GRAPHICS ****
        // Create pgraphics
        pGraphics = p5.createGraphics(sMap.image.width, sMap.image.height, p5.WEBGL);

        // Font settings
        p5.textFont(myFont);
        p5.textSize(50);

        // GUI boolean
        tracking = true;
    }

    // display map, ghost and cyclist
    p5.draw = function() {
        p5.background(205);

        if (!isMobile) {
            // CAMERA MOUSE
            // A mouseX controls 360 spin around Z, mouseY controls above or below horizon
            // camera1.cylindrical_lookingAt_mouse(600);
            // B spin mouse around canvas center spins camera around Z, mouse on top, left rihght extremes flaten perspective 
            // camera1.semiOrbital_lookingAt_mouse(600, p5.createVector(ghost.pos.x, ghost.pos.y, 0));
            // C spin mouse around position
            camera1.semiOrbital_lookingFrom_mouse(0, 0, 100, 100);
            // D Simpliest  
            // camera1.fromLookingAt(p5.createVector(cyclist.pos.x, cyclist.pos.y, 250), ghost.pos);
        } else {
            // CAMERA MOBILE
            camera1.semiOrbital_lookingFrom_gyro(0, 0, 200);
            p5.rotateZ(p5.PI / 2);
        }

        // camera1.showAxes();

        //  cyclist.show(p5, ghost)
        if (tracking) {
            p5.image(pGraphics, -pGraphics.width / 2, -pGraphics.height / 2);
        } else {
            p5.background(0);
            p5.text(" Position tracking over", -pGraphics.width / 2, 100 + -pGraphics.height / 2);
        }

        //GUI.rotation.textContent = "x: " + p5.rotationX.toFixed(2) + ", y:" + p5.rotationY.toFixed(2) + ", z:" + p5.rotationZ.toFixed(2);
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

            // update cyclists
            // cyclist.updatePosition(sMap.lonLatToXY(device.pos))

            // store record
            dataCoords.push({
                "stamp": Utils.getEllapsedTime(),
                "coord": { "lat": device.pos.lat, "lon": device.pos.lon },
                "gcoord": sMap.XYToLonLat(ghost.pos)
            });

            // // update pGraphics
            sMap.show(pGraphics);
            ghost.show(pGraphics);
            ghost.showRoute(pGraphics)
            ghost.updatePosition(sMap.lonLatToXY(ghostCoords, "asPVector"))
            cyclist.show(pGraphics, ghost)

            // update device status on GUI
            GUI.status.textContent = device.status;
            GUI.latLon.textContent = "Time: " + Utils.getEllapsedTime() + ', Latitude: ' + device.pos.lat + '°, Longitude: ' + device.pos.lon + '°';
            GUI.latLon.href = ('https://www.openstreetmap.org/#map=18/' + device.pos.lat + "/" + device.pos.lon);
            GUI.ghost.textContent = "Time: " + Utils.getEllapsedTime() + ', Latitude: ' + sMap.XYToLonLat(ghost.pos).lat + '°, Longitude: ' + sMap.XYToLonLat(ghost.pos).lon + '°';
        },
        millis);

}

function saveSession() {
    let now = new Date();
    now = now.getDay() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds();
    Utils.p5.saveJSON(dataCoords, now + ".json");
    clearInterval(updateInterval);
    tracking = false;
    console.log('JSON saved')
    alert("session ended")
}

function getRoute(object) {
    let tmp = [];
    for (let index = 0; index < object.geometry.coordinates.length; index++) {
        const element = object.geometry.coordinates[index];
        let tmp2 = sMap.lonLatToXY(element, "asP5Vector")
        tmp.push(tmp2);
    }
    return tmp;
}