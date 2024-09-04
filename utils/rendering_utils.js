/** for JSDoc, created by winniehoung
 * @param {HTMLCanvasElement} canvas - <canvas> element
 * @param {WebGLRenderingContext} context
 * @param {number} color - color of element
 */

function getContext(canvas) {
    if (!canvas) {
        console.error('Browser can not retrieve canvas');
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
 *  @param {number} nComponents - number of components per vertex
 *  @param {GLSL Built-in Variable} vAttributeName - vertex attribute name
 */

function initVertexBuffer(context, data, nComponents, vAttributeName='vPosition') {
    const buffer = context.createBuffer();

    if (!buffer) {
        console.error('Could not create buffer.');
        return false;
    }

    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(context.ARRAY_BUFFER, data, context.STATIC_DRAW);

    const location = context.getAttribLocation(context.shaderProgram, vAttributeName);
    context.vertexAttribPointer(location, nComponents, context.FLOAT, false, 0, 0);
    context.enableVertexAttribArray(location);

    return true;
}

/** handles shaders initialization
 * @param {vshader} vShader - vertex shader
 * @param {fshader} fShader - fragment shader
 */

function initShaderProgram(context, vShaderSrc, fShaderSrc) {

    const shaderProgram = createShaderProgram(context, vShaderSrc, fShaderSrc);
    if (!shaderProgram) {
        console.error('Failed to create program');
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
        console.error('Could not compile shaders.');
        return null;
    }

    const shaderProgram = context.createProgram();
    context.attachShader(shaderProgram, vShader);
    context.attachShader(shaderProgram, fShader);
    context.linkProgram(shaderProgram);

    if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS)) {
        console.error('Can not initialize shader program: ' + context.getProgramInfoLog(shaderProgram));

        return null;
    }
    return shaderProgram;
}

function compileShader(context, shaderSrc, shaderType) {
    const shader = context.createShader(shaderType);
    context.shaderSource(shader, shaderSrc);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        console.error('Error compiling shaders: ' + context.getShaderInfoLog(shader));

        context.deleteShader(shader);
        return null;
    }
    return shader;
}