// ## The View Module
//
// Responsible for rendering the model to a canvas.
define(['model'], function(model){
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');

  // Automatically adjust the canvas size to the
  // size of the containing window for iFrame deployment.
  //canvas.width = window.innerWidth;
  //canvas.height = window.innerHeight;

  // Draws a single point object that has `x` and `y` properties
  // that define its coordinates in pixels.
  function drawPoint(point){
    var x = point.x, y = point.y;
    c.beginPath();
    c.arc(x, y, model.getPointRadius(), 0, Math.PI * 2);
    c.fillStyle = 'black';
    c.fill();
  }
  function drawLine(pointA, pointB){
    c.beginPath();
    c.moveTo(pointA.x, pointA.y);
    c.lineTo(pointB.x, pointB.y);
    c.stroke();
  }

  // Clears the canvas and redraws all points
  function redrawPoints(){
    c.clearRect(0,0,canvas.width,canvas.height);
    console.log(model.points.length);
    var previousPoint, firstPoint;
    _(model.points).each(function(point){
      console.log(point.x+" "+(200 - point.y));
      drawPoint(point)
      if(previousPoint)
        drawLine(previousPoint, point)
      else
        firstPoint = point;
      previousPoint = point;
    });
    drawLine(previousPoint, firstPoint);
  }
  
  function updateTextArea(){
    var text = [model.points.length];
    _(model.points).each(function(point){
      text.push(point.x+" "+(200 - point.y));
    });
    document.getElementById("textarea").innerHTML = text.join('\n');
  }

  // Whenever the model changes, redraw.
  model.on('change', redrawPoints);

  // Whenever the model changes, update the text area with a delay.
  var timeoutId = 0;
  model.on('change', function(){
    if(timeoutId)
      clearTimeout(timeoutId);
    timeoutId = setTimeout(function(){
      updateTextArea();
      timeoutId = 0;
    },100);
  });
});
