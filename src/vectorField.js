class VectorField {
    constructor(_orgX, _orgY, _density, _w, _h) {
        this.orgX = _orgX;
        this.orgY = _orgY;
        this.density = _density;
        this.vectors = [];
        this.width = _w;
        this.height = _h;
        this.initializeOrtho()
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

    show = function (target) {
        for (let i = 0; i < this.vectors.length; i++) {
            this.vectors[i].show(target)
           // this.vectors[i].show(target)
        }
    }

    showSink = function (target){
        for (let i = 0; i < this.vectors.length - this.density; i++) {
            let row = int(i / this.density)
            let cnt = (this.density * row) - 1 + this.density
            noStroke();
            if (i != cnt) {
                fill(this.vectors[i].z * 255)
                beginShape()
                vertex(this.vectors[i].x, this.vectors[i].y, this.vectors[i].z * this.sink)
                vertex(this.vectors[i + 1].x, this.vectors[i + 1].y, this.vectors[i + 1].z * this.sink)
                vertex(this.vectors[i + this.density + 1].x, this.vectors[i + this.density + 1].y, this.vectors[i + this.density + 1].z * this.sink)
                endShape(CLOSE)
                beginShape()
                vertex(this.vectors[i].x, this.vectors[i].y, this.vectors[i].z * this.sink)
                vertex(this.vectors[i + this.density + 1].x, this.vectors[i + this.density + 1].y, this.vectors[i + this.density + 1].z * this.sink)
                vertex(this.vectors[i + this.density].x, this.vectors[i + this.density].y, this.vectors[i + this.density].z * this.sink)
                endShape(CLOSE)
            }
        }
    }
}