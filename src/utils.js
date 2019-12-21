class Utils{
    static getHeading = function (x, y, pX, pY) {
        return atan2(pY - y, pX - x);
    }


    static getX = function (angle, radius) {
        return cos(angle) * radius;
    }


    static getY = function (angle, radius) {
        return sin(angle) * radius;
    }

    static polarToCartesian = function (angle, radius) {
        let xComp = this.getX(angle, radius);
        let yComp = this.getY(angle, radius);
        return (createVector(xComp,yComp))
    }

}