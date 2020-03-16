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
}