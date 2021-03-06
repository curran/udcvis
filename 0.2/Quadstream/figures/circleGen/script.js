var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d');

var squareSize = Math.pow(2, 8),
    padding = 5,
    numSquares = 2,
    circleSize = 0,
    circleWobble = 0;

canvas.width = squareSize * numSquares + padding * (numSquares - 1) + 1;
canvas.height = canvas.width;
console.log("width and height = "+canvas.width);
c.font = '40pt Calibri';
c.textAlign = 'center';
c.textBaseline = 'middle';

var drawQuads = function(level, x, y, width, height){
  var rectX, rectY, rectW, rectH, centerX, centerY, i, j,
      gridSize = Math.pow(2, level),
      scale = squareSize / Math.pow(2, 7) / gridSize;
  
  for(i = 0; i < gridSize; i++){
    for(j = 0; j < gridSize; j++){
      rectX = x + (i / gridSize) * width;
      rectY = y + (j / gridSize) * height; 
      rectW = width / gridSize;
      rectH = height / gridSize;
      c.strokeRect(rectX+.5, rectY+.5, rectW, rectH);
      
      centerX = rectX + rectW / 2;
      centerY = rectY + rectH / 2;
      c.save();
      c.translate(centerX, centerY);
      c.scale(scale, scale);
      c.fillText(level+','+i+','+j, 0, 0);
      c.restore();
    }
  }
};

var drawCircle = function(level, x, y, width, height){

  var bounds = {
    x: x,
    y: y,
    width: width,
    height: width
  };
  var spots = {};
  var spotAddress = function(level, i, j){
    return [level,i,j].join('_');
  };
  // `vertexSpotAddress(level, x, y)` Returns the spot address 
  // of the given (x, y) point at the given level.
  var addressOfVertex = function(level, x, y){
    var gridSideLength = Math.pow(2, level);
    var normalizedX = (x - bounds.x) / bounds.width;
    var normalizedY = (y - bounds.y) / bounds.height;
    var i = Math.floor(normalizedX * gridSideLength);
    var j = Math.floor(normalizedY * gridSideLength);
    return spotAddress(level, i, j);
  };
  var v = {x:0, y:0}, 
      n = 300, r, wobble;
  c.beginPath();
  for(var i = 0; i < n; i++){
    wobble = Math.sin((i / n) * circleWobble);
    wobble *= circleSize * circleWobble / 2;
    r = width * circleSize + wobble;
    v.x = Math.sin(i / n * Math.PI * 2)*r + x + width / 2;
    v.y = Math.cos(i / n * Math.PI * 2)*r + y + height / 2;
    var key = addressOfVertex(level, v.x, v.y);
    if(i === 0){
      c.moveTo(v.x, v.y);
      spots[key] = v;
    }
    else if(!spots[key]){
      c.lineTo(v.x, v.y);
      spots[key] = v;
    }
  }
  c.fill();
}
var drawSquare = function(level, x, y, width, height){
  drawQuads(level, x, y, width, height);
  drawCircle(level, x, y, width, height);
};

var drawSquares = function(){
  var i, x, y, level;
  for(i = 1; i < numSquares + 1; i++){
    for(j = 1; j < numSquares + 1; j++){
      x = (squareSize + padding) * (i - 1);
      y = (squareSize + padding) * (j - 1);
      if(j === 1)
        level = i;
      else
        level = 5 - i;
      drawSquare(level, x, y, squareSize, squareSize);
    }
  }
};

drawSquares();
canvas.addEventListener('mousemove', function(e){
  var wobbleHeight = canvas.height / 2;
  circleSize = e.pageX / 800;
  if(e.pageY < wobbleHeight)
    circleWobble = 0;
  else
    circleWobble = (e.pageY - wobbleHeight) / 3;
  c.clearRect(0,0,canvas.width, canvas.height);
  drawSquares();
});
