// An outline of a Component concept
require(['udc/FullScreenCanvas', 'app/ColoredXComponent'], 
    function(FullScreenCanvas, ColoredXComponent){

//  var rootComponent = new XComponent();
  var rootComponent = new ColoredXComponent('red');

  // `render` is called 60 times per second.
  function render(c, box, resized){
    if(resized){
      rootComponent.resize(c, box);
      console.log("Resized!");
    }
    if(rootComponent.shouldDraw()){
      rootComponent.draw(c, box);
    }
  }

  FullScreenCanvas.init(render);
});
