class Cyclist {
    constructor(p5, _x, _y, _z) {
        this.pos = p5.createVector(_x, _y, _z);
        this.vField;
        this.p5 = p5;
    }

    initializeVectorField(mode, n) {
        this.vField = new VectorField(this.p5, mode, n, p5.width, p5.height);
        this.vField.updatePosition(this.p5.createVector(this.pos.x, this.pos.y, this.pos.z))

    }

    chase(enabled, ghost, lerpMag) {
        if (enabled) {
            let step = this.lerp(ghost.pos, lerpMag)
            this.updatePosition(step);
            this.vField.updatePosition(step)
        }
    }

    lerp(vctr, amt) {
        let x = (vctr.x - this.pos.x) * amt || 0;
        let y = (vctr.y - this.pos.y) * amt || 0;
        let z = (vctr.z - this.pos.z) * amt || 0;
        return this.p5.createVector(x, y, z);
    }

    show(ghost) {
        this.vField.show(this.p5, ghost.pos)
        this.p5.push()
        this.p5.translate(this.pos.x, this.pos.y, this.pos.z)
        this.p5.noStroke()
        this.p5.fill(0, 80, 100)
        p5.rotateX(-Math.PI/2)
        p5.noStroke
        p5.emissiveMaterial(200, 100, 80, 0.6)
        p5.cylinder(10,3)
        //this.p5.ellipse(0, 0, 20, 20)
        this.p5.pop()
        this.p5.line(0, 0, this.p5.mouseX, this.p5.mouseY)
    }

    updatePosition(pos) {
        //this.pos.add(pos)
        this.pos = pos;
        //this.vField.updatePosition(pos)
        this.vField.updateConcentric(pos)
        //console.log(this.pos)

    }
}