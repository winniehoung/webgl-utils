### canvas.html
- Example project utilizing rendering and matrix utils

### Instructions
- Save repository to file system, then open `canvas.html` in browser

### rendering_utils.js

- Boilerplate for shader and buffer initialization
- In buffer initialization, when parameter is not provided, GLSL attribute variable `gl_Position`defaults to `vPosition`. Attribute variable name for varying variable `fColor`(vertex colors) defaults to `vColor`. 

### matrix_utils.js
- Matrix prototype and transformations
- `setViewMatrix` aligns world coordinates to camera coordinates
- If you want to set camera view that is not at the default origin, call `setViewMatrix`before transforming with `translateMatrix`, `scaleMatrix`, `rotateMatrix`