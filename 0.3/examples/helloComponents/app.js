// An outline of a Component concept
require(['udc/FullScreenCanvas', 
         'app/ColoredXComponent', 
         'app/LinearComponent', 
         'app/SquareComponent'], 
    function(FullScreenCanvas, 
             ColoredXComponent,
             LinearComponent,
             SquareComponent){

//  var rootComponent = new XComponent();
  //var rootComponent = new SquareComponent(
  //  new ColoredXComponent('red')
  //);
  var rootComponent = new LinearComponent('vertical'),
      top = new LinearComponent('horizontal'),
      middle = new LinearComponent('vertical');

  top.addChild( new ColoredXComponent('red'), {size: 1});
  top.addChild(middle, {size: 1});
  top.addChild( new ColoredXComponent('green'), {size: 1});

  middle.addChild( new ColoredXComponent('red'), {size: 1});
  middle.addChild( new ColoredXComponent('green'), {size: 1});
  middle.addChild( new ColoredXComponent('blue'), {size: 1});

  rootComponent.addChild(top, {size:1});
  rootComponent.addChild( 
    new SquareComponent(
      new ColoredXComponent('blue')
    ), {size: 1}
  );


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
