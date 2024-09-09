/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 * 
 * common bugs: 
 * uniformMatrix4fv(location,transpose=false,data)
 * didn't reset model matrix in animation
 */

// animation constants
let ROTATIONSPEED4 = 55;
let TIMESTAMP4 = Date.now();

// view matrix constants
let CAMERAX = 0;
let CAMERAY = 0;
let CAMERAZ = 0;

main4();

function main4() {

    const canvas = document.getElementById('canvasid4');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; attribute vec4 vColor; varying vec4 fColor; uniform mat4 modelViewMatrix; void main(void){gl_Position=modelViewMatrix*vPosition; fColor=vColor; gl_PointSize=1.0;}';

    const fShaderSrc = 'precision mediump float; varying vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('failed to initialize shaders');
        return;
    }

    // vertex data and assign vertices
    const data = getMandelbrotSet(canvas);

    // data info
    const nPositionComponents = 2;
    const nColorComponents = 3;
    const nPoints = data.length / (nPositionComponents + nColorComponents);
    const nBytes = data.BYTES_PER_ELEMENT;

    const buffer = new Buffer(context, data, ['vPosition', 'vColor'], [nPositionComponents, nColorComponents], nBytes * (nPositionComponents + nColorComponents), [0, nBytes * nPositionComponents]);

    buffer && buffer.useBuffer();

    // model view matrix 
    let modelMatrix = new Matrix();
    let viewMatrix = new Matrix().setViewMatrix([CAMERAX, CAMERAY, CAMERAZ]);
    const modelViewMatrixLocation = context.getUniformLocation(context.shaderProgram, 'modelViewMatrix');

    // transformation data, speed in degrees per second
    let angle = 0;
    let scale = 0;

    // event listener for slider
    initSlider4();
    // event listener for keydown
    document.addEventListener('keydown', function (event) {
        if (event.key == 'ArrowRight') CAMERAX += .1;
        if (event.key == 'ArrowLeft') CAMERAX -= .1;
        if (event.key == 'ArrowUp') CAMERAY += .1;
        if (event.key == 'ArrowDown') CAMERAY -= .1;
        viewMatrix.setViewMatrix([CAMERAX, CAMERAY, CAMERAZ]);
    });

    const animate4 = function () {
        // update transformation constants and render vertices
        ({ angle, scale } = updateTransformation4(angle, scale));

        // render graphics
        render4(context, nPoints, angle, scale, modelMatrix, viewMatrix, modelViewMatrixLocation);

        // on 60hz browser, called 60 times/second
        requestAnimationFrame(animate4);
    }
    animate4();
}

function render4(context, nPoints, angle, scale, modelMatrix, viewMatrix, modelViewMatrixLocation) {
    clearCanvas(context, [.25, .17, .34, 1.0]);

    modelMatrix.setScaleMatrix(scale / 1.2, scale / 1.2, scale / 1.2).rotateMatrix(angle).useViewMatrix(viewMatrix);
    context.uniformMatrix4fv(modelViewMatrixLocation, false, modelMatrix.elements);
    context.drawArrays(context.LINE_LOOP, 0, nPoints);
}

function getMandelbrotSet(canvas) {
    // canvas pixels
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // mandelbrot set input range
    const minReal = -2.5, maxReal = 1;
    const minImaginary = -1.5, maxImaginary = 1.5;

    // max iterations to identify if point escapes circle
    const maxIterations = 1000;

    // scale pixel to complex number
    const pixel2Complex = (x, y, canvasWidth, canvasHeight, minReal, maxReal, minImaginary, maxImaginary) => ({ complexReal: minReal + x * (maxReal - minReal) / canvasWidth, complexImaginary: minImaginary + y * (maxImaginary - minImaginary) / canvasHeight });

    // returns escape speed for mandelbrot set
    const mandelbrot = function (complexReal, complexImaginary, maxIterations) {
        // complex number = a + bi
        let zReal = complexReal, zImaginary = complexImaginary;
        let nIterations = 0;

        while (nIterations < maxIterations) {
            // check if element is in x^2+y^2=4
            const zRealSquare = zReal * zReal;
            const zImaginarySquare = zImaginary * zImaginary;

            if (zRealSquare + zImaginarySquare > 4) break;

            // z_n+1=z_n^2+c
            // z_n+1=(a+bi)^2+c=(a^2-b^2+c)+(2ab+c)i
            const newZReal = zRealSquare - zImaginarySquare + complexReal;
            const newZImaginary = 2 * zReal * zImaginary + complexImaginary;

            zReal = newZReal;
            zImaginary = newZImaginary;
            nIterations++;
        }
        return nIterations;
    }

    // mandelbrot set data, each vertex with 2 position components, 3 color components
    const data = new Float32Array(canvasWidth * canvasHeight * 5);

    // normalize pixels to webgl coordinates
    const normalize = (x, y) => ({ normalizedX: x * 2 / canvasWidth - 1, normalizedY: y * 2 / canvasHeight - 1 });

    const getEscapeColor = (iteration, maxIterations) => {

        if (iteration === maxIterations) {
            return { r: 0.96, g: 0.94, b: 0.86 };

        } else {
            return { r: 0.25, g: 0.17, b: 0.34 };
        }

    };

    let dataIndex = 0;
    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {

            const { complexReal, complexImaginary } = pixel2Complex(x, y, canvasWidth, canvasHeight, minReal, maxReal, minImaginary, maxImaginary);

            const iterationCount = mandelbrot(complexReal, complexImaginary, maxIterations);

            const { normalizedX, normalizedY } = normalize(x, y);
            const color = getEscapeColor(iterationCount, maxIterations);
            data[dataIndex] = normalizedX;
            data[dataIndex + 1] = normalizedY;
            data[dataIndex + 2] = color.r;
            data[dataIndex + 3] = color.g;
            data[dataIndex + 4] = color.b;

            dataIndex += 5;
        }
    }
    return data;
}

function updateTransformation4(angle, scale) {
    const now = Date.now()
    const timeElapsed = now - TIMESTAMP4;
    TIMESTAMP4 = now;

    // rotate at x degrees per second`
    angle = (angle + ROTATIONSPEED4 * timeElapsed / 1000) % 360;

    // scale = 1 + Math.sin(angle * Math.PI / 180) * 0.5;
    scale = angle * 1.5 / 360;
    return { angle, scale };
}

function initSlider4() {
    const slider = document.getElementById('slider');
    const speed = document.getElementById('speed');

    slider.addEventListener('input', function () {
        ROTATIONSPEED4 = parseFloat(slider.value);
        speed.textContent = ROTATIONSPEED4;
    })
}
