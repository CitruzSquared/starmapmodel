let camMain;
let camPick;
let isPressed = false;
let pickBuffer;
let azimuth = 0;
let camZ = 1200;
let fov = 0.45;

let infoBox, titleBox;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    camMain = createCamera();
    camMain.setPosition(0, 0, camZ);
    if (windowHeight / windowWidth >= 1.5) {
        camMain.setPosition(0, 0, camZ * sqrt(windowHeight / windowWidth));
    }
    camMain.lookAt(0, 0, 0);
    camMain.perspective(fov);

    pickBuffer = createGraphics(windowWidth, windowHeight, WEBGL);
    pickBuffer.pixelDensity(pixelDensity());
    camPick = pickBuffer.createCamera();
    camPick.setPosition(0, 0, camZ);
    if (windowHeight / windowWidth >= 1.5) {
        camPick.setPosition(0, 0, camZ * sqrt(windowHeight / windowWidth));
    }
    camPick.lookAt(0, 0, 0);
    camPick.perspective(fov);

    titleBox = createDiv("");
    titleBox.position(20, 20);

    titleBox.style("background", "rgba(0,0,0,0)");
    titleBox.style("color", "white");
    titleBox.style("padding", "10px");
    titleBox.style("border-radius", "8px");
    titleBox.style("font-size", "20px");
    title = "<b> Map of the Stars Within 18 Light-Years </b> <br><br> Click on a star to see data.";
    titleBox.html(title);

    infoBox = createDiv("");
    infoBox.style("position", "fixed");
    infoBox.style("left", "20px");
    infoBox.style("bottom", "20px");
    infoBox.style("background", "rgba(0,0,0,0)");
    infoBox.style("color", "white");
    infoBox.style("padding", "10px");
    infoBox.style("border-radius", "8px");
    //infoBox.style("width", "300px");
    select_star(0);
}

let scalefactor = 1 / 30 * 200;

function draw() {
    background(0);
    azimuthControl();
    this._setProperty('_pmouseWheelDeltaY', 0);

    push();
    {
        scale(scalefactor, scalefactor, scalefactor);
        rotateY(azimuth);
        //console.log(azimuth);
        pointLight(255, 255, 255, 0, 0, 400);
        pointLight(255, 255, 255, 0, 0, 400);
        noStroke();
        push();
        {
            fill(50);
            push();
            translate(0, 30.5, 0);
            box(60, 1, 60);
            pop();
            push();
            translate(0, -30.5, 0);
            box(60, 1, 60);
            pop();
        }
        pop();
        for (let i = 0; i < starlist.length; i++) {
            draw_star_system(this, starlist[i], false, 0);
        }
    }
    pop();

    pickBuffer.clear();
    pickBuffer.background(0);
    pickBuffer.perspective(0.45);
    pickBuffer.push();
    pickBuffer.scale(scalefactor, scalefactor, scalefactor);
    pickBuffer.noStroke();
    pickBuffer.noLights();
    pickBuffer.rotateY(azimuth);

    {
        pickBuffer.fill(0, 255, 0);
        pickBuffer.push();
        pickBuffer.translate(0, 30.5, 0);
        pickBuffer.box(60, 1, 60);
        pickBuffer.pop();
        pickBuffer.push();
        pickBuffer.translate(0, -30.5, 0);
        pickBuffer.box(60, 1, 60);
        pickBuffer.pop();
    }

    for (let i = 0; i < starlist.length; i++) {
        draw_star_system(pickBuffer, starlist[i], true, i);
    }

    pickBuffer.pop();
    /*
    texture(pickBuffer);
    plane(tan(fov * width / height) * camZ, tan(fov) * camZ);
    */
}

function draw_star_system(pg, star_system, picking, id) {
    let radii = [0.6, 0.5, 0.5, 0.45, 0.35, 0.26, 0.3];
    let colors = [color(255, 255, 255), color(255, 255, 0), color(255, 153, 0), color(180, 0, 0), color(180, 0, 0), color(180, 0, 0), color(255, 255, 255)]
    let x = star_system[1];
    let y = star_system[2];
    let z = star_system[3];

    let stars = star_system[4];
    let total_length = 0;
    for (let i = 0; i < stars.length; i++) {
        total_length += radii[stars[i]] * 2;
    }

    y += total_length

    for (let i = 0; i < stars.length; i++) {
        pg.push();
        {
            y -= radii[stars[i]];
            pg.translate(x, y, z);
            if (picking) {
                pg.fill(id + 1);
                pg.box(radii[stars[i]] * 2.1);
            }
            else {
                pg.fill(colors[stars[i]]);
                pg.sphere(radii[stars[i]]);
            }
            y -= radii[stars[i]];
        }
        pg.pop();
    }
}

// mostly adapted from https://editor.p5js.org/tinywitchdraws/sketches/I_AhTKO6Q
function azimuthControl(sensitivityX) {
    //init 3d 
    this._assert3d('azimuthControl');

    const mouseInCanvas =
        this.mouseX < this.width &&
        this.mouseX > 0 &&
        this.mouseY < this.height &&
        this.mouseY > 0;
    if (!mouseInCanvas) return;

    if (typeof sensitivityX === 'undefined') {
        sensitivityX = 1;
    }
    const scaleFactor = this.height < this.width ? this.height : this.width;
    if (isPressed) {
        // ORBIT BEHAVIOR
        azimuth += sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
    }
}

function select_star(star) {
    system = starlist[star];
    alphabet = ["A", "B", "C", "D"];
    info = `<table> 
    <tr>
    <td class="bold"> <b> Name </b> </td>
    <td> ${system[0]} </td>
    </tr>
    <tr>
    <td class="bold"> <b> ID </b> </td>
    <td> ${star + 1} </td>
    </tr>
    `;
    for (let i = 0; i < system[5].length; i++) {
        info += `<tr>
        <td class="bold"> <b> Star ${alphabet[i]} </b> </td>
        <td> Type ${system[5][i]} </td>
        </tr>`;
    }
    info += `<tr>
    <td class="bold"> <b> Distance </b> </td>
    <td> ${(sqrt(system[1] * system[1] + system[2] * system[2] + system[3] * system[3]) * 2 / 3).toFixed(2)} ly </td>
    </tr>`;
    info += `</table>`;
    infoBox.html(info);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function handlePress() {
    isPressed = true;

    let star_id = pickBuffer.get(mouseX, windowHeight - mouseY)[0] - 1;
    if (star_id >= 0 && star_id <= 59) {
        select_star(star_id);
    }
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
