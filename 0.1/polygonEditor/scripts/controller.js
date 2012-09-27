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

  // On mouse down, 
  canvas.addEventListener('mousedown', function(e){
    var x = pMouseX = e.offsetX, y = pMouseY = e.offsetY;
    // look for a point under the mouse.
    pointUnderMouse = getPointUnderMouse(x, y);
    // If there is a point under the mouse,
    // then set it up to be either
    // 
    //  * moved by dragging, or
    //  * deleted by clicking.
    if(pointUnderMouse)
      pointMoved = false;
    else{
      // If there is no point under the mouse, then
      // add a new point where the mouse is.
      pointUnderMouse = model.addPoint(x, y);

      // Set this so the newly created point is not
      // deleted on mouse up.
      pointMoved = true;
    }
  });

  // Set up mouse move events to drag the point under
  // the mouse.
  canvas.addEventListener('mousemove', function(e){
    if(pointUnderMouse){
      pointMoved = true;
      pointUnderMouse.x += e.offsetX - pMouseX;
      pointUnderMouse.y += e.offsetY - pMouseY;
      pMouseX = e.offsetX;
      pMouseY = e.offsetY;
      model.trigger('change');
    }
  });

  // Set up mouse up and mouse out events to either
  //
  // * stop dragging the point, or
  // * delete the point if it was only clicked on and not dragged.
  function mouseUpOrOut(e){
    if(!pointMoved)
      model.removePoint(pointUnderMouse);
    pointUnderMouse = undefined;
  }
  canvas.addEventListener('mouseup', mouseUpOrOut);
  canvas.addEventListener('mouseout', mouseUpOrOut);
  return {};
});
