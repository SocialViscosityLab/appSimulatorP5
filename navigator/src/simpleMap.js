/**
 * This class resembles a regular map from any of the map providers but does not need to retrieve resources from 
 * other sources. It is very convenient to simplify the development process and quick prototype a map functionality
 * with basic location functions. 
 * @param _image the p5.Image containing the map to be visualized
 * @param _north the north boundary of the map
 * @param _south the south boundary of the map
 * @param _west the west boundary of the map
 * @param _east the east boundary of the map
 */
class SimpleMap {
    constructor(_image, boundaries) {
        this.image = _image;
        this.mapHeight = _image.height;
        this.mapWidth = _image.width;
        this.north = boundaries.north;
        this.south = boundaries.south;
        this.east = boundaries.east;
        this.west = boundaries.west;
    }

    /** returns the center of the map in Lon Lat
     * @return array with longitude and latitude 
     */
    getCenterMapCoords = function() {
        let midLon = (this.west + this.east) / 2;
        let midLat = (this.south + this.north) / 2;
        return [midLon, midLat]
    }

    /** Utility function to convert X and Y coordinates from a canvas into a pair of Lon,Lat coordiantes
     * @param XY  p5.Vector with the pair of coordinates on the canvas
     * @param asP5Vector If this parameter is != undefined, then a p5.Vector is returned
     * @return Either a p5.Vector or an object with lon, lat keys.
     */
    XYToLonLat = function(XY, asP5Vector) {
        let lon = Utils.p5.map(XY.x, (this.mapWidth / 2), -(this.mapWidth / 2), this.east, this.west)
        let lat = Utils.p5.map(XY.y, (this.mapHeight / 2), -(this.mapHeight / 2), this.south, this.north)

        if (asP5Vector) {
            return Utils.p5.createVector(lon, lat)
        } else {
            return { lon, lat };
        }
    }

    /** Utility function to convert a pair of Lon,Lat coordiantes into X and Y coordinates on the canvas
     * @param lonLat  Either a p5.Vector or an object with lon and lat keys
     * @param asP5Vector If this parameter is != undefined, then a p5.Vector is returned
     * @return Either a p5.Vector or an object with x, y keys.
     */
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

    /** Displays the map on the canvas. It assumes the origin positioned at the center of the canvas rather than on the upper left corner
     * @renderer a p5.Graphics or a p5 object. 
     */
    show = function(renderer) {
        renderer.background(255, 10);
        renderer.image(this.image, -pGraphics.width / 2, -pGraphics.height / 2)
    }
}