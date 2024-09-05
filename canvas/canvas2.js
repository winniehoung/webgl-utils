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
    const vShaderSrc = 'attribute vec4 vPosition; uniform mat4 modelMatrix; void main(void){gl_Position=modelMatrix*vPosition; gl_PointSize=10.0;}';

    const fShaderSrc = 'precision mediump float; uniform vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('failed to initialize shaders');
        return;
    }
    // vertex data and assign vertices
    const data = new Float32Array([0.0, 0.5, -0.5, 0.0, 0.5, 0.0]);
    const nComponents = 2;
    const nData = data.length;

    if (!initVertexBuffer(context, data, nComponents)) {
        console.error('could not assign vertices');
        return false;
    }

    // assign fragment (color) data
    const fLocation = context.getUniformLocation(context.shaderProgram, 'fColor');
    context.uniform4f(fLocation, 1.0, 0.5, 0.31, 1.0);

    // model matrix and its location
    const modelMatrix = new Matrix();
    const modelMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelMatrix');

    // rotation data, speed in degrees per second
    let angle = 0;

    const animate = function () {
        // update rotation angle and render vertices
        let newAngle = updateAngle(angle);

        render(context, nData, nComponents, newAngle, modelMatrix, modelMatrixLocation);
        requestAnimationFrame(animate);
    }

    animate();
}

function render(context, nData, nComponents, newAngle, modelMatrix, modelMatrixLocation) {
    // set transformation matrix
    modelMatrix.rotateMatrix(newAngle);
    // assign per frame rotation matrix data
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);

    // clear canvas and draw
    clearCanvas(context, [0.799, 0.799, 0.799, 1.0]);
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
