class Utils {
    static p5;

    static startTime;

    static setP5(_p5) {
        Utils.p5 = _p5
    }

    static getHeading = function(x, y, pX, pY) {
        return p5.atan2(pY - y, pX - x);
    }


    static getX = function(angle, radius) {
        return p5.cos(angle) * radius;
    }


    static getY = function(angle, radius) {
        return p5.sin(angle) * radius;
    }

    static polarToCartesian = function(angle, radius) {
        let xComp = this.getX(angle, radius);
        let yComp = this.getY(angle, radius);
        return (p5.createVector(xComp, yComp))
    }

    static getEllapsedTime() {
        return Date.now() - Utils.startTime;
    }
}