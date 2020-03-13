// Check if device can provide absolute orientation data
if (window.DeviceOrientationAbsoluteEvent) {
    window.addEventListener("DeviceOrientationAbsoluteEvent", deviceOrientationListener);
} // If not, check if the device sends any orientation data
else if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", deviceOrientationListener);
} // Send an alert if the device isn't compatible
else {
    alert("Sorry, try again on a compatible mobile device!");
}
let noNorthNotified = false;

function deviceOrientationListener(event) {
    document.getElementById('rotation').innerHTML = "something"
    var alpha = event.alpha; //z axis rotation [0,360)
    var beta = event.beta; //x axis rotation [-180, 180]
    var gamma = event.gamma; //y axis rotation [-90, 90]      //Check if absolute values have been sent
    if (typeof event.webkitCompassHeading !== "undefined") {
        alpha = event.webkitCompassHeading; //iOS non-standard
        var heading = alpha
        document.getElementById('rotation').innerHTML = heading.toFixed([0]);
    } else {
        if (!noNorthNotified) {
            alert("Your device is reporting relative alpha values, so this compass won't point north :(");
            noNorthNotified = true;
        }
        var heading = 360 - alpha; //heading [0, 360)
        document.getElementById('rotation').innerHTML = heading.toFixed([0]);
    }
}