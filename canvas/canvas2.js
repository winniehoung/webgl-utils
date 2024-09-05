/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

let timestamp = Date.now();
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
         0.0, 0.5, 0.94, 0.27, 0.37,
        -0.5, 0.0, 0.92, 0.36, 0.47,
         0.5, 0.0, 0.96, 0.51, 0.56
    ]);
    const nComponents = 2;
    const nData = data.length;

    // buffer links to vertex shader
    if (!initVertexBuffer(context, data, nComponents)) {
        console.error('could not assign vertices');
        return false;
    }

    // assign fragment (color) data
    const fLocation = context.getUniformLocation(context.shaderProgram, 'fColor');
    context.uniform4f(fLocation, 0.85, 0.24, 0.31, 0.98);

    // model matrix and its location
    const modelMatrix = new Matrix();
    const modelMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelMatrix');

    // transformation data, speed in degrees per second
    let angle = 0;
    let frameCount = 0;

    const animate = function () {
        // update transformation constants and render vertices
        let newAngle = updateAngle(angle);
        frameCount++;

        // render graphics
        render(context, nData, nComponents, newAngle, frameCount, modelMatrix, modelMatrixLocation);

        // on 60hz browser, called 60 times/second
        requestAnimationFrame(animate);
    }

    animate();
}

function render(context, nData, nComponents, newAngle, frameCount, modelMatrix, modelMatrixLocation) {
    // set transformation matrix
    modelMatrix.rotateMatrix(newAngle);
    (frameCount % 60 === 0) ? modelMatrix.translateMatrix(0.005, 0, 0) : modelMatrix.translateMatrix(-0.005, 0, 0);

    // assign per frame rotation matrix data
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);

    // clear canvas and draw
    clearCanvas(context, [.2, 0.31, 0.36, 1.0]);
    context.drawArrays(context.TRIANGLES, 0, nData / nComponents);
}

function updateAngle(angle) {
    // rotate at x degrees per second
    const speed = 55;
    let timeElapsed = Date.now() - timestamp;
    timestamp = Date.now();

    // where angle should be at currently, accounting for changing browser load
    return (angle + speed * timeElapsed / 1000) % 360;

}
