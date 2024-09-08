/**matrix_utils.js (c) 2024 winniehoung
 * matrix_utils operates on 4x4 matrix and 4x1 vector representation, elements represented as (E[0-15]){16};
 * 
 * m prefix = matrix;
 * v prefix = vector;
 * 
 * design considerations: 
 * some parameters grouped in arrays for readability and convenience in function calling, may remove arrays for efficiency
 */

/**
 * @param {Float32Array} src - optional source matrix;
 * this section is Matrix constructor function transformation utilities;
 * 
 * design considerations: 
 * overhead of isIdentity property to eliminate reinitialization of identity matrix;
 */
const Matrix = function (src) {
    // only matrices of 16 elements will be created
    if (src && typeof src === 'object' && src.hasOwnProperty('elements') && src.elements.length === 16) {
        // deep copy elements
        this.elements = new Float32Array(src.elements);
        // boolean(1 byte) flag to avoid reinitialization of identity matrix when unnecessary
        this.isIdentity = false;
    } else {
        // no src matrix, default to identity matrix
        this.elements = this.getIdentityMatrix();
        this.isIdentity = true;
    }
}

Matrix.prototype.getIdentityMatrix = function () {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

Matrix.prototype.mMultiply = function (transformMatrix) {
    // transformMatrix(rows) x thisMatrix(columns): (A[0-3] x B[0-3])
    const A = transformMatrix.elements;
    const B = this.elements;
    const modelMatrix = new Float32Array(16);

    // populate model matrix
    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {

            modelMatrix[row + 4 * column] =
                A[row + 0] * B[4 * column + 0] +
                A[row + 4] * B[4 * column + 1] +
                A[row + 8] * B[4 * column + 2] +
                A[row + 12] * B[4 * column + 3];
        }
    }
    // in-place update
    this.elements.set(modelMatrix);
}

/**
 * @param {number} camera - starting point from which 3D space viewed
 * @param {number} point - look-at point, together with camera determines direction of line of sight
 * @param {number} up - up direction while viewing from camera to point
 * this section constructs and sets view matrix:
 * 
 * 3x3 rotation component rotates world coordinates to align with camera coordinates
 * 3x1 (row order) translation component moves world in opposite direction (of camera translation) so camera is positioned at the origin
 * 
 * 1. find Forward vector (forward) and normalize 
 * 2. find Right vector (right) and normalize - F x U
 * 3. Find accurate unit Up vector (trueU) - Rnorm x Fnorm, U is recalculated for numerical stability
 * 4. populate view matrix with F, R, U and translation components - use original Up vector to ensure consistency with user input, also, translation components independent of rotation components
 */

Matrix.prototype.setViewMatrix = function ([cameraX = 0, cameraY = 0, cameraZ = 0] = [], [pointX = 0, pointY = 0, pointZ = -1] = [], [upX = 0, upY = 1, upZ = 0] = []) {

    // forward vector and magnitude
    let forwardX = pointX - cameraX;
    let forwardY = pointY - cameraY;
    let forwardZ = pointZ - cameraZ;
    let forwardMagnitude = Math.sqrt(forwardX * forwardX + forwardY * forwardY + forwardZ * forwardZ);

    // forward unit vector
    forwardX /= forwardMagnitude;
    forwardY /= forwardMagnitude;
    forwardZ /= forwardMagnitude;

    // right vector
    let rightX = forwardY * upZ - forwardZ * upY;
    let rightY = forwardX * upZ - forwardZ * upX;
    let rightZ = forwardX * upY - forwardY * upX;
    let rightMagnitude = Math.sqrt(rightX * rightX + rightY * rightY + rightZ * rightZ);

    // right unit vector
    rightX /= rightMagnitude;
    rightY /= rightMagnitude;
    rightZ /= rightMagnitude;

    // true up unit vector
    let trueUpX = rightY * forwardZ - rightZ * forwardY;
    let trueUpY = rightX * forwardZ - rightZ * forwardX;
    let trueUpZ = rightX * forwardY - rightY * forwardX;

    // populate rotation part of view matrix
    this.elements[0] = rightX;
    this.elements[1] = trueUpX;
    this.elements[2] = -forwardX;
    this.elements[3] = 0;

    this.elements[4] = rightY;
    this.elements[5] = trueUpY;
    this.elements[6] = -forwardY;
    this.elements[7] = 0;

    this.elements[8] = rightZ;
    this.elements[9] = trueUpZ;
    this.elements[10] = -forwardZ;
    this.elements[11] = 0;

    // translation part of view matrix
    this.elements[12] = rightX * -cameraX + rightY * -cameraY + rightZ * -cameraZ;
    this.elements[13] = upX * -cameraX + upY * -cameraY + upZ * -cameraZ;
    this.elements[14] = forwardX * cameraX + forwardY * cameraY + forwardZ * cameraZ;
    this.elements[15] = 1;

    return this;
}

Matrix.prototype.useViewMatrix = function (viewMatrix) {
    this.mMultiply(viewMatrix);
    return this;
}

/**
 * orthographic projection to handle clipping: 
 * @param {number} right - positive x coord of viewing volume
 * @param {number} left - negative x coord of viewing volume
 * @param {number} top - positive y coord of viewing volume
 * @param {number} bottom - negativ ey coord of viewing volume
 * @param {number} far - positive z coord of viewing volume
 * @param {number} near - negative z coord of viewing volume 
 * 
 * contains components:
 * 1. scale to NDC 
 * 2. translate world so center of view volume at origin
 */

Matrix.prototype.setBoxProjection = function (right, left, top, bottom, far, near) {

    if (right === left || top === bottom || far === near) {
        throw 'invalid input to box projection';
    }

    // empty initialized matrix is already identity matrix
    // scale components
    this.elements[0] = 2 / (right - left);
    this.elements[5] = 2(top - bottom);
    this.elements[10] = -2 / (far - near);

    // translation components
    this.elements[12] = -(right + left) / (right - left);
    this.elements[13] = -(top + bottom) / (top - bottom);
    this.elements[14] = -(far + near) / (far - near);

    return this;
}

Matrix.prototype.useBoxProjection = function (projectionMatrix) {
    this.mMultiply(projectionMatrix);
    return this;
}

/**
 * @param {number} T - transform units;
 * @param {number} S - scale factor;
 * @param {number} angle - rotation angle;
 * this section transforms the model matrix by matrix multiplication
 */

Matrix.prototype.translateMatrix = function (Tx = 0, Ty = 0, Tz = 0) {
    this.mMultiply(new Matrix().setTranslationMatrix(Tx, Ty, Tz));
    return this;
}

Matrix.prototype.scaleMatrix = function (Sx = 1, Sy = 1, Sz = 1) {
    this.mMultiply(new Matrix().setScaleMatrix(Sx, Sy, Sz));
    return this;
}

Matrix.prototype.rotateMatrix = function (angle = 0) {
    this.mMultiply(new Matrix().setRotationMatrix(angle));
    return this;
}

/**
 * @param {number} T - transform units;
 * @param {number} S - scale factor;
 * @param {number} angle - rotation angle;
 * this section is functions that return transformation matrices;
 */

Matrix.prototype.setTranslationMatrix = function (Tx = 0, Ty = 0, Tz = 0) {
    if (!this.isIdentity) {
        this.elements = this.getIdentityMatrix();
    }
    this.elements[12] = Tx;
    this.elements[13] = Ty;
    this.elements[14] = Tz;
    this.isIdentity = false;
    return this;
}

Matrix.prototype.setScaleMatrix = function (Sx = 1, Sy = 1, Sz = 1) {
    if (!this.isIdentity) {
        this.elements = this.getIdentityMatrix();
    }
    this.elements[0] = Sx;
    this.elements[5] = Sy;
    this.elements[10] = Sz;
    this.elements[15] = 1;
    this.isIdentity = false;
    return this;
}

Matrix.prototype.setRotationMatrix = function (angle = 0) { //currently about z-axis
    if (!this.isIdentity) {
        this.elements = this.getIdentityMatrix();
    }
    const radians = Math.PI * angle / 180;
    const cosB = Math.cos(radians);
    const sinB = Math.sin(radians);

    this.elements[0] = cosB;
    this.elements[1] = sinB;
    this.elements[4] = -sinB;
    this.elements[5] = cosB;
    this.isIdentity = false;
    return this;
}