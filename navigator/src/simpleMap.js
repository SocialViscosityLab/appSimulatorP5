class SMap {

    // QUAD
    // static specs = {
    //     "file": "img/map_quad_HD.jpg",
    //     "mapHeight": 1900,
    //     "mapWidth": 1000,
    //     "latMin": 40.108897,
    //     "latMax": 40.106182,
    //     "lonMin": -88.228076,
    //     "lonMax": -88.226213
    // }

    // IKENBERRY
    static specs = {
        "file": "img/ikenberrySM.gif",
        "mapHeight": 570,
        "mapWidth": 1000,
        "latMin": 40.104178408488494,
        "latMax": 40.101564679660264,
        "lonMin": -88.23928826255725,
        "lonMax": -88.23318891925739
    }

    static specs2 = {
        "file": "img/ikenberrySM.gif",
        "mapHeight": 570,
        "mapWidth": 1000,
        "north": 40.104178408488494,
        "south": 40.101564679660264,
        "east": -88.23928826255725,
        "west": -88.23318891925739
    }

    //The x and y here are exchange between the coordinates and the position because of the convention of lat/lon.
    static fromLocToPos(coors) {
        let posX = Utils.p5.map(coors.y, SMap.specs.lonMin, SMap.specs.lonMax, -(SMap.specs.mapWidth / 2), (SMap.specs.mapWidth / 2))
        let posY = Utils.p5.map(coors.x, SMap.specs.latMin, SMap.specs.latMax, -(SMap.specs.mapHeight / 2), (SMap.specs.mapHeight / 2))
        return Utils.p5.createVector(posX, posY)
    }

    static fromPosToLoc(pos) {
        let lon = Utils.p5.map(pos.x, -(SMap.specs.mapWidth / 2), (SMap.specs.mapWidth / 2), SMap.specs.lonMin, SMap.specs.lonMax)
        let lat = Utils.p5.map(pos.y, -(SMap.specs.mapHeight / 2), (SMap.specs.mapHeight / 2), SMap.specs.latMin, SMap.specs.latMax)
        return { "lat": lat, "lon": lon }
    }

    static getCenterMapCoords() {
        let midLon = (SMap.specs.lonMax + SMap.specs.lonMin) / 2;
        let midLat = (SMap.specs.latMax + SMap.specs.latMin) / 2;
        return [midLat, midLon]
    }

    static lonLatToXY(lonLat) {
        let x;
        let y;
        if (SMap.specs2.east < lonLat.lon && lonLat.lon < SMap.specs2.west) {
            x = Utils.p5.map(lonLat.lon, SMap.specs2.west, SMap.specs2.east, (SMap.specs2.mapWidth / 2), -(SMap.specs2.mapWidth / 2))
        } else {
            console.log(" Lon beyond boudaries, " + lonLat.lon)
        }
        if (SMap.specs2.south < lonLat.lat && lonLat.lat < SMap.specs2.north) {
            y = Utils.p5.map(lonLat.lat, SMap.specs2.south, SMap.specs2.north, (SMap.specs2.mapHeight / 2), -(SMap.specs2.mapHeight / 2))
        } else {
            console.log(" Lat beyond boudaries, " + lonLat.lat)
        }
        return { x, y }
    }
}