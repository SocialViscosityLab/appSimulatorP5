class Cyclist {
    constructor(p5, _x, _y, _z) {
        this.pos = p5.createVector(_x, _y, _z);
        this.vField;
        this.p5 = p5;
    }

    initializeVectorField(mode, n) {
        this.vField = new VectorField(this.p5, mode, n, p5.width, p5.height);
        this.vField.updateConcentric(this.pos)
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

    show(renderer, ghost) {
        renderer.push()
        this.vField.show(renderer, ghost.pos)
        renderer.pop()
            // renderer.push()
            // renderer.translate(this.pos.x, this.pos.y, this.pos.z)
            // renderer.noStroke()
            // renderer.fill(0, 80, 100)
            // renderer.rotateX(-Math.PI / 2)
            // renderer.noStroke()
            // renderer.emissiveMaterial(200, 100, 80, 0.6)
            // renderer.cylinder(10, 3)
            //     //this.p5.ellipse(0, 0, 20, 20)
            // renderer.pop()
            //renderer.line(0, 0, this.p5.mouseX, this.p5.mouseY)
    }

    updatePosition(pos) {
        //this.pos.add(pos)
        this.pos = pos;
        //this.vField.updatePosition(pos)
        this.vField.updateConcentric(pos)
            //console.log(this.pos)

    }
}