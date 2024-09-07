/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

let ROTATIONSPEED2 = 50;
let TIMESTAMP2 = Date.now();
// view matrix constants
let CAMERAX2 = 0;
let CAMERAY2 = 0;
let CAMERAZ2 = 0;
main2();

function main2() {

    const canvas = document.getElementById('canvasid2');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; attribute vec4 vColor; varying vec4 fColor; uniform mat4 modelViewMatrix; void main(void){gl_Position=modelViewMatrix*vPosition; fColor=vColor;}';

    const fShaderSrc = 'precision mediump float; varying vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('failed to initialize shaders');
        return;
    }

    // flower data and assign vertices
    // number of points PER FLOWER
    const nPoints = 1000;
    // npoints * (n indices needed per point)
    const length = nPoints * 6;
    const flower = new Float32Array(length);
    // starting angle
    let theta = 0;
    // return cartesian coordinates
    const polar2Cartesian = (r, theta) => ({ x: r * Math.cos(theta), y: r * Math.sin(theta), z: r * Math.sin(theta) });

    // populate flower vertices
    for (let i = 0; i < length; i += 6) {
        theta += 2 * Math.PI / nPoints;
        const r = Math.sin(6 * theta);
        const { x, y, z } = polar2Cartesian(r, theta);
        flower[i] = x;
        flower[i + 1] = y;
        flower[i + 2] = z;
        flower[i + 3] = 0.98;
        flower[i + 4] = 0.95;
        flower[i + 5] = 0.92;

    }

    // data for canvas of 2 flowers
    const nObjects = 2;
    data = new Float32Array(length * 2);
    data.set(flower);
    data.set(flower, flower.length);

    // data info
    const nPositionComponents = 3;
    const nColorComponents = 3;
    const nBytes = data.BYTES_PER_ELEMENT;

    // buffer links to vertex shader
    if (!initVertexBuffer(context, data, ['vPosition', 'vColor'], [nPositionComponents, nColorComponents], nBytes * (nPositionComponents + nColorComponents), [0, nBytes * nPositionComponents])) {

        console.error('could not assign vertices');
        return false;
    }

    // model matrix and its location
    const modelMatrix = new Matrix();
    const viewMatrix = new Matrix().setViewMatrix([CAMERAX2, CAMERAY2, CAMERAZ2]);

    const modelViewMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelViewMatrix');

    // transformation data, speed in degrees per second
    let angle = 0;
    let scale = 0;

    // initialize slider event listener
    initSlider();
    // event listener for keydown
    document.addEventListener('keydown', function (event) {
        if (event.key == 'ArrowRight') CAMERAX += .1;
        if (event.key == 'ArrowLeft') CAMERAX -= .1;
        if (event.key == 'ArrowUp') CAMERAY += .1;
        if (event.key == 'ArrowDown') CAMERAY -= .1;
        viewMatrix.setViewMatrix([CAMERAX, CAMERAY, CAMERAZ]);
    });
    const animate2 = function () {
        // update transformation constants and render vertices
        ({ angle, scale } = updateTransformation2(angle, scale));

        // render graphics
        render(context, nPoints, nObjects, angle, scale, modelMatrix, viewMatrix, modelViewMatrixLocation);

        // on 60hz browser, called 60 times/second
        requestAnimationFrame(animate2);
    }
    animate2();
}

function render(context, nPoints, nObjects, angle, scale, modelMatrix, viewMatrix, modelViewMatrixLocation) {
    // clear canvas
    clearCanvas(context, [.2, 0.31, 0.36, 1.0]);

    // draw triangle 1 - reset transformation matrix and assign per frame rotation matrix data
    modelMatrix.setRotationMatrix(angle).scaleMatrix(scale / 2, scale / 2, 0).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, 0, nPoints);

    // draw triangle 2
    modelMatrix.setRotationMatrix(angle / 4).scaleMatrix(1 - scale, 1 - scale, 0).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nPoints / nObjects, nPoints);

}

// where transformations should be at currently, accounting for changing browser load
function updateTransformation2(angle, scale) {
    const now = Date.now();
    const timeElapsed = now - TIMESTAMP2;
    TIMESTAMP2 = now;

    // rotate at x degrees per second`
    angle = (angle + ROTATIONSPEED2 * timeElapsed / 1000) % 360;

    // map angle value to scale for convenience
    scale = 1 + 0.5 * Math.sin(angle * Math.PI / 180);

    return { angle, scale };
}

function initSlider() {
    const slider = document.getElementById('slider');
    const speed = document.getElementById('speed');

    slider.addEventListener('input', function () {
        ROTATIONSPEED2 = parseFloat(slider.value);
        speed.textContent = ROTATIONSPEED2;
    })
}