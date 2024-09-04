/**matrix_utils.js (c) 2024 winniehoung
 * matrix_utils operates on 4x4 matrix and 4x1 vector representation, mElements represented as (E[0-15]){16};
 * 
 * m prefix = matrix;
 * v prefix = vector;
 */

/**
 * @param {Matrix} transformMatrix - the next transformation;
 * this section is utils for matrix transformation functions;
 */

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
    const A = transformMatrix.mElements;
    const B = this.mElements;
    const modelMatrix = new Float32Array(16);

    // populate model matrix
    for (let i = 0; i < 4; i++) {
        modelMatrix[i] = (A[0] * B[4 * i]) + (A[4] * B[4 * i + 1]) +
            (A[8] * B[4 * i + 2]) + (A[12] * B[4 * i + 3]);
    }
    for (let i = 0; i < 4; i++) {
        modelMatrix[i + 4] = (A[1] * B[4 * i]) + (A[5] * B[4 * i + 1]) +
            (A[9] * B[4 * i + 2]) + (A[13] * B[4 * i + 3]);
    }
    for (let i = 0; i < 4; i++) {
        modelMatrix[i + 8] = (A[2] * B[4 * i]) + (A[6] * B[4 * i + 1]) +
            (A[10] * B[4 * i + 2]) + (A[14] * B[4 * i + 3]);
    }
    for (let i = 0; i < 4; i++) {
        modelMatrix[i + 12] = (A[3] * B[4 * i]) + (A[7] * B[4 * i + 1]) +
            (A[11] * B[4 * i + 2]) + (A[15] * B[4 * i + 3]);
    }
    // in-place update
    this.mElements.set(modelMatrix);
}

/**
 * @param {Float32Array} src - optional source matrix;
 * this section is Matrix constructor function and transformation functions;
 * 
 * design considerations: 
 * overhead of isIdentity property to eliminate reinitialization of identity matrix;
 */

const Matrix = function (src) {
    // only matrices of 16 elements will be created
    if (src && typeof src === 'object' && src.hasOwnProperty('mElements') && src.mElements.length === 16) {
        // deep copy mElements
        this.mElements = new Float32Array(src.mElements);
        // boolean(1 byte) flag to avoid reinitialization of identity matrix when unnecessary
        this.isIdentity = false;
    } else {
        // no src matrix, default to identity matrix
        this.mElements = this.getIdentityMatrix();
        this.isIdentity = true;
    }
};

/**
 * @param {number} T - transform units;
 * @param {number} S - scale factor;
 * @param {number} angle - rotation angle;
 * this section is functions that return transformation matrices;
 */

Matrix.prototype.setTranslationMatrix = function (Tx, Ty, Tz) {
    if (!this.isIdentity) {
        this.mElements = getIdentityMatrix();
    }
    this.mElements[12] = Tx;
    this.mElements[13] = Ty;
    this.mElements[14] = Tz;
    this.isIdentity = false;
    return this;
}

Matrix.prototype.setScaleMatrix = function (Sx, Sy, Sz) {
    if (!this.isIdentity) {
        this.mElements = getIdentityMatrix();
    }
    this.mElements[0] = Sx;
    this.mElements[5] = Sy;
    this.mElements[10] = Sz;
    this.mElements[15] = 1;
    this.isIdentity = false;
    return this;
}

Matrix.prototype.setRotationMatrix = function (angle) { //currently about z-axis
    if (!this.isIdentity) {
        this.mElements = getIdentityMatrix();
    }
    const radians = Math.PI * angle / 180;
    const cosB = Math.cos(radians);
    const sinB = Math.sin(radians);

    this.mElements[0] = cosB;
    this.mElements[1] = sinB;
    this.mElements[4] = -sinB;
    this.mElements[5] = cosB;
    this.isIdentity = false;
    return this;
}

