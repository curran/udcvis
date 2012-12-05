define(['model', 'interpolate'], function(model, interpolate){
  var canvas = $('#canvas')[0],
      c = canvas.getContext('2d'),
      graphicsDirty = true,
      viewLevelOffset = 8;

  function getLevelForCurrentView(){
    var viewWidth = model.getViewBounds().width,
        vertexWidth = model.getVertexBounds().width;
    return log2(vertexWidth / viewWidth) + viewLevelOffset;
  }

  function log2(x){
    return Math.log(x)/Math.log(2);
  }

  function draw(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawPolygons();
  }

  function drawPolygons(){
    var polygons = model.getPolygonsInView(),
        viewBounds = model.getViewBounds(),
        canvasBounds = model.getCanvasBounds(),
        maxImportance = getLevelForCurrentView(),
        first = true;

    //draw the polygon from the model's vertices
    _(polygons).each(function(polygon){
      c.beginPath();
      polygon.traverse(function(x, y){
        x = interpolate(x)
            .from(viewBounds.x1, viewBounds.x2)
            .to(canvasBounds.x1, canvasBounds.x2)
        y = interpolate(y)
            .from(viewBounds.y1, viewBounds.y2)
            .to(canvasBounds.y1, canvasBounds.y2)
        if(first){
          c.moveTo(x, y);
          first = false;
        }
        else{
          c.lineTo(x, y);
        }
      }, maxImportance);
      c.closePath();
      c.strokeStyle = "black";
      c.lineWidth = 2;
      c.stroke();
    });
  }

  model.on('change', function(){
    graphicsDirty = true;
  });

  return {
    executeFrame: function(){
      if(graphicsDirty){
        draw();
        graphicsDirty = false;
      }
    }
  };
});
