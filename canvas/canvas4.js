/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 * 
 * common bugs: 
 * set shader variables but didn't pass data to it
 * uniformMatrix4fv(location,transpose=false,data)
 */

let ROTATIONSPEED4 = 55;
let TIMESTAMP4 = Date.now();

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
         0.0, 0.5, -0.4, 0.87, 0.93, 0.95,
        -0.5, 0.0, -0.4, 0.90, 0.92, 0.93,
         0.5, 0.0, -0.4, 0.93, 0.88, 0.87,

         0.0, 0.5, -0.2, 0.87, 0.93, 0.95,
        -0.5, 0.0, -0.2, 0.90, 0.92, 0.93,
         0.5, 0.0, -0.2, 0.93, 0.88, 0.87,

         0.0, 0.5, -0.2, 0.87, 0.93, 0.95,
        -0.5, 0.0, -0.2, 0.90, 0.92, 0.93,
         0.5, 0.0, -0.2, 0.93, 0.88, 0.87,

         0.0, 0.5,  0.0, 0.87, 0.93, 0.95,
        -0.5, 0.0,  0.0, 0.90, 0.92, 0.93,
         0.5, 0.0,  0.0, 0.93, 0.88, 0.87,
    ]);

    // data info
    const nPositionComponents = 3;
    const nColorComponents = 3;
    const nPoints = data.length / 6;
    const nObjects = nPoints / 3;
    const nBytes = data.BYTES_PER_ELEMENT;

    // buffer links to vertex shader
    if (!initVertexBuffer(context, data, ['vPosition', 'vColor'], [nPositionComponents, nColorComponents], nBytes * 5, [0, nBytes * nPositionComponents])) {

        console.error('could not assign vertices');
        return false;
    }

    // model view matrix 
    let modelMatrix = new Matrix();
    let viewMatrix = new Matrix().setViewMatrix([.25, .25,.25]);
    const modelViewMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelViewMatrix');

    // transformation data, speed in degrees per second
    let angle = 0;
    let scale = 0;

    initSlider4();

    const animate4 = function () {
        // update transformation constants and render vertices
        [angle, scale] = updateTransformation4(angle, scale);

        // render graphics
        render4(context, nPoints, nObjects, angle, scale, modelMatrix, viewMatrix, modelViewMatrixLocation);

        // on 60hz browser, called 60 times/second
        requestAnimationFrame(animate4);
    }
    animate4();
}

function render4(context, nPoints, nObjects, angle, scale, modelMatrix, viewMatrix, modelViewMatrixLocation) {
    clearCanvas(context, [.25, .17, .34, 1.0]);

    // draw triangles
    modelMatrix.setScaleMatrix(scale, scale, scale).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, 0, nPoints / nObjects);

    modelMatrix.setRotationMatrix(angle).scaleMatrix(scale / 2, scale / 2, scale / 2).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nPoints * 1 / nObjects, nPoints / nObjects);

    modelMatrix.setRotationMatrix(angle).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nPoints * 2 / nObjects, nPoints / nObjects);

    modelMatrix.setRotationMatrix(-angle).scaleMatrix(scale / 2, scale, scale / 2).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, nPoints * 3 / nObjects, nPoints / nObjects);
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

function initSlider4(){
    const slider=document.getElementById('slider');
    const speed=document.getElementById('speed');

    slider.addEventListener('input',function(){
        ROTATIONSPEED4=parseFloat(slider.value);
        speed.textContent=ROTATIONSPEED4;
    })
}