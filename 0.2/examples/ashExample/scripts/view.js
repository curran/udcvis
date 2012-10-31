define(['udcvis/requestAnimFrame','udcvis/resizeCanvas',
        'model','underscore'], 
    function(requestAnimFrame, resize, model, _) {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var graphicsDirty = true;
  function drawCircles(){
    var whMin = Math.min(canvas.width, canvas.height),
        twoPI = Math.PI * 2;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'black';
    c.beginPath();
    _(model.getCircles()).each(function(circle){
      c.arc(
        circle.x * canvas.width,
        circle.y * canvas.height,
        circle.radius * whMin, 0, twoPI
      );
    });
    c.fill();
  }

  function drawCircle(x, y, radius){
    c.arc(x, y, radius, 0, Math.PI * 2);
  }

  (function render(){
    requestAnimFrame(render);
    if(resize(canvas) || graphicsDirty){
      drawCircles();
      graphicsDirty = false;
    }
  })();

  return {
    setGraphicsDirty: function(){
      graphicsDirty = true;
    }
  };
});
