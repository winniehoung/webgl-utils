/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */


main3();

function main3() {

    const canvas = document.getElementById('canvasid3');
    const context = getContext(canvas);

    console.log('in main3');
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

    // model matrix and transformation
    let modelMatrix = new Matrix().setRotationMatrix(180);
    const modelMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelMatrix');
    context.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);


    clearCanvas(context, [.85,.17,.27, 1.0]);
    context.drawArrays(context.TRIANGLES, 0, nPoints);
}

