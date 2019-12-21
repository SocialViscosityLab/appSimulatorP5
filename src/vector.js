class Vector extends p5.Vector {
    constructor(_x, _y, _z) {
        super(_x, _y, _z)
        this.elevation = 1;
    }

    show = function (target, radius) {
        this.z = map(dist(this.x, this.y, target.x, target.y), 0, 600, 0, 1)
        let mag = 10 + this.z * 40
        if (radius) {
            mag = radius;
        }
        
        let col = map(this.z, 0, 1, 20, 360)
        // stroke(0)
        // let angle = Utils.getHeading(this.x, this.y, target.x, target.y);
        // let end = Utils.polarToCartesian(angle, mag)
        // line(this.x, this.y, this.z * this.elevation, this.x + end.x, this.y + end.y, this.z * this.elevation)
        fill(col, 70, 50);
        noStroke();
        this.customShape(target)
    }

    customShape(target) {
        push()
        translate(this.x, this.y, this.z)
        rotate(Utils.getHeading(this.x, this.y, target.x, target.y) - PI / 2)
        beginShape();
        vertex(0, 0);
        vertex(-7, -3);
        vertex(0, 10 + this.z * 40);
        vertex(7, -3);
        endShape(CLOSE);
        pop()
    }
}