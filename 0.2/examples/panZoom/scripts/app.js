// This script is the top-level application, which
//
//  * loads the model, view, and controller,
//  * initializes the model, and
//  * runs the animation loop.
require(['jquery','./model', './view', './controller', './vertex',
         'udcvis/requestAnimFrame', './koch', 'underscore'], 
    function($, model, view, controller, vertex, requestAnimFrame,
             koch, _){
  function initKochVertices(){
    //   2
    //  / \
    // 1---3
    var depth = 5;
    model.clearVertices();
    model.name = "Koch Curve";
    _(koch.generateVertices(
      0, 0.5, 1, 0.5, depth
    )).each(model.addVertex);
    
    model.setVertexBounds(0, 0, 1, 1);
  }
  function initDataVertices(){
    function importVertices(polygon){
      var vertices,
          xMin = Number.MAX_VALUE, yMin = Number.MAX_VALUE,
          xMax = -Number.MAX_VALUE, yMax = -Number.MAX_VALUE,
          makeVertex = function(x, y){
            return vertex.create({x: x, y: y});
          };
      if(polygon.geometry.type == "Polygon")
        vertices = polygon.geometry.coordinates[0];
      else if(polygon.geometry.type == "MultiPolygon"){
        var i, maxN = 0, maxI;
        _(polygon.geometry.coordinates).each(function(poly, i){
          if(poly.length > maxN)
            maxI = i;
        });
        vertices = polygon.geometry.coordinates[maxI][0];
      }

      model.clearVertices();
      _(vertices).each(function(vertex){
        var x = vertex[0],
            y = -vertex[1];
        if(x < xMin)
          xMin = x;
        if(x > xMax)
          xMax = x;
        if(y < yMin)
          yMin = y;
        if(y > yMax)
          yMax = y;

        model.addVertex(makeVertex(x, y));
      });
      model.setVertexBounds(
        xMin, yMin,
        xMax - xMin, yMax - yMin
      );
      model.name = polygon.properties.ADMIN;
    }
    $.get("../../Quadstream/data/ne_10m_admin_0_countries.json",
        function(data){
      var i, n = data.features.length;
      //for(i = 0; i < n; i++)
      //  console.log(i+": "+data.features[i].properties.ADMIN);

      i = 0;

      //importVertices(data.features[i]);
      
      $(document).keydown(function(event) {
        var w = 87, a = 65, key = event.which;
        i = (
          key === w ? (i + 1) % n :
          key === a ? (i - 1 + n) % n : 
          i
        );
        if(key === w || key === a)
          importVertices(data.features[i]);
      });
    });
  }

  function initCircleVertices(){
    // Offset and scale are present here
    // so the pan and zoom system can be 
    // tested for independence from
    // translation and scaling.
    var xOffset = 1,
        scale = 1000,
        i, u, n = 500;
    model.clearVertices();
    model.name = "Circle";
    for(i = 0; i < n; i++){
      u = i / n * Math.PI * 2;
      model.addVertex(vertex.create({
        x: Math.sin(u) * scale + xOffset,
        y: Math.cos(u) * scale
      }));
    }
    model.setVertexBounds(
      -1.5 * scale + xOffset, 
      -1.5 * scale,
      3 * scale, 
      3 * scale
    );
  }

  // This call loads the data
  initDataVertices();

  // This call displays the circle first
  initCircleVertices();

  $(document).keydown(function(event) {
    var s = 83, e = 69, key = event.which;
    if(key === e)
      initKochVertices();
    if(key === s)
      initCircleVertices();
  });
 
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

  console.log("Controls:");
  console.log("  * h, j, k, l, arrows = pan");
  console.log("  * c, d = zoom");
  console.log("  * s = set to Circle");
  console.log("  * e = set to Koch Curve");
  console.log("  * w, a = scroll through countries");
});
