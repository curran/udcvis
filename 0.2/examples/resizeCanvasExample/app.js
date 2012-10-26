require(['udcvis/requestAnimFrame','udcvis/resizeCanvas'], 
    function(requestAnimFrame, resize) {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');

  function drawLine(x1, y1, x2, y2){
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }
  
  function drawX(){
    drawLine(0, 0, canvas.width, canvas.height);
    drawLine(0, canvas.height, canvas.width, 0);
  }

  (function render(){
    requestAnimFrame(render);
    if(resize(canvas)){
      console.log('canvas resized');
      drawX();
    }
  })();
});
