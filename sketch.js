let cam;
let isPressed = false;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    cam = createCamera();
    cam.setPosition(0, 0, 600);
    cam.lookAt(0, 0, 0);
    perspective();
}

let scalefactor = 1 / 30 * 200;

function draw() {
    background(0);
    azimuthControl();
    this._setProperty('_pmouseWheelDeltaY', 0);
    scale(scalefactor, scalefactor, scalefactor);
    noStroke();
    push();
    {
        fill(50);
        push();
        translate(0, 35.5, 0);
        box(60, 1, 60);
        pop();
        push();
        translate(0, -35.5, 0);
        box(60, 1, 60);
        pop();
    }
    pop();
    push();
    {
        translate(10, 0, 0);
        sphere(1.2);
    }
    pop();
}

// mostly adapted from https://editor.p5js.org/tinywitchdraws/sketches/I_AhTKO6Q
p5.prototype.azimuthControl = function (sensitivityX) {
    //init 3d 
    this._assert3d('azimuthControl');

    const mouseInCanvas =
        this.mouseX < this.width &&
        this.mouseX > 0 &&
        this.mouseY < this.height &&
        this.mouseY > 0;
    if (!mouseInCanvas) return;

    const cam = this._renderer._curCamera;
    //default zooms

    if (typeof sensitivityX === 'undefined') {
        sensitivityX = 1;
    }

    const scaleFactor = this.height < this.width ? this.height : this.width;
    this._renderer._curCamera._orbit(0, 0, 0);

    if (isPressed) {
        // ORBIT BEHAVIOR
        const deltaTheta = -sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
        this._renderer._curCamera._orbit(deltaTheta, 0, 0);
    }

    return this;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function handlePress() {
    isPressed = true;
}

function handleRelease() {
    isPressed = false;
}

function touchStarted() {
    handlePress();
    // Always return false to prevent default mobile browser behaviors (like zooming/scrolling)
    return false;
}

function touchEnded() {
    handleRelease();
    return false;
}

// Fallback for mouse devices
function mousePressed() {
    handlePress();
}

function mouseReleased() {
    handleRelease();
}