class Fantasma {
    constructor(_p5, _x, _y) {
        this.p5 = _p5;
        this.pos = _p5.createVector(_x, _y);
        this.going = true;
        this.pAngle = 0;
        this.route = [];
        this.currentGoal = 0;
    }
    gravitate(radius) {
        if (this.pAngle > Math.TWO_PI) {
            this.pAngle = 0;
        } else {
            this.pAngle += 0.001;
        }
        this.pos = Utils.polarToCartesian(this.pAngle, radius);
    };

    bounce(p5) {
        if (this.pos.y < -p5.height / 2) {
            this.going = true;
        }
        if (this.pos.y > p5.height / 2) {
            this.going = false;
        }
        if (this.going) {
            this.pos.y += 0.2;
        } else {
            this.pos.y -= 0.2;
        }
    };

    AddRoute(route) {
        this.route = route;
    }

    //*Speed is the number of pixels for iteration
    followRoute(p5, speed) {
        if (this.route.length > 0) {
            let goalPos = this.route[this.currentGoal];
            if (this.currentGoal != this.route.length) {
                let difV = goalPos.copy()
                difV.sub(this.pos)
                if (difV.mag() >= speed) {
                    let norm = difV.normalize();
                    let toMove = norm.mult(parseFloat(speed));
                    this.pos.add(toMove)
                } else {
                    this.currentGoal++;
                }
            }
        }
    }

    show(p5, mode, value) {
        if (mode == 0) {
            this.gravitate(value);
        } else if (mode == 1) {
            this.bounce(p5);
        } else if (mode == 2) {
            this.followRoute(p5, value)
        }
        p5.push();
        p5.fill(0, 216, 255);
        p5.stroke(255);
        p5.translate(this.pos.x, this.pos.y, 4);
        p5.ellipse(0, 0, 30, 30);
        p5.pop();
    };

    show3D(p5, mode, value) {
        if (mode == 0) {
            this.gravitate(value);
        } else if (mode == 1) {
            this.bounce(p5);
        } else if (mode == 2) {
            this.followRoute(p5, value)
        }
        p5.push();
        p5.fill(125, 100, 100);
        p5.translate(this.pos.x, this.pos.y, 4);
        //p5.rotateZ(-Math.PI/2)
        p5.rotateX(-Math.PI / 2)
        p5.noStroke
        p5.emissiveMaterial(150, 100, 100, 0.8)
        p5.cone(10, 20)
        p5.pop();
    };

    showRoute(p5) {
        for (let index = 0; index < this.route.length - 1; index++) {
            const src = this.route[index];
            const trgt = this.route[index + 1];
            p5.line(src.x, src.y, trgt.x, trgt.y);

        }
    }
    updatePosition(pos){
        console.log("new ghost position");
        console.log(pos)
        this.pos = pos;
    }
}