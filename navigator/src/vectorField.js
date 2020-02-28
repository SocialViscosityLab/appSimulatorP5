class VectorField {
    constructor(_p5, arrangement, _density, _w, _h) {
        this.orgX = 0;
        this.orgY = 0;
        this.density = _density;
        this.vectors = [];
        this.width = _w;
        this.height = _h;
        this.arrangement = arrangement;
        this.rings;
        this.radius;
        switch (arrangement) {
            case 'orto':
                this.initializeOrtho()
                break;
            case 'fenced':
                this.initializeFencedMatrix(_p5, 200)
                break;
            case 'phyllo':
                this.initializePhyllotaxis(this.density);
                break;
            case 'radial':
                this.initializeConcentric(this.density, 30);
        }
        //console.log("vectors: " + this.vectors.length)
        this.sink = 10;
    }

    centerOriginToCoordSystem() {
        this.orgX = -this.width / 2
        this.orgY = -this.height / 2
    }

    initializeOrtho = function() {
        this.vectors = [];
        this.centerOriginToCoordSystem()
        for (let i = 0; i < this.density; i++) {
            for (let j = 0; j < this.density; j++) {
                let xOrg = this.orgX + j * (this.width / this.density)
                let yOrg = this.orgY + i * (this.height / this.density)
                let zOrig = 10;
                let tmp = new Vector(xOrg, yOrg, zOrig);
                this.vectors.push(tmp)
            }
        }
    }

    initializeFencedMatrix = function(p5, radius) {
        this.vectors = [];
        this.centerOriginToCoordSystem()
        for (let i = 0; i < this.density; i++) {
            for (let j = 0; j < this.density; j++) {
                let xOrg = this.orgX + j * (this.width / this.density)
                let yOrg = this.orgY + i * (this.height / this.density)
                let zOrig = 0;
                let tmp = new Vector(xOrg, yOrg, zOrig);
                if (p5.dist(0, 0, xOrg, yOrg) < radius) {
                    this.vectors.push(tmp)
                }
            }
        }
    }

    initializePhyllotaxis = function(amount) {
        this.vectors = [];
        let n = amount;
        let c = 16;
        for (let i = 0; i < n; i++) {
            let angle = i * 137.5
            let radius = c * Math.sqrt(i)
            let pos = Utils.polarToCartesian(angle, radius);
            let zOrig = 0;
            let tmp = new Vector(this.orgX + pos.x, this.orgY + pos.y, zOrig);
            this.vectors.push(tmp)
        }
    }

    initializeConcentric = function(rings, radius) {
        this.rings = rings;
        this.radius = radius;
        this.vectors = [];
        let parts = 4
        for (let i = 1; i <= this.rings; i++) {
            let angle = (Math.PI * 2) / (i * parts)
            for (let j = 0; j < i * parts; j++) {
                let pos = Utils.polarToCartesian(angle * j, this.radius * i);
                let zOrig = 0;
                let tmp = new Vector(this.orgX + pos.x, this.orgY + pos.y, zOrig);
                this.vectors.push(tmp)
            }
        }
    }

    show = function(p5, target) {
        for (let i = 0; i < this.vectors.length; i++) {
            this.vectors[i].show(p5, target)
        }
    }

    showSink = function() {
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

    updatePosition = function(newPos) {
        for (let i = 0; i < this.vectors.length; i++) {
            this.vectors[i].updatePosition(newPos)
        }
        //console.log("Field origin x:"+this.orgX)
        //console.log("Field origin y:"+this.orgY)
    }

    updateConcentric = function(newPos) {
        let parts = 4
        let count = 0;
        for (let i = 1; i <= this.rings; i++) {
            let angle = (Math.PI * 2) / (i * parts)
            for (let j = 0; j < i * parts; j++) {
                let pos = Utils.polarToCartesian(angle * j, this.radius * i);
                let zOrig = 0;
                let tmp = new Vector(newPos.x + pos.x, newPos.y + pos.y, zOrig);
                //this.vectors.push(tmp)
                this.vectors[count].updatePosition(tmp)
                count++;
                //let row = (i*parts)-parts;
                //let col = j*this.rings;
            }
        }
    }
}