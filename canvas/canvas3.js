/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

let ROTATIONSPEED3 = 55;
let TIMESTAMP3 = Date.now();
// view matrix constants
let CAMERAX3 = 0.25;
let CAMERAY3 = 0.25;
let CAMERAZ3 = 0.25;
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
    // vertex data and assign vertices
    const data = new Float32Array([
        0.0, 0.5,  0.8, 1, 0.84, 0.2,
        0.5, 0.0,  0.3, 1, 0.84, 0.2,
        0.5, 0.0,  1.0, 1, 0.84, 0.2,
        0.0, 0.5,  0.8, 1, 0.84, 0.2,
       -0.5, 0.0,  1.0, 1, 0.84, 0.2,
        0.5, 0.0,  1.0, 1, 0.84, 0.2,
       -0.5, 0.0,  1.0, 1, 0.84, 0.2,
       -0.5, 0.0,  0.3, 1, 0.84, 0.2,
        0.0, 0.5,  0.8, 1, 0.84, 0.2,
       -0.5, 0.0,  0.3, 1, 0.84, 0.2,
        0.5, 0.0,  0.3, 1, 0.84, 0.2,

        0.0, 0.5,  0.8, 1, 0.84, 0.2,
        0.5, 0.9,  0.3, 1, 0.84, 0.2,
        0.5, 0.9,  1.0, 1, 0.84, 0.2,
        0.0, 0.5,  0.8, 1, 0.84, 0.2,
       -0.5, 0.9,  1.0, 1, 0.84, 0.2,
        0.5, 0.9,  1.0, 1, 0.84, 0.2,
       -0.5, 0.9,  1.0, 1, 0.84, 0.2,
       -0.5, 0.9,  0.3, 1, 0.84, 0.2,
        0.0, 0.5,  0.8, 1, 0.84, 0.2,
       -0.5, 0.9,  0.3, 1, 0.84, 0.2,
        0.5, 0.9,  0.3, 1, 0.84, 0.2,

        0.5, 0.5,  0.8, 1, 0.84, 0.2,
        1.0, 0.0,  0.3, 1, 0.84, 0.2,
        1.0, 0.0,  1.0, 1, 0.84, 0.2,
        0.5, 0.5,  0.8, 1, 0.84, 0.2,
        0.0, 0.0,  1.0, 1, 0.84, 0.2,
        1.0, 0.0,  1.0, 1, 0.84, 0.2,
        0.0, 0.0,  1.0, 1, 0.84, 0.2,
        0.0, 0.0,  0.3, 1, 0.84, 0.2,
        0.5, 0.5,  0.8, 1, 0.84, 0.2,
        0.0, 0.0,  0.3, 1, 0.84, 0.2,
        1.0, 0.0,  0.3, 1, 0.84, 0.2,

        0.5, 0.5,  0.8, 1, 0.84, 0.2,
        1.0, 0.9,  0.3, 1, 0.84, 0.2,
        1.0, 0.9,  1.0, 1, 0.84, 0.2,
        0.5, 0.5,  0.8, 1, 0.84, 0.2,
        0.0, 0.9,  1.0, 1, 0.84, 0.2,
        1.0, 0.9,  1.0, 1, 0.84, 0.2,
        0.0, 0.9,  1.0, 1, 0.84, 0.2,
        0.0, 0.9,  0.3, 1, 0.84, 0.2,
        0.5, 0.5,  0.8, 1, 0.84, 0.2,
        0.0, 0.9,  0.3, 1, 0.84, 0.2,
        1.0, 0.9,  0.3, 1, 0.84, 0.2,
    ]);

    // data info
    const nPositionComponents = 3;
    const nColorComponents = 3;
    const nVertices = data.length / (nPositionComponents+nColorComponents);
    // divide by number of vertices in an object
    const nObjects = nVertices / 11;
    const nBytes = data.BYTES_PER_ELEMENT;

    // buffer links to vertex shader
    if (!initVertexBuffer(context, data, ['vPosition', 'vColor'], [nPositionComponents, nColorComponents], nBytes * (nPositionComponents + nColorComponents), [0, nBytes * nPositionComponents])) {

        console.error('could not assign vertices');
        return false;
    }

    // model view matrix 
    let modelMatrix = new Matrix();
    let viewMatrix = new Matrix().setViewMatrix([CAMERAX3, CAMERAY3, CAMERAZ3]);
    const modelViewMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelViewMatrix');

    // transformation data, speed in degrees per second
    let angle = 0;
    let scale = 0;

    // event listener for slider
    initSlider3();
    // event listener for keydown
    document.addEventListener('keydown', function (event) {
        if (event.key == 'ArrowRight') CAMERAX += .1;
        if (event.key == 'ArrowLeft') CAMERAX -= .1;
        if (event.key == 'ArrowUp') CAMERAY += .1;
        if (event.key == 'ArrowDown') CAMERAY -= .1;
        viewMatrix.setViewMatrix([CAMERAX, CAMERAY, CAMERAZ]);
    });

    const animate3 = function () {
        // update transformation constants and render vertices
        [angle, scale] = updateTransformation3(angle, scale);

        // render graphics
        render3(context, nVertices, nObjects, angle, scale, modelMatrix, viewMatrix, modelViewMatrixLocation);

        // on 60hz browser, called 60 times/second
        requestAnimationFrame(animate3);
    }
    animate3();
}

function render3(context, nVertices, nObjects, angle, scale, modelMatrix, viewMatrix, modelViewMatrixLocation) {
    clearCanvas(context, [.85, .17, .27, 1.0]);
    
    // draw triangles
    modelMatrix.setScaleMatrix(scale / 2, scale / 2, scale / 2).rotateMatrix(angle).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, 0, nVertices / nObjects);

    modelMatrix.setRotationMatrix(angle).scaleMatrix(scale / 2, scale / 2, scale / 2).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nVertices * 1 / nObjects, nVertices / nObjects);

    modelMatrix.setRotationMatrix(angle*2).scaleMatrix(scale / 4, scale / 4, scale / 4).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nVertices * 2 / nObjects, nVertices / nObjects);

    modelMatrix.setRotationMatrix(angle*2).scaleMatrix(scale / 4, scale / 4, scale / 4).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nVertices * 3 / nObjects, nVertices / nObjects);
}

function updateTransformation3(angle, scale) {
    const now = Date.now()
    const timeElapsed = now - TIMESTAMP3;
    TIMESTAMP3 = now;

    // rotate at x degrees per second`
    angle = (angle + ROTATIONSPEED3 * timeElapsed / 1000) % 360;

    scale = 1 + Math.sin(angle * Math.PI / 180) * 0.5;
    
    return [angle, scale];
}

function initSlider3(){
    const slider=document.getElementById('slider');
    const speed=document.getElementById('speed');

    slider.addEventListener('input',function(){
        ROTATIONSPEED3=parseFloat(slider.value);
        speed.textContent=ROTATIONSPEED3;
    })
}