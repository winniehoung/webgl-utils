### canvas.html
- Example project utilizing rendering and matrix utils
- Use speed slider to change animation speed

### Instructions
- Save repository to file system, then open `canvas.html` in browser

### rendering_utils.js

- Boilerplate for shader and buffer initialization
- In buffer initialization, when parameter is not provided, GLSL attribute variable `gl_Position`defaults to `vPosition`. Attribute variable name for varying variable `fColor`(vertex colors) defaults to `vColor`. 

### matrix_utils.js
- Matrix prototype and transformations
- `setViewMatrix` aligns world coordinates to camera coordinates
- If you call`setViewMatrix`before transforming with `translateMatrix`|`scaleMatrix`|`rotateMatrix`, result will be `translationMatrix * viewMatrix`

- Properly handle view and transformations by creating a view matrix with `setViewMatrix`and a transformation matrix with 
```
translateMatrix | setTranslationMatrix, 
scaleMatrix | setScaleMatrix, 
rotateMatrix | setRotationMatrix
```
- then pass view matrix to transformation matrix `useViewMatrix(viewMatrix)`