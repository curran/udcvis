define(['udcvis/requestAnimFrame','udcvis/resizeCanvas',
        'model','underscore'], 
    function(requestAnimFrame, resize, model, _) {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var graphicsDirty = false;

  function drawCircle(x, y, radius){
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2);
    c.fill();
  }
  
  function drawCircles(){
    var whMin = Math.min(canvas.width, canvas.height);
    _(model.getCircles()).each(function(circle){
      drawCircle(
        circle.x * canvas.width,
        circle.y * canvas.height,
        circle.radius * whMin
      );
    });
  }

  (function render(){
    requestAnimFrame(render);
    if(resize(canvas) || graphicsDirty){
      drawCircles();
      graphicsDirty = false;
    }
  })();
});
