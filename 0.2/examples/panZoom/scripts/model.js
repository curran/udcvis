// This script contains the model of the application - the 
// data that encapsulates the state of the application.
//
// To listen for changes to the model, use
//
//  * `model.on('change', function(){ ... })`
define(['underscore','lib/backbone','./rectangle', './vertex'],
    function(_, Backbone, rectangle, vertex){

  // `vertexBounds` is the bounding box for the vertices.
  var vertexBounds = rectangle.create();

  // `viewBounds` is the bounding box of the viewport.
  var viewBounds = rectangle.create();

  // `canvasBounds` is the bounding box of the canvas, 
  //  set by the controller.
  var canvasBounds = rectangle.create();

  // `pan` is the state of the panning.
  var pan = vertex.create();

  // `scale` is the state of the zooming.
  var scale;

  // `vertices` is an array of vertex objects
  // that are drawn as a polygon.
  //
  // TODO replace this array with a multi-scale data structure.
  var vertices = [];

  // `computeViewBounds()` sets the value of
  // `viewBounds` based on
  //
  var computeViewBounds = function(){
    //  * the value of `scale` and `pan`,
    viewBounds.set(
      vertexBounds.x * scale + pan.x,
      vertexBounds.y * scale + pan.y,
      vertexBounds.width * scale,
      vertexBounds.height * scale
    );

    //  * the value of canvasBounds
    //    * to "squarify" the projection.
    var w = canvasBounds.width,
        h = canvasBounds.height,
        aspectRatio = w / h,
        newWidth, newHeight;

    if(aspectRatio > 1){
      newWidth = aspectRatio * viewBounds.height;
      viewBounds.x += (viewBounds.width - newWidth) / 2;
      viewBounds.width = newWidth;
    }
    else{
      newHeight = viewBounds.height / aspectRatio;
      viewBounds.y += (viewBounds.height - newHeight) / 2;
      viewBounds.height = newHeight;
    }
  };

  // ## Public API
  var model = {
    getScale: function(){
      return scale;
    },
    setScale: function(newScale){
      scale = newScale;
      computeViewBounds();
      model.trigger('change');
    },
    getPan: function(){
      return pan;
    },
    setPan: function(x, y){
      pan.set(x, y)
      computeViewBounds();
      model.trigger('change');
    },
    addVertex: function(vertex){
      vertices.push(vertex);
      model.trigger('change');
    },
    // `getVertices()` returns an iterator with
    //
    // * `hasNext()` returns true when there is a next value, and
    // * `next()` returns the next value.
    //
    // Usage:
    // 
    // * `var it = model.getVertices(), v;`
    // * `while(it.hasNext()){ v = it.next() ... }`
    getVertices: function(){
      var i = 0;
      return {
        hasNext: function(){
          return i < vertices.length;
        },
        next: function(){
          return vertices[i++];
        }
      };
    },
    setCanvasBounds: function(x, y, width, height){
      canvasBounds.set(x, y, width, height);
      computeViewBounds();
      model.trigger('change');
    },
    getCanvasBounds: function(){
      return canvasBounds;
    },
    setVertexBounds: function(x, y, width, height){
      vertexBounds.set(x, y, width, height);
      computeViewBounds();
      model.trigger('change');
    },
    getVertexBounds: function(){
      return vertexBounds;
    },
    getViewBounds: function(){
      return viewBounds;
    }
  };
  // Backbone events are used.
  _.extend(model, Backbone.Events);

  // Initialize the viewport by setting the scale.
  model.setScale(1);

  return model;
});
