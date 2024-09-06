/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

let ROTATIONSPEED = 50;
let TIMESTAMP = Date.now();
main2();

function main2() {

    const canvas = document.getElementById('canvasid2');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; attribute vec4 vColor; varying vec4 fColor; uniform mat4 modelMatrix; void main(void){gl_Position=modelMatrix*vPosition; fColor=vColor;}';

    const fShaderSrc = 'precision mediump float; varying vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('failed to initialize shaders');
        return;
    }
    // vertex data and assign vertices
    const data = new Float32Array([
        // triangle 1
         0.0, 0.5, 0.94, 0.27, 0.37,
        -0.5, 0.0, 0.99, 0.96, 0.93,
         0.5, 0.0, 0.96, 0.51, 0.56,

        // triangle 2
         0.0, 0.5, 0.94, 0.27, 0.37,
        -0.5, 0.0, 0.99, 0.96, 0.93,
         0.5, 0.0, 0.96, 0.51, 0.56,

        // triangle 3
         0.0, 0.5, 0.94, 0.27, 0.37,
        -0.5, 0.0, 0.99, 0.96, 0.93,
         0.5, 0.0, 0.96, 0.51, 0.56,

        // triangle 4
         0.0, 0.5, 0.94, 0.27, 0.37,
        -0.5, 0.0, 0.99, 0.96, 0.93,
         0.5, 0.0, 0.96, 0.51, 0.56,

    ]);
    // data info
    const nPositionComponents = 2;
    const nColorComponents = 3;
    const nPoints = data.length / 5;
    const nBytes = data.BYTES_PER_ELEMENT;

    // buffer links to vertex shader
    if (!initVertexBuffer(context, data, ['vPosition', 'vColor'], [nPositionComponents, nColorComponents], nBytes * 5, [0, nBytes * 2])) {
        console.error('could not assign vertices');
        return false;
    }

    // model matrix and its location
    const modelMatrix = new Matrix();
    const modelMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelMatrix');

    // transformation data, speed in degrees per second
    let angle = 0;
    let scale = 0;

    // initialize slider event listener
    initSlider();

    const animate = function () {
        // update transformation constants and render vertices
        [angle, scale] = updateTransformation(angle, scale);

        // render graphics
        render(context, nPoints, angle, scale, modelMatrix, modelMatrixLocation);

        // on 60hz browser, called 60 times/second
        requestAnimationFrame(animate);
    }
    animate();
}

function render(context, nPoints, angle, scale, modelMatrix, modelMatrixLocation) {
    // clear canvas
    clearCanvas(context, [.2, 0.31, 0.36, 1.0]);

    // draw triangle 1 - reset transformation matrix and assign per frame rotation matrix data
    modelMatrix.setRotationMatrix(angle).scaleMatrix(scale, scale, 0);
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.TRIANGLES, 0, nPoints / 4);

    // draw triangle 2
    modelMatrix.setRotationMatrix(angle / 4).scaleMatrix(scale, scale, 0);
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nPoints / 4, nPoints / 4);

    // draw triangle 3
    modelMatrix.setRotationMatrix(-angle).scaleMatrix(scale, scale, 0);
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nPoints * 2 / 4, nPoints / 2);

    // draw triangle 4
    modelMatrix.setRotationMatrix(-angle / 4).scaleMatrix(scale, scale, 0);
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.TRIANGLES, nPoints * 3 / 4, nPoints / 2);

}

// where transformations should be at currently, accounting for changing browser load
function updateTransformation(angle, scale) {
    const now = Date.now()
    const timeElapsed = now - TIMESTAMP;
    TIMESTAMP = now;

    // rotate at x degrees per second`
    angle = (angle + ROTATIONSPEED * timeElapsed / 1000) % 360;

    // map angle value to scale for convenience
    scale = angle * 2 / 365;

    return [angle, scale];
}

function initSlider(){
    const slider=document.getElementById('slider');
    const speed=document.getElementById('speed');

    slider.addEventListener('input',function(){
        ROTATIONSPEED=parseFloat(slider.value);
        speed.textContent=ROTATIONSPEED;
    })
}