/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 */

main(); // function hoisting in JS

function main() {

    const canvas = document.getElementById('canvasid');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; void main(void){gl_Position=vPosition; gl_PointSize=10.0;}';

    const fShaderSrc = 'precision mediump float; uniform vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('Failed to initialize shaders.');
        return;
    }

    // prepare shader variables 
    const vLocation = context.getAttribLocation(context.shaderProgram, 'vPosition');
    const fLocation = context.getUniformLocation(context.shaderProgram, 'fColor');

    // clear canvas
    clearCanvas(context, [0.6, 0.7, 1.0, 1.0]);

    // handle click event
    canvas.onmousedown = function (event) { click(event, canvas, context, vLocation, fLocation); }

}

// task during click event
const vPoints = [];
const fColors = [];

function click(event, canvas, context, vLocation, fLocation) {
    const clientX = event.clientX;
    const clientY = event.clientY;
    const rect = event.target.getBoundingClientRect(); // event.target or canvas

    const maxX = canvas.width / 2;
    const maxY = canvas.height / 2;

    // webgl canvas normalized coordinates
    const x = ((clientX - rect.left) - maxX) / maxX;
    const y = (maxY - (clientY - rect.top)) / maxY;

    // store data points
    vPoints.push([x, y]);
    if (x >= 0.0 && y >= 0.0) {
        fColors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x < 0.0 && y < 0.0) {
        fColors.push([0.0, 0.0, 1.0, 1.0]);
    } else {
        fColors.push([1.0, 1.0, 1.0, 1.0]);
    }

    // clear canvas and draw
    clearCanvas(context, [1.0, 0.7, 0.7, 1.0]);

    for (let i = 0; i < vPoints.length; i++) {
        context.vertexAttrib2fv(vLocation, [vPoints[i][0], vPoints[i][1]]);
        context.uniform4f(fLocation, fColors[i][0], fColors[i][1], fColors[i][2], fColors[i][3]);
        context.drawArrays(context.POINTS, 0, 1);
    }
}