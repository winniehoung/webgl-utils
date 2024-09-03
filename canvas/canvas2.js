/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

main(); // function hoisting in JS

function main() {

    const canvas = document.getElementById('canvasid2');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; void main(void){gl_Position=vPosition; gl_PointSize=10.0;}';

    const fShaderSrc = 'precision mediump float; uniform vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('Failed to initialize shaders.');
        return;
    }
    // render triangle vertices
    render(context);

}
function render(context) {
    const data = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    const nComponents = 2;

    if (!initBuffer(context, data, nComponents)) {
        console.error('Could not render vertices.');
        return false;
    }

    // assign fragment shader
    const fLocation = context.getUniformLocation(context.shaderProgram, 'fColor');
    context.uniform4f(fLocation, 1.0, 0.5, 0.31, 1.0);

    clearCanvas(context, [0.799, 0.799, 0.799, 1.0]);
    context.drawArrays(context.POINTS, 0, data.length / nComponents);
}

