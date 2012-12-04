
// Textured Sphere Example
// Curran Kelleher 11/27/2012
// Derived from Ed Angel's example:
// http://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SIXTH_EDITION/CODE/WebGL/CHAPTER05/chap5ex3.html

var canvas;
var gl;

var gridSize = 100;
var gridWidth = gridSize;
var gridHeight = gridSize;

// The arrays 'vertices'
// contains a grid of vertices and their corresponding normals.
// These are flattened 2D arrays indexed as follows:
//   index = i * (gridWidth + 1) * j;
// 
// 'vertices' contains extra vertices that are not drawn.
// These are included so the normals along the edges can be computed.
// For 'vertices':
//   0 <= i <= gridWidth
//   0 <= j <= gridHeight
var vertices = [];

// The spherical coordinates corresponding to
// vertices. Used for texture mapping.
var sphericalCoords = [];

// This function computes the index from i and j grid coordinates.
var indexFromIJ = function(i, j){
  return i + j * (gridWidth + 1);
};

// These point and normal arrays are passed into the GPU.
// The layout is determined by a zig-zag pattern over the
// grid required for using TRIANGLE_STRIP.
// The content is derived from the original 'vertices'
// and 'normals' arrays.
var pointsArray = [];
var sphericalCoordsArray = [];

window.onload = init;

var program;

var Xaxis = 0;
var Yaxis = 1;
var Zaxis = 2;
var Axis = Yaxis;
var theta = [-1, 0, 0];
var thetaVelocity = [0, 0, 0];
var dampening = 0.98;


var ThetaId;

var texture, textureInitialized = false;
function initTexture() {
  texture = gl.createTexture();
  texture.image = new Image();
  texture.image.crossOrigin = '';
  texture.image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 
                  gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
    textureInitialized = true;
  }
  //image from http://www.naturalearthdata.com/
}

function setTextureImage(imageName){
  console.log("initializing "+imageName);
  texture.image.src = "http://universaldatacube.org/0.2/examples/naturalEarthWebGLSphere/images/"+imageName+".jpg";
}

function initVertices(){
  var i, j, 
      theta, phi,
      // .95 is chosen as the diameter of the Earth
      // so it fits comfortably within the display.
      rho = .95,
      x, y, z, vertex, index;
  for(j = 0; j <= gridHeight; j++){
    for(i = 0; i <= gridWidth; i++){
      theta = i / (gridWidth - 1) * Math.PI;
      phi = j / (gridHeight - 1) * Math.PI * 2;

      // Uncommenting this line with make the earth a crazy shape
      //rho = 0.7 + Math.sin(theta * 10)/10 + Math.sin(phi * 6)/10;

      // from http://en.wikipedia.org/wiki/Spherical_coordinate_system
      x = rho * Math.sin(theta) * Math.cos(phi);
      y = rho * Math.sin(theta) * Math.sin(phi);
      z = rho * Math.cos(theta);
      
      vertex = [x, y, z, 1];
      index = indexFromIJ(i, j);
      vertices[index] = vertex;
      sphericalCoords[index] = [
        j / (gridWidth - 1), 
        // inverted coordinate here so the world is not upside down
        -i / (gridHeight - 1)
      ];
    }
  }
}

function initPointsAndNormalsArrays(){
  var i = -1, a, b, c, d,
      iLimit, iIncrement;
  for(j = 0; j < gridHeight - 1; j++){
    // Zig
    if(i === -1){
      iLimit = gridWidth - 1;
      iIncrement = 1;
    }
    // Zag
    else if(i === (gridWidth - 1)){
      iLimit = -1;
      iIncrement = -1;
    }
    i+= iIncrement;
    for(; i != iLimit; i+= iIncrement){
      
      // For each (i,j) position, add two triangles
      //
      // Layout:  a - b
      //          | / |
      //          c - d
      //
      // Triangles:
      //
      //  * (v[a], v[b], v[c])
      //  * (v[b], v[c], v[d])
      
      a = indexFromIJ(  i  ,   j  );
      b = indexFromIJ(i + 1,   j  );
      c = indexFromIJ(  i  , j + 1);
      d = indexFromIJ(i + 1, j + 1);
      
      pointsArray.push(point4.create(vertices[a]));
      sphericalCoordsArray.push(sphericalCoords[a]);
      
      pointsArray.push(point4.create(vertices[b]));
      sphericalCoordsArray.push(sphericalCoords[b]);
      
      pointsArray.push(point4.create(vertices[c]));
      sphericalCoordsArray.push(sphericalCoords[c]);
      
      pointsArray.push(point4.create(vertices[d]));
      sphericalCoordsArray.push(sphericalCoords[d]);
    }
  }
}


function resizeIfNeeded(){
  if(!((canvas.width === window.innerWidth) && 
       (canvas.height === window.innerHeight))){
    var size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = canvas.height = size;
    gl.viewport( 0, 0, canvas.width, canvas.height );
  }
}

var render = function(){
  
  resizeIfNeeded();
  
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Constant slow rotation
  theta[Zaxis] += 0.002;
  
  model_view = mat4.create();
  mat4.identity(model_view);
  
  mat4.rotateX(model_view, theta[Xaxis] );
  mat4.rotateY(model_view, theta[Yaxis] );
  mat4.rotateZ(model_view, theta[Zaxis] );
  
  
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "ModelView"), 
    false, 
    model_view );
  
  if(textureInitialized){
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    var uSamplerID = gl.getUniformLocation(program, "uSampler");
    gl.uniform1i(uSamplerID, 0);
    
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, pointsArray.length );
  }
    
  for(var i = 0; i < 3; i++){
    thetaVelocity[i] *= dampening;
    theta[i] += thetaVelocity[i];
  }
  
  requestAnimFrame(render);
}

function setUpInteraction(){
  var mouseIsDown = false;
  var mouseSensitivity = 0.001;
  var previousX, previousY;

  canvas.addEventListener('mousedown', function(e){
    mouseIsDown = true;
    previousX = e.pageX;
    previousY = e.pageY;
  });
  
  canvas.addEventListener('mouseup', function(e){
    mouseIsDown = false;
  });
  
  canvas.addEventListener('mouseout', function(e){
    mouseIsDown = false;
  });
  
  canvas.addEventListener('mousemove', function(e){
    if(mouseIsDown){
      var dx = e.pageX - previousX;
      var dy = e.pageY - previousY;
      
      thetaVelocity[Zaxis] += dx * mouseSensitivity;
      thetaVelocity[Xaxis] += dy * mouseSensitivity;
      
      previousX = e.pageX;
      previousY = e.pageY;
    }
  });
}
function initArrowKeyListener(imageNames){
  var keys = {left: 37, right: 39},
      actions = {},
      i = 0,
      n = imageNames.length;

  actions[keys.left] = function(){
    i = (i - 1 + n) % n;
    setTextureImage(imageNames[i]);
  };
  
  actions[keys.right] = function(){
    i = (i + 1) % n;
    setTextureImage(imageNames[i]);
  };

  document.addEventListener('keydown', function(event){
    var action = actions[event.which];
    if(action)
      action();
  });
}

function init() {
  canvas = document.getElementById( "gl-canvas" );
  setUpInteraction();
  
  gl = WebGLUtils.setupWebGL( canvas );
  if (!gl ) { alert( "WebGL isn't available" ); }
  
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);
  
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  
  // Compute the vertices of the surface.
  initVertices();
  
  // Arrange the vertices and normals into a
  // zig-zag pattern suitable for direct input to
  // OpenGL's TRIANGLE_STRIP mode
  // with POLYGON_OFFSET_FILL enabled.
  initPointsAndNormalsArrays();
 
  var vBufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
  
  var vPosId = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosId, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosId );
  
  var sphereBufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, sphereBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, 
                 flatten(sphericalCoordsArray), gl.STATIC_DRAW );
  
  var sphereCoordsId = gl.getAttribLocation( program, "sphereCoords" );
  gl.vertexAttribPointer( sphereCoordsId, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( sphereCoordsId );
  
  thetaId = gl.getUniformLocation(program, "theta"); 
  
  viewer_pos = point3.create([ 0.0, 0.0, -10.0] );
  
  projection = mat4.ortho(-1, 1, -1, 1, -100, 100);
  
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "Projection"), 
    false, projection);
  
  initTexture();
  setTextureImage("NE1_50M_SR_W");
  initArrowKeyListener([
    "NE1_50M_SR_W",
    "NE2_50M_SR_W",
    "GRAY_50M_SR_OB",
    "HYP_50M_SR",
    "OB_50M",
    "SR_50M"
  ]);
  render();
}
