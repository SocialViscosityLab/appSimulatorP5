class GCamera {
    constructor(_p5) {
        this.p5 = _p5;
        this.cam = _p5.createCamera(0, 0, 0, 0, 0, 0, 0, 0, -1);
    }

    /******** SIMPLE CAMERA *********/

    /** The simpliest mode to set a camera lookig at a target
     * @param from p5.Vector with 3D coordinates
     * @param target p5.Vector with 3D coordinates 
     */
    fromLookingAt(from, target) {
        this.cam.camera(from.x, from.y, from.z, target.x, target.y, target.z, 0, 0, -1);
    }

    /******** MOUSE CONTROLED CAMERA *********/

    /** Positions the camera around a cylinder looking at a target. By defult the target is 0,0,0. 
     * @param radiusToTarget The distance from the camera to the target
     * @param camHeight The camera height above or below origin xy plane 
     * @param _targetX the target x coord, otherwise 0
     * @param _targetY the target y coord, otherwise 0
     * @param _targetZ the target z coord, otherwise 0 
     */
    cylindrical_lookingAt_mouse(radiusToTarget, camHeight, _target) {
        // get mouse coord normalized
        let nMouse = this.getNormalizedMouse("centered");
        // amplify by PI to get an angle 
        let nMouseX = nMouse.x * this.p5.PI;
        // use only mouse X component to gravitate around Z axis
        let xCom = this.p5.cos(nMouseX) * radiusToTarget;
        let yCom = this.p5.sin(nMouseX) * radiusToTarget;
        // use mouse Y component to control camera height
        let zCom;
        if (camHeight) {
            zCom = camHeight;
        } else {
            zCom = nMouse.y * radiusToTarget;
        }
        // set values on camera
        if (_target) {
            this.cam.camera(xCom, yCom, zCom, _target.x, _target.y, _target.z, 0, 0, -1);
        } else {
            this.cam.camera(xCom, yCom, zCom, 0, 0, 0, 0, 0, -1);

        }
    }

    /** Positions the camera at the X,Y,Z parameters and looks from that viewpoint around 
     * @param _x x coordinate camera
     * @param _y y coordinate camera
     * @param _z z coordinate camera
     * @param radiusToTarget distance to 3D point from canvas center
     */
    semiOrbital_lookingFrom_mouse(_x, _y, _z, radiusToTarget) {
        // get mouse coord normalized
        let nMouse = this.getNormalizedMouse("centered");
        // amplify by PI to get an angle 
        nMouse.mult(this.p5.PI);
        // use only mouse X component to gravitate around Z axis
        let xCom = this.p5.cos(nMouse.x) * radiusToTarget;
        let yCom = this.p5.sin(nMouse.x) * radiusToTarget;
        // use mouse Y component to control camera height
        let zCom = this.p5.cos(nMouse.y) * radiusToTarget;
        this.cam.camera(_x, _y, _z, xCom, yCom, zCom, 0, 0, -1);
    }

    /** The camera attached to the mouse moves around Z axis. 
     * Left right extremes flaten perspective. Target could be specified
     * @param how far is the camera from the origin 0,0,0
     * @_target p5.Vector with the coords the camera looks at 
     */
    semiOrbital_lookingAt_mouse(proximity, _target) {
        let nMouse = this.getNormalizedMouse("centered");
        let nVect = this.get3DVector(nMouse.x, nMouse.y)
        nVect.mult(proximity)
            // set values on camera
        if (_target) {
            this.cam.camera(nVect.x, nVect.y, nVect.z, _target.x, _target.y, _target.z, 0, 0, -1);
        } else {
            this.cam.camera(nVect.x, nVect.y, nVect.z, 0, 0, 0, 0, 0, -1);

        }
    }

    /** Returns the mouse poisition normilized betwwen 0 and 1. 
     * If centered parameter is present the range is -1 and 1
     * @param centered If true the range is -1 and 1
     * @return 2D instance of p5.Vector
     */
    getNormalizedMouse(centered) {
        let mVector;
        if (centered) {
            mVector = this.p5.createVector(this.p5.map(this.p5.mouseX, 0, this.p5.width, -1, 1), this.p5.map(this.p5.mouseY, 0, this.p5.height, -1, 1))
        } else {
            mVector = this.p5.createVector(this.p5.map(this.p5.mouseX, 0, this.p5.width, 0, 1), this.p5.map(this.p5.mouseY, 0, this.p5.height, 0, 1))
        }
        return mVector;
    }

    /******** GYROSCOPE CONTROLED CAMERA *********/


    /** Positions the camera at the X,Y,Z parameters and looks from that viewpoint around  */
    semiOrbital_lookingFrom_gyro(_x, _y, _z) {
        let radiusToTarget = 100;
        let oPosZ;

        if (this.p5.rotationX < 40) {
            oPosZ = 0;
        } else if (this.p5.rotationX >= 40 && this.p5.rotationX < 90) {
            oPosZ = this.p5.map(this.p5.rotationX, 40, 86, 0, 80)
        } else if (this.p5.rotationX >= 86) {
            oPosZ = 80;
        }

        let oPosX = this.p5.cos(this.p5.radians(-this.p5.rotationZ) + this.p5.HALF_PI) * radiusToTarget;
        let oPosY = this.p5.sin(this.p5.radians(-this.p5.rotationZ) + this.p5.HALF_PI) * radiusToTarget;
        this.p5.camera(_x, _y, _z, _x - oPosX, _y - oPosY, oPosZ, 0, 0, -1);
    }

    /******** UTILITY FUNCTIONS ********

    /** Utility method. This method reduces the scale of the object 
     * if the xy coordinate proyection on the sphere falls infinite*/
    get3DVector(x, y) {
        let radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        let azimuth = Math.acos(radius);
        let z = Math.sin(azimuth);
        return this.p5.createVector(x, y, z)
    }

    /** This method returns infinite if the xy coordinate proyection 
     * on the sphere falls infinite*/
    get3DVectorAngles(x, y) {
        // polar coord
        let polar = this.p5.atan2(y, x);
        // azimuth
        let radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        if (radius > 1) {
            radius = 1
        }
        let azimuth = Math.acos(radius);
        //return p5.Vector.fromAngles(polar, azimuth)
        return this.p5.createVector(Math.cos(polar), Math.sin(polar), azimuth);
    }

    showAxes(rotation) {
        this.p5.strokeWeight(1)
            // Z
        this.p5.stroke('blue')
        this.p5.fill('blue')
        this.p5.line(0, 0, 0, 0, 0, 200)
        if (rotation) {
            this.p5.text("Z rotation: " + this.p5.rotationZ, 0, 10, 40)
        } else {
            this.p5.text("Z", 0, 10, 40)
        }
        // X
        this.p5.stroke('red')
        this.p5.fill('red')
        this.p5.line(0, 0, 0, 200, 0, 0)
        if (rotation) {
            this.p5.text("X rotation: " + this.p5.rotationX, 40, 10, 0)
        } else {
            this.p5.text("X", 40, 10, 0)
        }
        // Y
        this.p5.stroke('green')
        this.p5.fill('green')
        this.p5.line(0, 0, 0, 0, 200, 0)
        if (rotation) {
            this.p5.text("Y rotation: " + this.p5.rotationY, 10, 40, 0)
        } else {
            this.p5.text("Y", 10, 40, 0)
        }
    }
}