/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

// degrees per second
let ROTATION_SPEED = 50;
let TIMESTAMP = Date.now();
let ANIMATION_DURATION = 6;

main(); // function hoisting in JS

function main() {

    const canvas = document.getElementById('canvasid');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; attribute vec4 vColor; varying vec4 fColor; uniform mat4 modelMatrix; void main(void){gl_Position=modelMatrix*vPosition; fColor=vColor;}';

    const fShaderSrc = 'precision mediump float; varying vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('failed to initialize shaders.');
        return;
    }

    // model matrix and location
    const modelMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelMatrix');

    // clear canvas
    clearCanvas(context, [.97, .75, .27, 1]);

    // handle click event on DOM element
    const clickHandler = createClickHandler();

    canvas.addEventListener('click', function (event) {
        clickHandler(event, canvas, context, new Matrix(), modelMatrixLocation);
        clearCanvas(context, [.97, .75, .27, 1]);
    });
}
// task during click event
function createClickHandler() {
    const vPoints = [];

    return function (event, canvas, context, modelMatrix, modelMatrixLocation) {
        const clientX = event.clientX;
        const clientY = event.clientY;
        const rect = event.target.getBoundingClientRect(); // event.target or canvas

        const maxX = canvas.width / 2;
        const maxY = canvas.height / 2;

        // webgl canvas normalized coordinates
        const Tx = ((clientX - rect.left) - maxX) / maxX;
        const Ty = (maxY - (clientY - rect.top)) / maxY;

        // store data points
        vPoints.push([Tx, Ty]);

        // animation returns after ANIMATION DURATION
        createSpiral(context, Tx, Ty, modelMatrix, modelMatrixLocation);
    }
}

function createSpiral(context, Tx, Ty, modelMatrix, modelMatrixLocation) {

    // spiral data info and populate vertices
    const nPoints = 1000;
    const nPositionComponents = 2;
    const nColorComponents = 3;
    // array length: nPoints * n components per point
    const length = nPoints * (nPositionComponents + nColorComponents);
    const spiral = new Float32Array(length);
    const nBytes = spiral.BYTES_PER_ELEMENT;
    // starting angle
    let theta = 0;

    const polar2Cartesian = (r, theta) => ({ x: r * Math.cos(theta), y: r * Math.sin(theta) });

    for (let i = 0; i < length; i += 5) {
        theta += 10 * Math.PI / nPoints;
        const r = 0.04 + 0.02 * theta;
        const { x, y } = polar2Cartesian(r, theta);
        spiral[i] = x;
        spiral[i + 1] = y;
        spiral[i + 2] = 0.98;
        spiral[i + 3] = 0.95;
        spiral[i + 4] = 0.92;
    }

    // init buffers and pass data to locations
    if (!initVertexBuffer(context, spiral, ['vPosition', 'vColor'], [nPositionComponents, nColorComponents], nBytes * (nPositionComponents + nColorComponents), [0, nBytes * nPositionComponents])) {

        console.error('could not initialize vertex buffer');
        return false;
    }

    // animation constants
    let angle = scale = 0;
    let startTime = Date.now();

    const animate = function () {

        ({ angle, scale } = updateTransformation(angle, scale));

        if (Date.now() - startTime < ANIMATION_DURATION * 1000) {

            // transform matrix and pass to attribute location
            modelMatrix.setRotationMatrix(angle).scaleMatrix(1 - scale, 1 - scale, 0).translateMatrix(Tx, Ty, 0);
            context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);

            // clear canvas and draw
            clearCanvas(context, [.95, .62, .1, 1.0]);
            context.drawArrays(context.LINE_LOOP, 0, nPoints);

            requestAnimationFrame(animate);
        } else {
            clearCanvas(context, [.97, .75, .27, 1]);
        }
        return;
    }

    animate();
}

function updateTransformation(angle, scale) {
    const now = Date.now()
    const timeElapsed = now - TIMESTAMP;
    TIMESTAMP = now;

    // rotate at x degrees per second`
    angle = (angle + ROTATION_SPEED * timeElapsed / 1000) % 360;

    // map angle value to scale for convenience
    scale = 1 + 0.5 * Math.sin(angle * Math.PI / 180);

    return { angle, scale };
}