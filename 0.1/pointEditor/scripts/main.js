// The main app. This initializes the Model,
// View, and Controller, then adds an initial
// point to the model.
//
// Here's the main app in action:
// <iframe src="../index.html" style="border: 1px solid gray;" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="400" height="400"></iframe>
define(['model','view','controller'], function(
         model , view , controller) {
  model.addPoint(50, 50);
});
