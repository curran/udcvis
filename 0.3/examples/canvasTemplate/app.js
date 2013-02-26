require(['udc/FullScreenCanvas'], function(FullScreenCanvas) {

  // `render` is called 60 times per second.
  function render(canvasContext, canvasBounds, resized){
    if(resized){
      console.log("Resized!");
      drawX(canvasContext, canvasBounds);
    }
  }

  function drawX(canvasContext, canvasBounds){
    var c = canvasContext, b = canvasBounds;
    drawLine(c, b.x1, b.y1, b.x2, b.y2);
    drawLine(c, b.x1, b.y2, b.x2, b.y1);
  }

  function drawLine(c, x1, y1, x2, y2){
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }

  FullScreenCanvas.init(render);
});
