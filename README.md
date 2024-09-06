### canvas.html
- example project utilizing rendering and matrix utils

#### instructions
- save repository to file system, then open `canvas.html` in browser

### rendering_utils.js

- boilerplate for shader and buffer initialization
- in buffer initialization, GLSL variable `gl_Position` defaults to `'vPosition'` when parameter is not provided

### matrix_utils.js
- matrix prototype and transformations
- `setViewMatrix` aligns world coordinates to camera coordinates
- if you want to set camera view that is not at the default origin, call `setViewMatrix`before transforming with `translateMatrix`, `scaleMatrix`, `rotateMatrix`