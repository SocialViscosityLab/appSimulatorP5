class VectorField {
    constructor(_p5, arrangement, _orgX, _orgY, _density, _w, _h) {
        this.orgX = _orgX;
        this.orgY = _orgY;
        this.density = _density;
        this.vectors = [];
        this.width = _w;
        this.height = _h;
        switch (arrangement) {
            case 'orto':
                this.initializeOrtho()
                break;
            case 'radial':
                this.initializeBoundedToCircle(_p5, 200)
                break;
            case 'phyllo':
                this.initializePhyllotaxis(this.density);
        }
        this.sink = 10;
    }

    initializeOrtho = function () {
        for (let i = 0; i < this.density; i++) {
            for (let j = 0; j < this.density; j++) {
                let xOrg = this.orgX + 10 + j * (this.width / this.density)
                let yOrg = this.orgY + 10 + i * (this.height / this.density)
                let zOrig = 10;
                let tmp = new Vector(xOrg, yOrg, zOrig);
                this.vectors.push(tmp)
            }
        }
    }

    initializeBoundedToCircle = function (p5, radius) {
        for (let i = 0; i < this.density; i++) {
            for (let j = 0; j < this.density; j++) {
                let xOrg = this.orgX + 10 + j * (this.width / this.density)
                let yOrg = this.orgY + 10 + i * (this.height / this.density)
                let zOrig = 0;
                let tmp = new Vector(xOrg, yOrg, zOrig);
                if (p5.dist(0, 0, xOrg, yOrg) < radius) {
                    this.vectors.push(tmp)
                }
            }
        }
    }

    initializePhyllotaxis = function (amount) {
        // from coding train
        let n = amount;
        let c = 16;
        console.log(n)
        for (let i = 0; i < n; i++) {
            let angle = i * 137.5
            let radius = c * Math.sqrt(i)
            let pos = Utils.polarToCartesian(angle, radius);
            let zOrig = 0;
            let tmp = new Vector(pos.x, pos.y, zOrig);
            this.vectors.push(tmp)
        }
    }

    show = function (p5, target) {
        for (let i = 0; i < this.vectors.length; i++) {
            this.vectors[i].show(p5, target)
            // this.vectors[i].show(target)
        }
    }

    showSink = function (target) {
        for (let i = 0; i < this.vectors.length - this.density; i++) {
            let row = p5.int(i / this.density)
            let cnt = (this.density * row) - 1 + this.density
            p5.noStroke();
            if (i != cnt) {
                p5.fill(this.vectors[i].z * 255)
                p5.beginShape()
                p5.vertex(this.vectors[i].x, this.vectors[i].y, this.vectors[i].z * this.sink)
                p5.vertex(this.vectors[i + 1].x, this.vectors[i + 1].y, this.vectors[i + 1].z * this.sink)
                p5.vertex(this.vectors[i + this.density + 1].x, this.vectors[i + this.density + 1].y, this.vectors[i + this.density + 1].z * this.sink)
                p5.endShape(CLOSE)
                p5.beginShape()
                p5.vertex(this.vectors[i].x, this.vectors[i].y, this.vectors[i].z * this.sink)
                p5.vertex(this.vectors[i + this.density + 1].x, this.vectors[i + this.density + 1].y, this.vectors[i + this.density + 1].z * this.sink)
                p5.vertex(this.vectors[i + this.density].x, this.vectors[i + this.density].y, this.vectors[i + this.density].z * this.sink)
                p5.endShape(CLOSE)
            }
        }
    }
}