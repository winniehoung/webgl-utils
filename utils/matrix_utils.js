/**
 * matrix_utils operates on 4x4 matrix and 4x1 vector representation, mElements represented as (e[0-15]){16};
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
    // transformMatrix x this.mElements

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

/**
 * vector representation for convenience of matrix multiplication, by default 4x1 representation, elements represented as [xyzw]{1};
 * 
 * @param {Float32Array} src - source vector;
 * @param {Float32Array} operandVector - vector to dot product with;
 * this section is vector function constructor, vector scalar multiply function and performance optimization utilities;
 * 
 * design considerations: 
 * are zero vectors common enough in transformations for isZero property overhead;
 * zero source vectors conveniently handled by getBasisIndex
 * handles common basis vectors separately to optimize performance;
 */

const Vector = function (src) {
    // only vectors of 4 elements will be created
    if (src && typeof src === 'object' && src.hasOwnProperty('vElements') && src.vElements.length === 4) {
        // deep copy vElements
        this.vElements = new Float32Array(src.vElements);
        this.isZero = false;

        // basis vectors common in transformation, handle separately
        this.basisIndex = this.getBasisIndex;
    } else {
        // default to zero vector
        this.vElements = new Float32Array([0, 0, 0, 0]);
        this.isZero = true;
        this.basisIndex = -1;
    }
}

Vector.prototype.vDotProduct = function (operandVector) {
    // if there is atleast one basis vector and the two vectors contain an equal nonzero index, returns single product, otherwise returns 0
    if(this.basisIndex!==-1 || operandVector.basisIndex!==-1){
        // case of 2 basis vectors with equal index :
        return (this.basisIndex===operandVector.basisIndex) ? (this.vElements[this.basisIndex]*operandVector.vElements[this.basisIndex]) :
        // instance is the single basis vector, vectors have similar nonzero index :
        (this.basisIndex!==-1 && operandVector.vElements[this.basisIndex]!==0) ? (this.vElements[this.basisIndex]*operandVector.vElements[this.basisIndex]) :
        // operandVector is the single basis vector, vectors have similar nonzero index :
        (operandVector.basisIndex!==-1 && this.vElements[operandVector.basisIndex]!=0) ? (this.vElements[operandVector.basisIndex]*operandVector.vElements[operandVector.basisIndex]) :
        // vectors don't have similar nonzero index
        0;
    }

    // if zero vector, dot product is zero
    if (this.vElements.isZero || operandVector.vElements.isZero) {
        return 0;
    }

    // dot product of two nonzero, nonbasis vectors
    return this.vElements[0] * operandVector[0] +
        this.vElements[1] * operandVector[1] +
        this.vElements[2] * operandVector[2] +
        this.vElements[3] * operandVector[3];
}

// if basis vector, returns index of single nonzero element, else returns -1
Vector.prototype.getBasisIndex = function () {
    // number of zeros and nonzeros
    let nZero = nNonZero = 0;
    // store nonzero index of basis vectors
    let nonZeroIndex = -1;

    // shorcircuit the common zero case, 
    for (let i = 0; i < 4; i++) {
        (!this.vElements[i]) ? nZero++ : (nNonZero++, nonZeroIndex = i);
    }

    // return index if basis, otherwise return -1
    return (nNonZero === 1) ? nonZeroIndex :
        (nNonZero === 0) ? (this.isZero = true, -1) : -1;
}

Vector.prototype.isZeroVector = function () {
    return this.vElements.every(x => x === 0);
}