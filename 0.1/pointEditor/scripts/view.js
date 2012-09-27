// ## The View Module
//
// Responsible for rendering the model to a canvas.
define(['model'], function(model){
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');

  // Automatically adjust the canvas size to the
  // size of the containing window for iFrame deployment.
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Draws a single point object that has `x` and `y` properties
  // that define its coordinates in pixels.
  function drawPoint(point){
    var x = point.x, y = point.y;
    c.beginPath();
    c.arc(x, y, model.getPointRadius(), 0, Math.PI * 2);
    c.fillStyle = 'black';
    c.fill();
  }

  // Clears the canvas and redraws all points
  function redrawPoints(){
    c.clearRect(0,0,canvas.width,canvas.height);
    _(model.points).each(drawPoint);
  }

  // Whenever the model changes, redraw.
  model.on('change', redrawPoints);
});
