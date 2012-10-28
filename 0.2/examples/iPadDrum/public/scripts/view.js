define(['udcvis/requestAnimFrame','udcvis/resizeCanvas','model'],
    function(requestAnimFrame, resize, model){

  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  
  model.on('change', redraw);

  (function render(){
    requestAnimFrame(render);
    if(resize(canvas)){
      redraw();
    }
  })();
  
  function redraw(){
    c.fillStyle = 'gray';
    c.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawTouches();
  }

  function drawGrid(){
    var w = model.gridWidth();
    var h = model.gridHeight();
    var x1, y1, x2, y2;
    c.fillStyle = 'gray';
    for(var i = 1; i < w; i++){
      y1 = 0;
      y2 = canvas.height;
      x1 = (i / w) * canvas.width;
      x2 = x1;
      drawLine(x1, y1, x2, y2);
    }
    for(var i = 1; i < h; i++){
      x1 = 0;
      x2 = canvas.width;
      y1 = (i / h) * canvas.height;
      y2 = y1;
      drawLine(x1, y1, x2, y2);
    }
  }

  function drawLine(x1, y1, x2, y2){
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }

  function drawTouches(){
    _(model.touches()).each(function(circle){
      c.fillStyle = 'white';
      var x = circle.x * canvas.width;
      var y = circle.y * canvas.height;
      drawCircle(x, y);
    });
  }

  function drawCircle(x, y){
    c.beginPath();
    c.arc(x, y, 20, 0, 2 * Math.PI);
    c.fill();
  }
  redraw();//initialize the background
});
