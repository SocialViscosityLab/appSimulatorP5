class SimpleMap {
    constructor(_image, _north, _south, _west, _east) {
        this.image = _image;
        this.mapHeight = _image.height;
        this.mapWidth = _image.width;
        this.north = _north;
        this.south = _south;
        this.east = _east;
        this.west = _west;
        console.log("Map setup with image size  W:" + _image.width + ", H: " + _image.height)
    }

    getCenterMapCoords = function() {
        let midLon = (this.west + this.east) / 2;
        let midLat = (this.south + this.north) / 2;
        return [midLat, midLon]
    }

    XYToLonLat = function(XY, asP5Vector) {

        let lon = Utils.p5.map(XY.x, (this.mapWidth / 2), -(this.mapWidth / 2), this.west, this.east)
        let lat = Utils.p5.map(XY.y, (this.mapHeight / 2), -(this.mapHeight / 2), this.south, this.north)

        if (asP5Vector) {
            return Utils.p5.createVector(lon, lat)
        } else {
            return { lon, lat }
        }
    }

    lonLatToXY = function(lonLat, asP5Vector) {

        if (Array.isArray(lonLat)) {
            lonLat = { lat: lonLat[0], lon: lonLat[1] }
        }

        if (this.west > lonLat.lon || lonLat.lon > this.east) {
            //     console.log(" Lon beyond boundaries, " + lonLat.lon)
        }
        let x = Utils.p5.map(lonLat.lon, this.east, this.west, (this.mapWidth / 2), -(this.mapWidth / 2))
        if (this.south > lonLat.lat || lonLat.lat > this.north) {
            //     console.log(" Lat beyond boundaries, " + lonLat.lat)
        }
        let y = Utils.p5.map(lonLat.lat, this.south, this.north, (this.mapHeight / 2), -(this.mapHeight / 2))
        if (asP5Vector) {
            return Utils.p5.createVector(x, y)
        } else {
            return { x, y }
        }
    }

    show = function(renderer) {
        renderer.background(255, 10);
        renderer.image(this.image, -pGraphics.width / 2, -pGraphics.height / 2)
    }
}