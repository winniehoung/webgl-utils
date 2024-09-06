/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

let ROTATIONSPEED3 = 55;
let TIMESTAMP3 = Date.now();

main3();

function main3() {

    const canvas = document.getElementById('canvasid3');
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
         0.0, 0.5, 0.87, 0.93, 0.95,
        -0.5, 0.0, 0.90, 0.92, 0.93,
         0.5, 0.0, 0.93, 0.88, 0.87,

         0.0, 0.5, 0.87, 0.93, 0.95,
        -0.5, 0.0, 0.90, 0.92, 0.93,
         0.5, 0.0, 0.93, 0.88, 0.87,

         0.0, 0.5, 0.87, 0.93, 0.95,
        -0.5, 0.0, 0.90, 0.92, 0.93,
         0.5, 0.0, 0.93, 0.88, 0.87,

         0.0, 0.5, 0.87, 0.93, 0.95,
        -0.5, 0.0, 0.90, 0.92, 0.93,
         0.5, 0.0, 0.93, 0.88, 0.87,
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

    // model matrix and location
    let modelMatrix = new Matrix();
    const modelMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelMatrix');

    // transformation data, speed in degrees per second
    let angle = 0;
    let scale = 0;

    initSlider3();

    const animate3 = function () {
        // update transformation constants and render vertices
        [angle, scale] = updateTransformation3(angle, scale);

        // render graphics
        render3(context, nPoints, angle, scale, modelMatrix, modelMatrixLocation);

        // on 60hz browser, called 60 times/second
        requestAnimationFrame(animate3);
    }
    animate3();
}

function render3(context, nPoints, angle, scale, modelMatrix, modelMatrixLocation) {
    clearCanvas(context, [.85, .17, .27, 1.0]);

    modelMatrix.setRotationMatrix(180).scaleMatrix(scale,scale,0);
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, 0, nPoints/4);

    modelMatrix.setRotationMatrix(angle).scaleMatrix(scale,scale,0);
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nPoints/4, nPoints/4);

    modelMatrix.setScaleMatrix(scale,scale,0);
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nPoints*2/4, nPoints/4);

    modelMatrix.setRotationMatrix(-angle).scaleMatrix(scale,scale,0);
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nPoints*3/4, nPoints/4);
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