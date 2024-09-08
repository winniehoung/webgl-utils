/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

let ROTATIONSPEED3 = 55;
let TIMESTAMP3 = Date.now();
// view matrix constants
let CAMERAX3 = 0;
let CAMERAY3 = 0;
let CAMERAZ3 = 0;
let TOPX3 = 0;
let TOPY3 = 1;
let TOPZ3 = 0;

main3();

function main3() {

    const canvas = document.getElementById('canvasid3');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; attribute vec4 vColor; varying vec4 fColor; uniform mat4 modelViewMatrix; void main(void){gl_Position=modelViewMatrix*vPosition; fColor=vColor;}';

    const fShaderSrc = 'precision mediump float; varying vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('failed to initialize shaders');
        return;
    }

    // function that returns cartesian coordinates
    const polar2Cartesian = (r, theta) => ({ x: r * Math.cos(theta), y: r * Math.sin(theta) });

    // flower vertex data 
    const nFlowerPoints = 1000;
    const flowerData = new Float32Array(nFlowerPoints * 6);
    let flowerTheta = 0;

    for (let i = 0; i < nFlowerPoints * 6; i += 6) {
        flowerTheta += 10 * Math.PI / nFlowerPoints;
        const r = Math.sin(2.5 * flowerTheta);

        const { x, y } = polar2Cartesian(r, flowerTheta);
        const z = r * Math.sin(flowerTheta);

        flowerData[i] = x;
        flowerData[i + 1] = y;
        flowerData[i + 2] = z;
        flowerData[i + 3] = 0.98;
        flowerData[i + 4] = 0.95;
        flowerData[i + 5] = 0.92;
    }

    // leaf data
    const nLeafPoints = 1000;
    const leafData = new Float32Array(nLeafPoints * 6);
    let leafTheta = 0;

    for (let i = 0; i < nLeafPoints * 6; i += 6) {
        leafTheta += 2 * Math.PI / nLeafPoints;
        const r = Math.sin(5 * leafTheta) * Math.sin(5 * leafTheta) + Math.sin(1.5 * leafTheta) * Math.sin(1.5 * leafTheta);

        const { x, y } = polar2Cartesian(r, leafTheta);
        const z = r * Math.sin(leafTheta);

        leafData[i] = x;
        leafData[i + 1] = y;
        leafData[i + 2] = z;
        leafData[i + 3] = 0.98;
        leafData[i + 4] = 0.95;
        leafData[i + 5] = 0.92;
    }

    const nStemPoints = 1000;
    const stemData = new Float32Array(nStemPoints * 6);
    let stemTheta = 0;
    for (let i = 0; i < nStemPoints * 6; i += 6) {
        stemTheta += 2 * Math.PI / nStemPoints;
        const r = 0.5 / Math.sqrt((Math.sin(stemTheta) * Math.sin(stemTheta) + Math.cos(stemTheta) * Math.cos(stemTheta)));

        const { x, y } = polar2Cartesian(r, stemTheta);
        const z = r * Math.sin(stemTheta);

        stemData[i] = x;
        stemData[i + 1] = y;
        stemData[i + 2] = z;
        stemData[i + 3] = 0.98;
        stemData[i + 4] = 0.95;
        stemData[i + 5] = 0.92;
    }



    const data = new Float32Array(flowerData.length + leafData.length + stemData.length);
    data.set(flowerData);
    data.set(leafData, flowerData.length);
    data.set(stemData, flowerData.length + leafData.length);

    // data info
    const nPositionComponents = 3;
    const nColorComponents = 3;
    const nBytes = data.BYTES_PER_ELEMENT;

    const dataBuffer = new Buffer(context, data, ['vPosition', 'vColor'], [nPositionComponents, nColorComponents], nBytes * (nPositionComponents + nColorComponents), [0, nBytes * nPositionComponents]);

    dataBuffer && dataBuffer.useBuffer();

    // model view matrix 
    const modelMatrix = new Matrix();
    const viewMatrix = new Matrix().setViewMatrix([CAMERAX3, CAMERAY3, CAMERAZ3
    ]);
    const modelViewMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelViewMatrix');
    const projectionMatrix = new Matrix().setBoxProjection(1, -1, 1, -1, 1, -1);

    // transformation data, speed in degrees per second
    let angle = 0;
    let scale = 0;

    // event listener for slider
    initSlider3();
    // event listener for keydown
    document.addEventListener('keydown', function (event) {
        (event.key == 'ArrowRight') && (CAMERAX3 += .1);
        (event.key == 'ArrowLeft') && (CAMERAX3 -= .1);
        (event.key == 'ArrowUp') && (CAMERAY3 += .1, TOPY3 += .1, TOPZ3 += .1);
        (event.key == 'ArrowDown') && (CAMERAY3 -= .1, TOPY3 -= .1, TOPZ3 -= .1);
        viewMatrix.setViewMatrix([CAMERAX3, CAMERAY3, CAMERAZ3], [], []);
    });

    const animate3 = function () {
        // update transformation constants and render vertices
        ({ angle, scale } = updateTransformation3(angle, scale));

        // render graphics
        render3(context, nFlowerPoints, nLeafPoints, nStemPoints, angle, scale, modelMatrix, viewMatrix, projectionMatrix, modelViewMatrixLocation);

        // on 60hz browser, called 60 times/second
        requestAnimationFrame(animate3);
    }
    animate3();
}

function render3(context, nFlowerPoints, nLeafPoints, nStemPoints, angle, scale, modelMatrix, viewMatrix, projectionMatrix, modelViewMatrixLocation) {
    clearCanvas(context, [.85, .17, .27, 1.0]);

    // draw flower
    modelMatrix.setScaleMatrix(scale / 3, scale / 3, scale / 3).rotateMatrix(angle * 2).useViewMatrix(viewMatrix).useBoxProjection(projectionMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, 0, nFlowerPoints);
    console.log('flower ' +modelMatrix.elements);

    // draw leaf 0.5 below flower
    modelMatrix.setScaleMatrix(scale / 6, scale / 6, scale / 6).rotateMatrix(angle * 2).translateMatrix(0, 0.4, 0).useViewMatrix(viewMatrix).useBoxProjection(projectionMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nFlowerPoints, nLeafPoints);

    // draw stem between leaf and flower
    for (let Ty = 0.05; Ty < 0.4; Ty += 0.04) {
        modelMatrix.setScaleMatrix(scale / 50, scale / 50, scale / 50).rotateMatrix(angle * 2).translateMatrix(0, Ty, 0).useViewMatrix(viewMatrix).useBoxProjection(projectionMatrix);
        context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
        context.drawArrays(context.LINE_LOOP, nFlowerPoints + nLeafPoints, nStemPoints);
    }
}

function updateTransformation3(angle, scale) {
    const now = Date.now()
    const timeElapsed = now - TIMESTAMP3;
    TIMESTAMP3 = now;

    // rotate at x degrees per second`
    angle = (angle + ROTATIONSPEED3 * timeElapsed / 1000) % 360;

    scale = 1 + Math.sin(angle * Math.PI / 180) * 0.5;

    return { angle, scale };
}

function initSlider3() {
    const slider = document.getElementById('slider');
    const speed = document.getElementById('speed');

    slider.addEventListener('input', function () {
        ROTATIONSPEED3 = parseFloat(slider.value);
        speed.textContent = ROTATIONSPEED3;
    })
}