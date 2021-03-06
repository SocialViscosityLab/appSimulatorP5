class Fantasma {
    constructor(_p5, _x, _y) {
      this.pos = _p5.createVector(_x, _y);
      this.going = true;
      this.pAngle = 0;
    }
      gravitate (radius) {
        if (this.pAngle > Math.TWO_PI) {
          this.pAngle = 0;
        }
        else {
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
        }
        else {
          this.pos.y -= 0.2;
        }
      };
  
      show(p5, mode, radius) {
        if (mode){
          this.gravitate(radius);
        }else {
          this.bounce(p5);
        }
        p5.push();
        p5.fill(125, 100, 100);
        p5.translate(this.pos.x, this.pos.y, 4);
        //p5.rotateZ(-Math.PI/2)
        p5.rotateX(-Math.PI/2)
        p5.noStroke
        p5.emissiveMaterial(150, 100, 100, 0.8)
        //p5.scale(1.2)
        p5.cone(10,20)
        //p5.model(fish)
        //p5.ellipse(this.pos.x, this.pos.y, 20, 20);
        p5.pop();
        //this.prevVector = this.pos
      };
  }