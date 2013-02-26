/**
A module for defining canvas-based apps
that fill the entire page. This module assumes
there is a canvas on the page whose id is "canvas"

Usage example:

    function render(canvasBounds, canvasContext, resized){
      if(resized){ redrawStuff(); }
    }
    FullScreenCanvas.init(render);`

@class FullScreenCanvas
 */
define(function(require) {
  var requestAnimFrame = require('requestAnimFrame'),
      Rectangle = require('udc/Rectangle'),
      canvasBounds = new Rectangle(0,0,0,0),
      canvas = document.getElementById('canvas'),
      c = canvas.getContext('2d'),
      // the callback passed in to `init`.
      renderCallback;

  function executeFrame(){
    renderCallback(canvasBounds, c, resize(canvas));
    requestAnimFrame(executeFrame);
  }

  function resize(canvas){
    if(!((canvas.width === window.innerWidth) && 
         (canvas.height === window.innerHeight))){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      canvasBounds.w = canvas.width;
      canvasBounds.h = canvas.height;

      return true;
    }
    return false;
  }

  return {
    /**
    Initializes the rendering function and starts the
    animation loop.
    @method init
    @param render 
      {function(canvasBounds, canvasContext, resized)} 
      The render callback, which takes as arguments:

     * `canvasBounds` A 
       {{#crossLink "Rectangle"}}{{/crossLink}} that contains 
       the bounding box of the canvas.
     * `canvasContext` The 2D drawing context of the canvas.
     * `resized` A boolean, whether or not the canvas has
       been resized this frame (as a result of initialization
       or a user resizing the page).
    */
    init: function(render){
      if(renderCallback){
        throw Error("Render callback already defined.");
      }
      else{

        // store the callback
        renderCallback = render;

        // kick off the animation loop
        executeFrame();
      }
    }
  };
});
