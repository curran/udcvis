// ## The View Module
//
// Responsible for rendering the model to a canvas.
define(['model'], function(model){
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');

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

  function clearCanvas(){
    c.clearRect(0,0,canvas.width,canvas.height);
  }

  // Draws all points in the model.
  function drawPoints(){
    var previousPoint, firstPoint;
    _(model.points).each(function(point){
      drawPoint(point)
      if(previousPoint)
        drawLine(previousPoint, point)
      else
        firstPoint = point;
      previousPoint = point;
    });
  }

  // This function computes p from t, v1, and v2
  function tToP(callback/*(x,y)*/){
    var v1 = model.points[0];
    var v2 = model.points[1];
    var t = model.getT();
    var x = v1.x + t * (v2.x - v1.x);
    var y = v1.y + t * (v2.y - v1.y);
    callback(x, y);
  }

  // Draws the small blue dot representing p
  function drawP(){
    tToP(function(x, y){
      c.beginPath();
      c.arc(x, y, model.pRadius, 0, Math.PI * 2);
      c.fillStyle = model.pColor;
      c.fill();
    });
  }


  function render(){
    clearCanvas();
    drawPoints();
    if(model.points.length === 2)
      drawP();
  }

  // Whenever the model changes, redraw.
  model.on('change', render);

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
  
  function updateTextArea(){
    var text = [];
    text.push("<ul>");
    _(model.points).each(function(point, i){
      text.push(li("v"+(i+1)+" = ("+point.x+", "+(200 - point.y)+")"));
    });
    text.push(li("t = "+truncate(model.getT())));
    tToP(function(x, y){
      text.push(li("p = ("+truncate(x)+", "+truncate(y)+")"));
    });
    text.push("</ul>");
    document.getElementById("textarea").innerHTML = text.join("");
  }

  function truncate(x){
    return Math.round(x*1000)/1000;
  }

  function li(str){
    return "<li>" + str + "</li>";
  }
});
