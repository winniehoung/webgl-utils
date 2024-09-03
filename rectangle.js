

main(); // function hoisting in JS

function main() {

    const canvas = document.getElementById('canvasid');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; void main(void){gl_Position=vPosition; gl_PointSize=10.0;}';

    const fShaderSrc = 'void main(void){gl_FragColor=vec4(1.0,0.0,0.0,1.0);}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('Failed to initialize shaders.');
        return;
    }

    // prepare attribute 
    const vPosition = context.getAttribLocation(context.shaderProgram, 'vPosition');

    // clear canvas
    clearCanvas(context, [0.6, 0.7, 1.0, 1.0]);

    // handle click event
    canvas.onmousedown = function (event) { click(event, canvas, context, vPosition); }

}

// task during click event
let points = [];

function click(event, canvas, context, vPosition) {
    const clientX = event.clientX;
    const clientY = event.clientY;
    const rect = event.target.getBoundingClientRect(); // event.target or canvas

    const maxX = canvas.width / 2;
    const maxY = canvas.height / 2;

    // webgl canvas normalized coordinates
    const x = ((clientX - rect.left) - maxX) / maxX;
    const y = (maxY - (clientY - rect.top)) / maxY;

    points.push([x, y]);

    // clear canvas and draw
    clearCanvas(context, [1.0, 0.7, 0.7, 1.0]);

    for (let i = 0; i < points.length; i++) {
        context.vertexAttrib2f(vPosition, points[i][0], points[i][1]);
        context.drawArrays(context.POINTS, 0, 1);
    }
}