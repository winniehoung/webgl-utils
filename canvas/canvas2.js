/**
 * 'v' prefix for vertex
 * 'f' prefix for fragment
 * 
 * rotation info
 * x=rcosA, y=rsinA: rotate by B, about z-axis
 * x'=rcos(A+B)=r(cosAcosB-sinAsinB)=xcosB-ysinB
 * y'=rsin(A+B)=r(cosAsinB+cosBsinA)=xsinB+ycosB
 * z'= z
 */
main2(); 

function main2() {

    const canvas = document.getElementById('canvasid2');
    const context = getContext(canvas);

    // shader programs
    const vShaderSrc = 'attribute vec4 vPosition; uniform vec2 cosBsinB; void main(void){gl_Position.x=vPosition.x*cosBsinB.x-vPosition.y*cosBsinB.y; gl_Position.y=vPosition.x*cosBsinB.y+vPosition.y*cosBsinB.x; gl_Position.z=vPosition.z; gl_Position.w=1.0;}';

    const fShaderSrc = 'precision mediump float; uniform vec4 fColor; void main(void){gl_FragColor=fColor;}';

    // initialize shaders
    if (!initShaderProgram(context, vShaderSrc, fShaderSrc)) {
        console.error('Failed to initialize shaders.');
        return;
    }
    // render vertices
    if(!render(context)){
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
    // assign fragments
    const fLocation = context.getUniformLocation(context.shaderProgram, 'fColor');
    context.uniform4f(fLocation, 1.0, 0.5, 0.31, 1.0);

    // rotation data
    const angleB=-90.0;
    const radianB=Math.PI*angleB/180.0;
    const cosB=Math.cos(radianB);
    const sinB=Math.sin(radianB);
    const cosBsinB=new Float32Array([cosB, sinB]);

    // assign vertex rotations
    const cosBsinBLocation=context.getUniformLocation(context.shaderProgram, 'cosBsinB');

    context.uniform2f(cosBsinBLocation, cosBsinB[0], cosBsinB[1]);

    clearCanvas(context, [0.799, 0.799, 0.799, 1.0]);
    context.drawArrays(context.TRIANGLES, 0, data.length / nComponents);

    return true;
}

