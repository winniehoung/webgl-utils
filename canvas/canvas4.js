/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 * 
 * common bugs: 
 * set shader variables but didn't pass data to it
 * uniformMatrix4fv(location,transpose=false,data)
 */

// animation constants
let ROTATIONSPEED4 = 55;
let TIMESTAMP4 = Date.now();

// view matrix constants
let CAMERAX = CAMERAY = CAMERAZ = 0.25;

main4();

function main4() {

    const canvas = document.getElementById('canvasid4');
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

         0.0, 0.5,  0.8, 0.87, 0.93, 0.95,
         0.5, 0.0,  0.3, 0.87, 0.93, 0.95,
         0.5, 0.0,  1.0, 0.87, 0.93, 0.95,
         0.0, 0.5,  0.8, 0.87, 0.93, 0.95,
        -0.5, 0.0,  1.0, 0.87, 0.93, 0.95,
         0.5, 0.0,  1.0, 0.87, 0.93, 0.95,
        -0.5, 0.0,  1.0, 0.87, 0.93, 0.95,
        -0.5, 0.0,  0.3, 0.87, 0.93, 0.95,
         0.0, 0.5,  0.8, 0.87, 0.93, 0.95,
        -0.5, 0.0,  0.3, 0.87, 0.93, 0.95,
         0.5, 0.0,  0.3, 0.87, 0.93, 0.95,

         0.0, 0.5,  0.8, 0.87, 0.93, 0.95,
         0.5, 0.9,  0.3, 0.87, 0.93, 0.95,
         0.5, 0.9,  1.0, 0.87, 0.93, 0.95,
         0.0, 0.5,  0.8, 0.87, 0.93, 0.95,
        -0.5, 0.9,  1.0, 0.87, 0.93, 0.95,
         0.5, 0.9,  1.0, 0.87, 0.93, 0.95,
        -0.5, 0.9,  1.0, 0.87, 0.93, 0.95,
        -0.5, 0.9,  0.3, 0.87, 0.93, 0.95,
         0.0, 0.5,  0.8, 0.87, 0.93, 0.95,
        -0.5, 0.9,  0.3, 0.87, 0.93, 0.95,
         0.5, 0.9,  0.3, 0.87, 0.93, 0.95,
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
    let viewMatrix = new Matrix().setViewMatrix([CAMERAX, CAMERAY, CAMERAZ]);
    const modelViewMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelViewMatrix');

    // transformation data, speed in degrees per second
    let angle = 0;
    let scale = 0;

    // event listener for slider
    initSlider4();
    // event listener for keydown
    document.addEventListener('keydown', function (event) {
        if (event.key == 'ArrowRight') CAMERAX += .1;
        if (event.key == 'ArrowLeft') CAMERAX -= .1;
        if (event.key == 'ArrowUp') CAMERAY += .1;
        if (event.key == 'ArrowDown') CAMERAY -= .1;
        viewMatrix.setViewMatrix([CAMERAX, CAMERAY, CAMERAZ]);
    });

    const animate4 = function () {
        // update transformation constants and render vertices
        [angle, scale] = updateTransformation4(angle, scale);

        // render graphics
        render4(context, nVertices, nObjects, angle, scale, modelMatrix, viewMatrix, modelViewMatrixLocation);

        // on 60hz browser, called 60 times/second
        requestAnimationFrame(animate4);
    }
    animate4();
}

function render4(context, nVertices, nObjects, angle, scale, modelMatrix, viewMatrix, modelViewMatrixLocation) {
    clearCanvas(context, [.25, .17, .34, 1.0]);

    // draw triangles
    modelMatrix.setScaleMatrix(scale / 2, scale / 2, scale / 2).rotateMatrix(angle).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, 0, nVertices / nObjects);

    modelMatrix.setRotationMatrix(angle).scaleMatrix(scale / 2, scale / 2, scale / 2).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nVertices * 1 / nObjects, nVertices / nObjects);

}

function updateTransformation4(angle, scale) {
    const now = Date.now()
    const timeElapsed = now - TIMESTAMP4;
    TIMESTAMP4 = now;

    // rotate at x degrees per second`
    angle = (angle + ROTATIONSPEED4 * timeElapsed / 1000) % 360;

    scale = 1 + Math.sin(angle * Math.PI / 180) * 0.5;
    
    return [angle, scale];
}

function initSlider4() {
    const slider = document.getElementById('slider');
    const speed = document.getElementById('speed');

    slider.addEventListener('input', function () {
        ROTATIONSPEED4 = parseFloat(slider.value);
        speed.textContent = ROTATIONSPEED4;
    })
}
