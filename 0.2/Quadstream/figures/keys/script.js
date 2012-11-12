var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d');

var squareSize = Math.pow(2, 8),
    padding = 5,
    numSquares = 4;

canvas.width = squareSize * numSquares + padding * (numSquares - 1) + 1;
canvas.height = squareSize + 1;

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

var drawSquare = function(level, x, y, width, height){
  drawQuads(level, x, y, width, height);
};

var drawSquares = function(){
  var i, x, y = 0;
  for(i = 0; i < numSquares; i++){
    x = (squareSize + padding) * i;
    drawSquare(i, x, y, squareSize, squareSize);
  }
};

drawSquares();
