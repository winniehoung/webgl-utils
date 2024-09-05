/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

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

    // rotation data
    let angle=0;

    const animate = function () {
        // update rotation angle and render vertices
        angle+=5;
        render(context, nData, nComponents, angle,modelMatrix, modelMatrixLocation);
        requestAnimationFrame(animate);
    }

    animate();
}

function render(context, nData, nComponents, angle,modelMatrix, modelMatrixLocation) {
    // set transformation matrix
    modelMatrix.rotateMatrix(angle);
    // assign per frame rotation matrix data
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);

    // clear canvas and draw
    clearCanvas(context, [0.799, 0.799, 0.799, 1.0]);
    context.drawArrays(context.TRIANGLES, 0, nData / nComponents);
}

