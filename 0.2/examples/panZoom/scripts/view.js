define(['jquery', './model', './interpolate'],
    function($, model, interpolate) {
  var canvas = $('#canvas')[0],
      c = canvas.getContext('2d'),
      graphicsDirty = true;

  model.on('change', function(){
    graphicsDirty = true;
  });
  function drawScene(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawPolygon();
  }

  function log2(x){
    return Math.log(x)/Math.log(2);
  }

  function drawGrid(){
    var i, x, y,
        viewBounds = model.getViewBounds(),
        vertexBounds = model.getVertexBounds(),
        canvasBounds = model.getCanvasBounds(),
        scale = model.getScale(),
        level = Math.floor(log2(
          vertexBounds.width / viewBounds.width
        )) + 4,
        n = Math.pow(2, level);
        y1 = 0, //TODO change these
        y1 = interpolate(vertexBounds.y1)
            .from(viewBounds.y1, viewBounds.y2)
            .to(canvasBounds.y1, canvasBounds.y2),
        y2 = interpolate(vertexBounds.y2)
            .from(viewBounds.y1, viewBounds.y2)
            .to(canvasBounds.y1, canvasBounds.y2);
        x1 = interpolate(vertexBounds.x1)
            .from(viewBounds.x1, viewBounds.x2)
            .to(canvasBounds.x1, canvasBounds.x2),
        x2 = interpolate(vertexBounds.x2)
            .from(viewBounds.x1, viewBounds.x2)
            .to(canvasBounds.x1, canvasBounds.x2);

    // Clip to the canvas
    y1 = Math.max(y1, 10);
    y2 = Math.min(y2, canvas.height - 10);
    x1 = Math.max(x1, 10);
    x2 = Math.min(x2, canvas.width - 10);

    console.log("level = "+level);
    console.log("n = "+n);

    // Draw vertical lines
    for(i = 0; i <= n; i++){
      x = interpolate(i).from(0, n)
         .to(vertexBounds.x1, vertexBounds.x2);
      if(x > viewBounds.x1 && x < viewBounds.x2){
        x = interpolate(x)
            .from(viewBounds.x1, viewBounds.x2)
            .to(canvasBounds.x1, canvasBounds.x2)
        c.beginPath();
        c.moveTo(x, y1);
        c.lineTo(x, y2);
        c.stroke();
      }
    }
    
    // Draw horizontal lines
    for(i = 0; i <= n; i++){
      y = interpolate(i).from(0, n)
         .to(vertexBounds.y1, vertexBounds.y2);
      if(y > viewBounds.y1 && y < viewBounds.y2){
        y = interpolate(y)
            .from(viewBounds.y1, viewBounds.y2)
            .to(canvasBounds.y1, canvasBounds.y2)
        c.beginPath();
        c.moveTo(x1, y);
        c.lineTo(x2, y);
        c.stroke();
      }
    }
  }
    
  function drawPolygon(){
    var it = model.getVertices(),
        first = true,
        x, y, vertex,
        viewBounds = model.getViewBounds(),
        canvasBounds = model.getCanvasBounds();

    //draw the polygon from the model's vertices
    c.beginPath();
    while(it.hasNext()){
      vertex = it.next();
      x = interpolate(vertex.x)
          .from(viewBounds.x1, viewBounds.x2)
          .to(canvasBounds.x1, canvasBounds.x2)
      y = interpolate(vertex.y)
          .from(viewBounds.y1, viewBounds.y2)
          .to(canvasBounds.y1, canvasBounds.y2)
      if(first){
        c.moveTo(x, y);
        first = false;
      }
      else
        c.lineTo(x, y);
    }
    c.closePath();
    c.stroke();
  }

  return {
    executeFrame: function(){
      if(graphicsDirty){
        drawScene();
        graphicsDirty = false;
      }
    }
  };
});
