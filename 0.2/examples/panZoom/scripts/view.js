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

  function getLevelForCurrentView(){
    var viewBounds = model.getViewBounds(),
        vertexBounds = model.getVertexBounds();
    return Math.floor(log2(
      vertexBounds.width / viewBounds.width
    )) + 6;
  }

  function drawGrid(){
    var i, x, y,
        viewBounds = model.getViewBounds(),
        vertexBounds = model.getVertexBounds(),
        canvasBounds = model.getCanvasBounds(),
        scale = model.getScale(),
        level = getLevelForCurrentView(),
        n = Math.pow(2, level);
        y1 = 0, 
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
    y1 = Math.max(y1, 0);
    y2 = Math.min(y2, canvas.height);
    x1 = Math.max(x1, 0);
    x2 = Math.min(x2, canvas.width);

    c.strokeStyle = "gray";
    c.lineWidth = 1;

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

  // `spots` The addresses of representative vertices mapped
  //         to the vertices.
  //
  //  * Keys: spot addresses
  //    * of the form `level+"_"+i+"_"j`
  //  * Values: vertex objects
  var spots = {};

  var spotAddress = function(level, i, j){
    return [level,i,j].join('_');
  };

  // `vertexSpotAddress(level, x, y)` Returns the spot address 
  // of the given (x, y) point at the given level.
  var addressOfVertex = function(level, x, y){
    var gridSideLength = Math.pow(2, level),
        bounds = model.getVertexBounds(),
        normalizedX = (x - bounds.x) / bounds.width,
        normalizedY = (y - bounds.y) / bounds.height,
        i = Math.floor(normalizedX * gridSideLength),
        j = Math.floor(normalizedY * gridSideLength);
    return spotAddress(level, i, j);
  };
  var simplify = true; 

  var vertexCountHistory = [],
      vertexCountHistoryI = 0,
      vertexCountHistoryLength = 200,
      vertexCountHistoryMax = 0;

  for(var i = 0; i < vertexCountHistoryLength; i++)
    vertexCountHistory.push(0);

  function drawPolygon(){
    var it = model.getVertices(),
        name = model.name,
        first = true,
        x, y, vertex,
        viewBounds = model.getViewBounds(),
        canvasBounds = model.getCanvasBounds();

    // Clear the spots for on-the-fly generalization
    spots = {};

    c.font = '40pt sans-serif';

    //draw the polygon from the model's vertices
    c.beginPath();
    var count = 1, originalCount = 0;
    while(it.hasNext()){
      originalCount++;
      vertex = it.next();
      x = interpolate(vertex.x)
          .from(viewBounds.x1, viewBounds.x2)
          .to(canvasBounds.x1, canvasBounds.x2)
      y = interpolate(vertex.y)
          .from(viewBounds.y1, viewBounds.y2)
          .to(canvasBounds.y1, canvasBounds.y2)
      if(simplify){
        var level = getLevelForCurrentView(),
            key = addressOfVertex(level, vertex.x, vertex.y);

        if(first){
          c.moveTo(x, y);
          spots[key] = vertex;
          first = false;
        }
        else if(!spots[key]){
          c.lineTo(x, y);
          spots[key] = vertex;
          if(viewBounds.contains(vertex))
            count++;
        }
      }
      else{
        if(first){
          c.moveTo(x, y);
          first = false;
        }
        else{
          c.lineTo(x, y);
          count++;
        }
      }
    }
    if(model.name != "Koch Curve")
      c.closePath();
    c.strokeStyle = "black";
    c.lineWidth = 2;
    c.stroke();
    var offset = 70;
    c.fillText(name, 10, 50 );
    c.fillText(count+" vertices.", 10, 50 + offset);
    c.fillText(originalCount+" originally.", 10, 50 + 2*offset);
    c.fillText("Max "+vertexCountHistoryMax, 10, canvas.height - 50);

    var n = vertexCountHistoryLength,
        i = (vertexCountHistoryI++) % n,
        maxCount = 1000;
    vertexCountHistory[i] = count;

    if(count > vertexCountHistoryMax)
      vertexCountHistoryMax = count;

    c.beginPath();
    for(i = 0; i < n; i++){
      var x = (i / n) * canvas.width,
          oldCountI = (i + vertexCountHistoryI) % n,
          oldCount = vertexCountHistory[oldCountI],
          y = canvas.height - canvas.height * (oldCount / maxCount);
      if(i === 0)
        c.moveTo(x, y);
      else
        c.lineTo(x, y);
    }
    c.strokeStyle = "gray";
    c.lineWidth = 3;
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
