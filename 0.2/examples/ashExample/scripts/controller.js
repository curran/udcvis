define(['model','underscore'],function(model, _){
  var canvas = document.getElementById('canvas');

  var circleBeingDragged, x1, y1;

  canvas.addEventListener('mousedown', function(e){
    x1 = e.pageX;
    y1 = e.pageY;
    circleBeingDragged = getCircleUnderPoint(x1, y1);
  });

  var getCircleUnderPoint = function(x1, y1){
    return _.find(model.getCircles(), function(circle){
      var x2 = circle.x * canvas.width,
          y2 = circle.y * canvas.height,
          dx = x2 - x1,
          dy = y2 - y1,
          distance = Math.sqrt(dx * dx + dy * dy),
          whMin = Math.min(canvas.width, canvas.height),
          radius = circle.radius * whMin;
      return distance < radius;
    });
  };

  canvas.addEventListener('mousemove', function(e){
    if(circleBeingDragged){
      var x2 = e.pageX,
          y2 = e.pageY;
      circleBeingDragged.x += (x2 - x1) / canvas.width;
      circleBeingDragged.y += (y2 - y1) / canvas.height;
      x1 = x2;
      y1 = y2;
    }
  });
  var mouseUpOrOut = function(e){
    circleBeingDragged = null;
  };
  canvas.addEventListener('mouseup', mouseUpOrOut);
  canvas.addEventListener('mouseout', mouseUpOrOut);
});
