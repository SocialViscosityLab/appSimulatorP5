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
        renderer.push();
        this.vField.show(renderer, ghost.pos);
        renderer.stroke(0, 216, 255);
        renderer.fill(255, 0, 225);
        renderer.ellipse(0, 0, 20, 20);
        renderer.pop();
    }

    updatePosition(pos) {
        this.pos = pos;
        this.vField.updateConcentric(pos);
    }
}