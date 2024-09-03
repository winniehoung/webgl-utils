/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

// translations
const Tx = 0.5, Ty = 0.5, Tz = 0.0;

main2(); 



function main2() {

    const canvas = document.getElementById('canvasid2');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; uniform vec4 vTranslation;void main(void){gl_Position=vPosition+vTranslation;}';

    const fShaderSrc = 'precision mediump float; uniform vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('Failed to initialize shaders.');
        return;
    }
    // render vertices
    if(!render(context)){
        console.error('Trouble rendering...');
        return;
    }

}
function render(context) {
    const data = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    const nComponents = 2;

    // assign vertices
    if (!initVertexBuffer(context, data, nComponents)) {
        console.error('Could not render vertices.');
        return false;
    }
    // assign fragments
    const fLocation = context.getUniformLocation(context.shaderProgram, 'fColor');
    context.uniform4f(fLocation, 1.0, 0.5, 0.31, 1.0);

    // assign vertex translations
    const vTranslationLocation=context.getUniformLocation(context.shaderProgram, 'vTranslation');
    context.uniform4f(vTranslationLocation, Tx, Ty, Tz, 0.0);

    clearCanvas(context, [0.799, 0.799, 0.799, 1.0]);
    context.drawArrays(context.TRIANGLES, 0, data.length / nComponents);

    return true;
}

