require(['udcvis/requestAnimFrame','udcvis/resizeCanvas',
         'underscore'], 
    function(requestAnimFrame, resize, _) {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var graphicsDirty = true;
  var maxLevel = 9;
  var numPointsPerCircle = 300;

  // `spots` The addresses of representative vertices mapped
  //         to the vertices.
  //
  //  * Keys: spot addresses
  //    * of the form `level+"_"+i+"_"j`
  //  * Values: vertex objects
  var spots = {};

  var bounds = {
    x: 0,
    y: 0,
    width: 1,
    height: 1
  };

  var parseAddress = function(address, callback/*(level, i, j)*/){
    var tokens = address.split('_');
    callback(
      parseInt(tokens[0]),
      parseInt(tokens[1]),
      parseInt(tokens[2])
    );
  };

 function drawSpots(){
    c.fillStyle = 'rgba(0,0,0,0.1)';
      console.log("here");
      console.log("spots = "+_(spots).keys().length);
      console.log("canvas.width = "+canvas.width);
    _(_(spots).keys()).each(function(address){
      parseAddress(address, function(level, i, j){
        var gridSize = Math.pow(2, level),
            x = (i / gridSize) * canvas.width,
            y = (j / gridSize) * canvas.height,
            w = canvas.width / gridSize,
            h = canvas.height / gridSize;
        c.fillRect(x, y, w, h); 
      });
    });
    graphicsDirty = false;
  }

  var clearCanvas = function(){
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
  };

  (function render(){
    requestAnimFrame(render);
    if (resize(canvas) || graphicsDirty){
      clearCanvas();
      drawSpots();
    }
  })();

  var makeVertex = function(x, y){
    return {
      x: x,
      y: y
    };
  };

  // `spotAddress(level, i, j)` Returns a key that can be used
  // to look up or store vertices in `spots`.
  var spotAddress = function(level, i, j){
    return [level,i,j].join('_');
  };

  // `vertexSpotAddress(level, x, y)` Returns the spot address 
  // of the given (x, y) point at the given level.
  var addressOfVertex = function(level, x, y){
    var gridSideLength = Math.pow(2, level);
    var normalizedX = (x - bounds.x) / bounds.width;
    var normalizedY = (y - bounds.y) / bounds.height;
    var i = Math.floor(normalizedX * gridSideLength);
    var j = Math.floor(normalizedY * gridSideLength);
    return spotAddress(level, i, j);
  };

  // `stream(vertex)` Indexes the given vertex into `spots`
  //  for all levels.
  var stream = function(vertex){
    for(var level = 0; level < maxLevel; level++){
      var vertexAddress = addressOfVertex(level, vertex.x, vertex.y);
      if(!spots[vertexAddress])
        spots[vertexAddress] = vertex;
    }
  };

  var clearSpots = function(){
    spots = {};
  };

  var streamCircle = function(x, y, n){
    clearSpots();
    for(var i = 0; i < n; i++)
      stream(makeVertex(
        Math.sin(i / n * Math.PI * 2)/5 + x,
        Math.cos(i / n * Math.PI * 2)/5 + y
      ));
    graphicsDirty = true;
  };

  canvas.addEventListener('mousemove', function(e){
    var x = e.pageX / canvas.width;
    var y = e.pageY / canvas.height;
    streamCircle(x, y, numPointsPerCircle);
  });
  
  // To show something initially.
  streamCircle(0.5, 0.5, numPointsPerCircle);
});
