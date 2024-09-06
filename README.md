### Instructions
- Save repository to file system, then open `canvas.html` in browser

### canvas.html
- Example project utilizing rendering and matrix utils
- Use speed slider to change animation speed

### rendering_utils.js

- Boilerplate for shader and buffer initialization
- In buffer initialization, when parameter is not provided, GLSL attribute variable `gl_Position`defaults to `vPosition`. Attribute variable name for varying variable `fColor`(vertex colors) defaults to `vColor`. 

### matrix_utils.js
- Matrix prototype and transformations
- `setViewMatrix` aligns world coordinates to camera coordinates
- If you call`setViewMatrix`before transforming with `translateMatrix`|`scaleMatrix`|`rotateMatrix`, result will be `transformationMatrix * viewMatrix` instead of `viewMatrix * transformationMatrix`
- Properly handle view and transformations by creating a transformation matrix and a view matrix with `setViewMatrix`, then pass view matrix to transformation matrix `useViewMatrix(viewMatrix)`

### General Processing Flow
1. Get `html` canvas and `webgl` context
2. Initialize vertex shader and fragment shader
3. Create buffer, bind data, assign to attribute variable, then enable buffer
4. Clear canvas
5. Render