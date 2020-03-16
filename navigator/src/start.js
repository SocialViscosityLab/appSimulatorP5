// from https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

class GUI {
    static status = document.getElementById("status");
    static latLon = document.getElementById('map-link');
    static ghost = document.getElementById('ghost');
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



//********** MASTER INIT SEQUENCE *********/

let ghost;
let pGraphics;
let myMap;
let tracking;
let device;

function sketch(p5) {
    console.log("running start.js")

    let route;
    let myFont;

    p5.preload = function() {
        //     // route = p5.loadJSON('../routes/quad2.json');
        //     // myMap = p5.loadImage("../img/map_quad_HD.jpg");
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

        // **** GHOST ****
        let gLatLon = SMap.fromLocToPos(route.geometry.coordinates[0]);
        ghost = new Fantasma(Utils.p5, gLatLon.x, gLatLon.y);
        // Add route to ghost
        ghost.AddRoute(getRoute(route));

        // **** UPDATE INTERVAL ****
        SavePos.setupInterval()

        // **** GRAPHICS ****
        // Create pgraphics
        pGraphics = p5.createGraphics(p5.width, p5.height, p5.WEBGL);
        p5.frameRate(10);
        // Font settings
        p5.textFont(myFont);
        p5.textSize(50)
    }

    // dislay map
    p5.draw = function() {
        if (tracking) {
            p5.image(pGraphics, -pGraphics.width / 2, -pGraphics.height / 2);
        } else {
            p5.background(0);
            p5.text(" Position tracking over", -pGraphics.width / 2, 100 + -pGraphics.height / 2);
        }
    }

    // Event save  button
    document.getElementById('save').onclick = function() {
        SavePos.saveSession()
    }
}


class SavePos {
    static dataCoords = [];
    static interval;

    static setupInterval = function() {
        SavePos.interval = setInterval(function() {
            ghost.followRoute("", 10)
                // record
            let timeStamp = Utils.getEllapsedTime();
            let currentPos = { "lat": device.pos.lat, "lon": device.pos.lon }
            let ghostPos = SMap.fromPosToLoc(ghost.pos)
                // store record
            SavePos.dataCoords.push({
                "stamp": timeStamp,
                "coord": currentPos,
                "gcoord": ghostPos
            });
            // draw pGraphics
            pGraphics.background(255, 10);
            pGraphics.image(myMap, -pGraphics.width / 2, -pGraphics.height / 2)
            ghost.show(pGraphics);
            ghost.showRoute(pGraphics)

            // display record
            GUI.status.textContent = device.status;
            GUI.latLon.textContent = "Time: " + Utils.getEllapsedTime() + ', Latitude: ' + currentPos.lat + '°, Longitude: ' + currentPos.lon + '°';
            GUI.latLon.href = ('https://www.openstreetmap.org/#map=18/' + currentPos.lat + "/" + currentPos.lon);
            GUI.ghost.textContent = "Time: " + Utils.getEllapsedTime() + ', Latitude: ' + ghostPos.lat + '°, Longitude: ' + ghostPos.lon + '°';
        }, 500);

    }

    static saveSession = function() {
        Utils.p5.saveJSON(SavePos.dataCoords, "coords.json");
        clearInterval(SavePos.interval);
        tracking = false;
        console.log('JSON saved')
        alert("session ended")
    }
}


let globalP5 = new p5(sketch, 'sketchHolder')