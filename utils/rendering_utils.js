/** rendering_utils.js (c) winniehoung
 * @param {HTMLCanvasElement} canvas - <canvas> element
 * @param {WebGLRenderingContext} context
 * @param {number} color - color of element
 */

function getContext(canvas) {
    if (!canvas) {
        console.error('browser can not retrieve canvas');
        return;
    }

    const context = canvas.getContext('webgl');
    return context;
}

function clearCanvas(context, color) {
    context.clearColor(color[0], color[1], color[2], color[3]);
    context.clear(context.COLOR_BUFFER_BIT);
}

/** handles buffer initialization and enables vertex buffer
 *  @param {Float32Array} data
 *  @param {GLSL Built-in Variable} vPosition - vertex position attribute name
 *  @param {number} nComponents - number of components per vertex
 *  @param {number} stride - num bytes per vertex element in data
 *  @param {number} offset - offset of vertex info in data
 *  
 * context.bindBuffer(target, buffer) - target c.ARRAY_BUFFER, c.ELEMENT_ARRAY_BUFFER
 * context.bindBuffer(target, data, usage) - usage(hint) c.STATIC_DRAW, c.STREAM_DRAW, c.DYNAMIC_DRAW
 * context.vertexAttribPointer(location, ncomponents, datatype, normalize, stride, offset) - ncomponents [1234]{1}, datatype c.FLOAT, normalize true|false, stride num bytes between vertex data elements
 */

// gl_Position required (vPosition)
function initVertexBuffer(context, data, [vPosition = 'vPosition', vColor = ''] = [], [nPositionComponents = 2, nColorComponents = 3] = [], stride, [positionOffset = 0, colorOffset = 0] = []) {

    const buffer = context.createBuffer();

    if (!buffer) {
        console.error('could not create buffer');
        return false;
    }

    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(context.ARRAY_BUFFER, data, context.STATIC_DRAW);
    (context.getError() !== context.NO_ERROR) && console.error('could not bind buffer data');

    // get position location, assign and enable buffer
    const positionLocation = context.getAttribLocation(context.shaderProgram, vPosition);
    positionLocation === -1 && console.error('could not get ${vPosition} position location');
    context.vertexAttribPointer(positionLocation, nPositionComponents, context.FLOAT, false, stride, positionOffset);
    context.enableVertexAttribArray(location);

    // get color location, assign and enable buffer
    if (vColor) {
        const colorLocation = context.getAttribLocation(context.shaderProgram, vColor);
        colorLocation === -1 && console.error('could not get ${vColor} color location');
        context.vertexAttribPointer(colorLocation, nColorComponents, context.FLOAT, false, stride, colorOffset);
        context.enableVertexAttribArray(colorLocation);
    }
    return buffer;
}

/**
 * buffer prototype for dealing with multiple buffers
 *  @param {Float32Array} data
 *  @param {GLSL Built-in Variable} vPosition - vertex position attribute name
 *  @param {number} nComponents - number of components per vertex
 *  @param {number} stride - num bytes per vertex element in data
 *  @param {number} offset - offset of vertex info in data
 */

const Buffer = function (context, data, [vPosition = 'vPosition', vColor = ''] = [], [nPositionComponents = 2, nColorComponents = 3] = [], stride, [positionOffset = 0, colorOffset = 0] = []) {

    const buffer = context.createBuffer();

    if (!buffer) {
        console.error('could not create buffer');
        return false;
    }
    this.context = context;
    this.buffer = buffer;

    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(context.ARRAY_BUFFER, data, context.STATIC_DRAW);
    (context.getError() !== context.NO_ERROR) && console.error('could not bind buffer data');

    // get position location, assign and enable buffer
    const positionLocation = context.getAttribLocation(context.shaderProgram, vPosition);
    positionLocation === -1 && console.error('could not get ${vPosition} position location');
    context.vertexAttribPointer(positionLocation, nPositionComponents, context.FLOAT, false, stride, positionOffset);
    context.enableVertexAttribArray(location);

    this.positionLocation = positionLocation;
    this.nPositionComponents = nPositionComponents;
    this.stride = stride;
    this.positionOffset = positionOffset;

    // get color location, assign and enable buffer
    if (vColor) {
        const colorLocation = context.getAttribLocation(context.shaderProgram, vColor);
        colorLocation === -1 && console.error('could not get ${vColor} color location');
        context.vertexAttribPointer(colorLocation, nColorComponents, context.FLOAT, false, stride, colorOffset);
        context.enableVertexAttribArray(colorLocation);
        this.colorLocation = colorLocation;
        this.nColorComponents = nColorComponents;
        this.colorOffset = colorOffset;
    }
}

Buffer.prototype.useBuffer = function () {
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);

    // bind vertices to buffer
    this.context.vertexAttribPointer(this.positionLocation, this.nPositionComponents, this.context.FLOAT, false, this.stride, this.positionOffset);
    this.context.enableVertexAttribArray(this.positionLocation);

    // bind color components to buffer
    if ('colorLocation' in this) {
        this.context.vertexAttribPointer(this.colorLocation, this.nColorComponents, this.context.FLOAT, false, this.stride, this.colorOffset);
        this.context.enableVertexAttribArray(this.colorLocation);
    }
    return this;
}

/** handles shaders initialization
 * @param {vshader} vShader - vertex shader
 * @param {fshader} fShader - fragment shader
 */

function initShaderProgram(context, vShaderSrc, fShaderSrc) {

    const shaderProgram = createShaderProgram(context, vShaderSrc, fShaderSrc);
    if (!shaderProgram) {
        console.error('failed to create program');
        return false;
    }
    context.useProgram(shaderProgram);
    // assign custom property
    context.shaderProgram = shaderProgram;
    return true;
}

function createShaderProgram(context, vShaderSrc, fShaderSrc) {
    const vShader = compileShader(context, vShaderSrc, context.VERTEX_SHADER);
    const fShader = compileShader(context, fShaderSrc, context.FRAGMENT_SHADER);

    if (!vShader || !fShader) {
        console.error('could not compile shaders');
        return null;
    }

    const shaderProgram = context.createProgram();
    context.attachShader(shaderProgram, vShader);
    context.attachShader(shaderProgram, fShader);
    context.linkProgram(shaderProgram);

    if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS)) {
        console.error('can not initialize shader program: ' + context.getProgramInfoLog(shaderProgram));

        return null;
    }
    return shaderProgram;
}

function compileShader(context, shaderSrc, shaderType) {
    const shader = context.createShader(shaderType);
    context.shaderSource(shader, shaderSrc);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        console.error('error compiling shaders: ' + context.getShaderInfoLog(shader));

        context.deleteShader(shader);
        return null;
    }
    return shader;
}