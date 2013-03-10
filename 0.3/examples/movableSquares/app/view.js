define(['udc/FullScreenCanvas', 'app/model'], 
    function(screen, model){
  var graphicsDirty = true;

  model.nodes.on('add remove change', function(){
    graphicsDirty = true;
  });

  // `render` is called 60 times per second.
  function render(c, bounds, resized){
    if(resized){
      graphicsDirty = true;
    }
    if(graphicsDirty){
      console.log('redrawing');
      redrawNodes(c, bounds);
      graphicsDirty = false;
    }
  }

  function redrawNodes(c, bounds){
    c.clearRect(bounds.x, bounds.y, bounds.w, bounds.h);
    model.nodes.each(function(node){
      var x = node.get('x'),
          y = node.get('y'),
          w = node.get('w'),
          h = node.get('h');
      c.fillRect(x, y, w, h);
    });
  }

  screen.init(render);

});
