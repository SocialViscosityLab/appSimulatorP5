class Vector extends p5.Vector {
    constructor(_x, _y, _z) {
        super(_x, _y, _z)
        this.elevation = 1;
    }

    updatePosition(newPos){
        this.add(newPos)
    }

    show = function (p5, target, radius) {
        this.z = p5.map(p5.dist(this.x, this.y, target.x, target.y), 0, 600, 0, 1)
        let mag = 10 + this.z * 40
        if (radius) {
            mag = radius;
        }

        //let col = map(this.z, 0, 1, 20, 360)
        // stroke(0)
        // let angle = Utils.getHeading(this.x, this.y, target.x, target.y);
        // let end = Utils.polarToCartesian(angle, mag)
        // line(this.x, this.y, this.z * this.elevation, this.x + end.x, this.y + end.y, this.z * this.elevation)
        this.customShape(p5, target)
    }

    customShape(p5, target) {
        let col = p5.map(this.z, 0, 1, 20, 360)
        // fill(col, 70, 50);
        //noFill();
        p5.fill(col, 20, 100)
        p5.noStroke();
        let angle = Utils.getHeading(this.x, this.y, target.x, target.y) - Math.PI / 2
        p5.push()
        p5.translate(this.x, this.y, this.z)
        p5.rotate(angle)
        p5.beginShape();
        p5.vertex(0, 0);
        p5.vertex(-7, -3);
        p5.vertex(0, 10 + this.z * 40);
        p5.vertex(7, -3);
        p5.endShape();

        p5.beginShape()
        p5.noFill()
        p5.stroke(col, 100, 50)
        let k = 40;
        p5.vertex(-7, -3);
        // vertex(-this.z * (k / 5) , this.z * (k / 2));
        p5.vertex(0, 10 + this.z * k)
        p5.vertex(7, -3);
        // vertex(this.z * (k / 5) , this.z * (k / 2));
        p5.endShape()
        //line(0, 0,target.x - width/2, target.y - height/2)//fill(0)
        p5.pop()
        //     let rad = dist(this.x, this.y, target.x, target.y)
        //    // arc(target.x, target.y,rad, rad,-PI/5, PI/5)
        //     angle = Utils.getHeading(this.x, this.y, target.x, target.y) - PI / 2
        //  let end = Utils.polarToCartesian(angle - PI/2, rad)

        //text(this.z,0,0)
        // line(this.x, this.y,target.x , target.y )
        let rad = p5.dist(this.x, this.y, target.x, target.y)
    }
}