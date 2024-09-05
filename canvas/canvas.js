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
        console.error('failed to initialize shaders.');
        return;
    }

    // prepare shader variables, grab memory location 
    const vLocation = context.getAttribLocation(context.shaderProgram, 'vPosition');
    const fLocation = context.getUniformLocation(context.shaderProgram, 'fColor');

    // clear canvas
    clearCanvas(context, [.97, .75, .27, 1]);

    // handle click event on DOM element
    const clickHandler = createClickHandler();

    canvas.addEventListener('click', function (event) { clickHandler(event, canvas, context, vLocation, fLocation); });
}
// task during click event
function createClickHandler() {
    const vPoints = [];
    const fColors = [];

    return function (event, canvas, context, vLocation, fLocation) {
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
            fColors.push([.87, .93, .95, 1.0]);
        } else if (x < 0.0 && y < 0.0) {
            fColors.push([.95, .34, .22, 0.8]);
        } else {
            fColors.push([.97, .88, .55, 1.0]);
        }

        // clear canvas and draw
        clearCanvas(context, [.73, .64, .78, 1.0]);

        for (let i = 0; i < vPoints.length; i++) {
            context.vertexAttrib2fv(vLocation, [vPoints[i][0], vPoints[i][1]]);
            context.uniform4f(fLocation, fColors[i][0], fColors[i][1], fColors[i][2], fColors[i][3]);
            context.drawArrays(context.POINTS, 0, 1);
        }
    }
}

