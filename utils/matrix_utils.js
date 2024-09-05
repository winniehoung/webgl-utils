/**matrix_utils.js (c) 2024 winniehoung
 * matrix_utils operates on 4x4 matrix and 4x1 vector representation, elements represented as (E[0-15]){16};
 * 
 * m prefix = matrix;
 * v prefix = vector;
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
 * @param {number} T - transform units;
 * @param {number} S - scale factor;
 * @param {number} angle - rotation angle;
 * this section transforms the model matrix by matrix multiplication
 */

Matrix.prototype.translateMatrix = function (Tx, Ty, Tz) {
    this.mMultiply(new Matrix().setTranslationMatrix(Tx, Ty, Tz));
    return this;
}

Matrix.prototype.scaleMatrix = function (Sx, Sy, Sz) {
    this.mMultiply(new Matrix().setScaleMatrix(Sx, Sy, Sz));
    return this;
}

Matrix.prototype.rotateMatrix = function (angle) {
    this.mMultiply(new Matrix().setRotationMatrix(angle));
    return this;
}

/**
 * @param {number} T - transform units;
 * @param {number} S - scale factor;
 * @param {number} angle - rotation angle;
 * this section is functions that return transformation matrices;
 */

Matrix.prototype.setTranslationMatrix = function (Tx, Ty, Tz) {
    if (!this.isIdentity) {
        this.elements = this.getIdentityMatrix();
    }
    this.elements[12] = Tx;
    this.elements[13] = Ty;
    this.elements[14] = Tz;
    this.isIdentity = false;
    return this;
}

Matrix.prototype.setScaleMatrix = function (Sx, Sy, Sz) {
    if (arguments.length < 3) {
        console.error('${arguments.length} arguments provided, 3 needed');
        return this;
    }
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

Matrix.prototype.setRotationMatrix = function (angle) { //currently about z-axis
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