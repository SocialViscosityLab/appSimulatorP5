// from https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

class GUI {
    static status = document.getElementById("status");
    static latLon = document.getElementById('map-link');
    static ghost = document.getElementById('ghost');
}


class CurrentPos {

    static pos = { "lat": undefined, "lon": undefined }
    static watchID = undefined;
    static geo_options = {
        enableHighAccuracy: true,
        //milliseconds of a possible cached position that is acceptable to return
        maximumAge: 3000,
        //the maximum length of time (in milliseconds) the device is allowed to take in order to return a position
        timeout: 7000
    };


    static success =
        function(position) {
            CurrentPos.pos.lat = position.coords.latitude;
            CurrentPos.pos.lon = position.coords.longitude;
            GUI.status.textContent = 'GPS OK';
        }

    static error = function() {
        GUI.status.textContent = 'Unable to retrieve your location';
    }

    static setup = function() {
        // getting the position
        if (!navigator.geolocation) {
            GUI.status.textContent = 'Geolocation is not supported by your browser';
        } else {
            GUI.status.textContent = 'Locating…';
            //callback is called multiple times, allowing the browser to either update your location as you move, or provide a more accurate location as different techniques are used to geolocate you.
            GUI.watchID = navigator.geolocation.watchPosition(CurrentPos.success, CurrentPos.error, CurrentPos.geo_options);
        }
    }
}

class SavePos {
    static dataCoords = [];
    static interval;

    static setupInterval = function() {
        SavePos.interval = setInterval(function() {
            ghost.followRoute("", 0.7)
                // record
            let timeStamp = Utils.getEllapsedTime();
            let currentPos = { "lat": CurrentPos.pos.lat, "lon": CurrentPos.pos.lon }
            let ghostPos = SMap.fromPosToLoc(ghost.pos)
                // store record
            SavePos.dataCoords.push({
                "stamp": timeStamp,
                "coord": currentPos,
                "gcoord": ghostPos
            });
            // display record
            GUI.latLon.textContent = "Time: " + Utils.getEllapsedTime() + ', Latitude: ' + currentPos.lat + '°, Longitude: ' + currentPos.lon + '°';
            GUI.latLon.href = ('https://www.openstreetmap.org/#map=18/' + currentPos.lat + "/" + currentPos.lon);
            GUI.ghost.textContent = "Time: " + Utils.getEllapsedTime() + ', Latitude: ' + ghostPos.lat + '°, Longitude: ' + ghostPos.lon + '°';
        }, 1000);

    }

    static saveSession = function() {
        Utils.p5.saveJSON(SavePos.dataCoords, "coords.json");
        clearInterval(SavePos.interval);
        console.log('JSON saved')
        alert("session ended")
    }
}



//********** MASTER INIT SEQUENCE *********/

console.log("running start.js")

let ghost;

// 1 Instantiate p5 and ghost
function setup() {
    Utils.setP5(this);
    Utils.startTime = Date.now();
    ghost = new Fantasma(Utils.p5, SMap.latMin, SMap.lonMin);
    // Add route to ghost
    ghost.AddRoute([
        SMap.fromLocToPos(createVector(40.108804, -88.227606)),
        SMap.fromLocToPos(createVector(40.108818, -88.226828)),
        SMap.fromLocToPos(createVector(40.108024, -88.227474)),
        SMap.fromLocToPos(createVector(40.108024, -88.226841)),
        SMap.fromLocToPos(createVector(40.108020, -88.226846)),
        SMap.fromLocToPos(createVector(40.107895, -88.226827)),
        SMap.fromLocToPos(createVector(40.107302, -88.227565)),
        SMap.fromLocToPos(createVector(40.106297, -88.227527)),
    ]);
}

// 2 Map coordinates and boundaries are initiated in sMap static class

// 3 Instantiate the GPS
CurrentPos.setup()


// 5 Start a log of positions
SavePos.setupInterval()


// Event save  button
document.getElementById('save').onclick = function() {
    SavePos.saveSession()
}