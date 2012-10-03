// ## The Controller Module
// 
// Responsible for setting up user interactions
// that change the model.
define(['model'], function(model){
  // The point object from the model that is currently 
  // being moved by the user.
  var pointUnderMouse;

  // The mouse coordinates from the previous event.
  // Used to compute motion for dragging.
  var pMouseX, pMouseY;
  var pointMoved = true;

  // Performs a linear search through the model to 
  // find the point under the given pixel coordinates.
  function getPointUnderMouse(x, y){
    var rSquared = Math.pow(model.getPointRadius(), 2);
    return _(model.points).find(function(p){
      var dx = x - p.x, dy = y - p.y;
      return (dx * dx + dy * dy) < rSquared;
    });
  }

  // On mouse down, start dragging
  canvas.addEventListener('mousedown', function(e){
    var x = pMouseX = e.offsetX, y = pMouseY = e.offsetY;
    pointUnderMouse = getPointUnderMouse(x, y);
    if(pointUnderMouse)
      pointMoved = false;
  });

  // Set up mouse move events to:
  canvas.addEventListener('mousemove', function(e){
    // * drag the point under the mouse, and
    if(pointUnderMouse){
      pointMoved = true;
      pointUnderMouse.x += e.offsetX - pMouseX;
      pointUnderMouse.y += e.offsetY - pMouseY;
      pMouseX = e.offsetX;
      pMouseY = e.offsetY;
      model.trigger('change');
    }
    // * update `t` based on the mouse x coordinate
    var t = e.offsetX / canvas.width;
    model.setT(t);
  });

  // Set up mouse up events stop dragging the point.
  canvas.addEventListener('mouseup', function(e){
    pointUnderMouse = undefined;
  });

  // Set up mouse out events to stop dragging the point.
  canvas.addEventListener('mouseout', function(e){
    pointUnderMouse = undefined;
  });
});
