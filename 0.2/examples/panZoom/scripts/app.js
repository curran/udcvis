// This script is the top-level application, which
//
//  * loads the model, view, and controller,
//  * initializes the model, and
//  * runs the animation loop.
require(['./model', './view', './controller', './vertex',
         'udcvis/requestAnimFrame'], 
    function(model, view, controller, vertex, requestAnimFrame){
  // Initialize the model by:
  (function initVertices(){
    //  * adding vertices that approximate a circle, and
    var i, u, n = 100;
    for(i = 0; i < n; i++){
      u = i / n * Math.PI * 2;
      model.addVertex(vertex.create({
        x: Math.sin(u),
        y: Math.cos(u)
      }));
    }
    //  * initializing the bounds.
    model.setVertexBounds(-1.5, -1.5, 3, 3);
  })();
 
  // The animation loop. Each frame,
  (function executeFrame(){
    requestAnimFrame(executeFrame);
    // * the controller
    //
    //   * responds to page resizes, and
    //   * executes smooth pan & zoom.
    controller.executeFrame();
    // * the view redraws the scene if necessary
    view.executeFrame();
  })();
});
