require(['model','view','controller'],
    function(model, view, controller){
  model.createCircle(function(circle){
    circle.x = 0.5;
    circle.y = 0.5
    circle.radius = 0.5;
    circle.on('change', function(){
      view.setGraphicsDirty();
    });
  });
});
