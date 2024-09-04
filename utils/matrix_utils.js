/**
 * by default 4x4 matrix representation
 * 
 * utils for modeling transformations:
 */
function getIdentityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

function getZeroMatrix() {
    return new Float32Array([
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ])
}

function multiplyMatrix() {

}

/**
 * @param {Float32Array} src - optional source matrix
 * Matrix constructor function
 */

const Matrix = function (src) {

    if (src && typeof src == 'object' && src.hasOwnProperty('elements')) {
        // deep copy elements
        this.elements = new Float32Array(src.elements);
    } else {
        // no src matrix, default to identity matrix
        this.elements = getIdentityMatrix();
    }
};


/**
 * these return transformation matrices:
 * @param {number} T - transform units
 * @param {number} S - scale factor
 * @param {number} angle - rotation angle
 */
Matrix.prototype.setTranslationMatrix = function (Tx, Ty, Tz) {
    this.elements = getIdentityMatrix();
    this.elements[12] = Tx;
    this.elements[13] = Ty;
    this.elements[14] = Tz;
    return this;
}

Matrix.prototype.setScaleMatrix = function (Sx, Sy, Sz) {
    this.elements = getZeroMatrix();
    this.elements[0] = Sx;
    this.elements[5] = Sy;
    this.elements[10] = Sz;
    this.elements[15] = 1;
    return this;
}

Matrix.prototype.setRotationMatrix = function (angle) {
    const radians = Math.PI * angle / 180;
    const cosB = Math.cos(radians);
    const sinB = Math.sin(radians);

    this.elements = getIdentityMatrix();
    this.elements[0] = cosB;
    this.elements[1] = sinB;
    this.elements[4] = -sinB;
    this.elements[5] = cosB;
}
