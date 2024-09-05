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

    // render vertices
    render(context);

}
function render(context) {

    const data = new Float32Array([0.0, 0.5,-0.5,0.0,0.5,0.0]);
    const nComponents = 2;

    // assign vertices
    if (!initVertexBuffer(context, data, nComponents)) {
        console.error('could not render vertices');
        return false;
    }
    // get fragment location and assign data
    const fLocation = context.getUniformLocation(context.shaderProgram, 'fColor');
    context.uniform4f(fLocation, 1.0, 0.5, 0.31, 1.0);


    // rotation data
    const angleB = 180;
    const radianB = Math.PI * angleB / 180.0;
    const cosB = Math.cos(radianB);
    const sinB = Math.sin(radianB);

    // scale data
    const scale = 0.5;

    const modelMatrix = new Matrix();
    console.log('model matrix elements: ' + modelMatrix.elements);

    modelMatrix.translateMatrix(0.4,0.5,0);
    console.log('translated matrix elements: ' + modelMatrix.elements);

    // assign rotation matrix data
    const rotationMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelMatrix');
    context.uniformMatrix4fv(rotationMatrixLocation, false, modelMatrix.elements);

    // clear canvas and draw
    clearCanvas(context, [0.799, 0.799, 0.799, 1.0]);
    context.drawArrays(context.TRIANGLES, 0, data.length / nComponents);

    return true;
}

