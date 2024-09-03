/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 * 
 * rotation info
 * x=rcosA, y=rsinA: rotate by B, about z-axis
 * x'=rcos(A+B)=r(cosAcosB-sinAsinB)=xcosB-ysinB
 * y'=rsin(A+B)=r(cosAsinB+cosBsinA)=xsinB+ycosB
 * z'= z
 * w'= 1
 */
main2();

function main2() {

    const canvas = document.getElementById('canvasid2');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; uniform mat4 rotationMatrix; uniform mat4 scaleMatrix; void main(void){gl_Position=scaleMatrix*rotationMatrix*vPosition;}';

    const fShaderSrc = 'precision mediump float; uniform vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('Failed to initialize shaders.');
        return;
    }
    // render vertices
    if (!render(context)) {
        console.error('Trouble rendering...');
        return;
    }

}
function render(context) {
    const data = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    const nComponents = 2;

    // assign vertices
    if (!initVertexBuffer(context, data, nComponents)) {
        console.error('Could not render vertices.');
        return false;
    }
    // get fragment location and assign data
    const fLocation = context.getUniformLocation(context.shaderProgram, 'fColor');
    context.uniform4f(fLocation, 1.0, 0.5, 0.31, 1.0);

    // rotation data
    const angleB = 90;
    const radianB = Math.PI * angleB / 180.0;
    const cosB = Math.cos(radianB);
    const sinB = Math.sin(radianB);
    console.log('cosB, sinB: ' + cosB + ' ' + sinB);

    const rotationMatrix = new Float32Array([
        cosB, sinB, 0, 0,
        -sinB, cosB, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    // assign rotation matrix data
    const rotationMatrixLocation=context.getUniformLocation(context.shaderProgram, 'rotationMatrix');
    context.uniformMatrix4fv(rotationMatrixLocation, false, rotationMatrix);

    // scale data
    const scale=0.5;
    
    const scaleMatrix=new Float32Array([
        scale, 0, 0, 0,
        0, scale, 0, 0,
        0,0,scale,0,
        0,0,0,1
    ])

    // assign scale matrix data
    const scaleMatrixLocation=context.getUniformLocation(context.shaderProgram, 'scaleMatrix');
    context.uniformMatrix4fv(scaleMatrixLocation, false, scaleMatrix);

    // clear canvas and draw
    clearCanvas(context, [0.799, 0.799, 0.799, 1.0]);
    context.drawArrays(context.TRIANGLES, 0, data.length / nComponents);

    return true;
}

