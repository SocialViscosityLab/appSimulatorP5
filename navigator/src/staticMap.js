class SMap {

    static file = "img/map_quad_HD.jpg";
    static mapHight = 1900; // pixels
    static mapWidth = 1000; // pixels
    static latMin = 40.108897;
    static latMax = 40.106182;
    static lonMin = -88.228076;
    static lonMax = -88.226213;


    //The x and y here are exchange between the coordinates and the position because of the convention of lat/lon.
    static fromLocToPos(coors) {
        let posX = Utils.p5.map(coors.y, SMap.lonMin, SMap.lonMax, -(SMap.mapWidth / 2), (SMap.mapWidth / 2))
        let posY = Utils.p5.map(coors.x, SMap.latMin, SMap.latMax, -(SMap.mapHight / 2), (SMap.mapHight / 2))
        return Utils.p5.createVector(posX, posY)
    }

    static fromPosToLoc(pos) {
        let lon = Utils.p5.map(pos.x, -(SMap.mapWidth / 2), (SMap.mapWidth / 2), SMap.lonMin, SMap.lonMax)
        let lat = Utils.p5.map(pos.y, -(SMap.mapHight / 2), (SMap.mapHight / 2), SMap.latMin, SMap.latMax)
        return { "lat": lat, "lon": lon }
    }
}