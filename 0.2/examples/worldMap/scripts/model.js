// This module defines the state of the Quadstream 
// World Map application.
//
// Clients to the model can listen for changes using
//
//  * `model.on('change', function(){...})`
//
define(['lib/backbone', 'geometry/vector', 'geometry/rectangle',
        'underscore', 'blgTree'],
    function(Backbone, vector, rectangle, _, blgTree){
  // The model consists of:
  //
  //  * `pan` An (x,y) `vector` that defines the 
  //     panning state of the world map. 
  //     Default is (0,0).
  var pan = vector.create(0, 0),
  //  * `zoom` A number that defines the scaling factor
  //     (or "zoom") of the world map. Default is 1.
      zoom = 1,
  //  * `polygons` A collection of BLG trees.
  //
  //    * Keys: polygon Ids (integers)
  //    * Values: BLG trees
      polygons = {},

  //  * `vertexBounds` is the bounding box for the vertices.
      vertexBounds = rectangle.create(),

  //  * `viewBounds` is the bounding box of the viewport.
      viewBounds = rectangle.create(),

  //  * `canvasBounds` is the bounding box of the canvas, 
  //  set by the controller.
      canvasBounds = rectangle.create(),
  // ## Private Members
  //
  //  * `getPolygon` Looks up a polygon by id,
  //  creating new polygons when necessary.
      getPolygon = function(polygonId){
        var polygon = polygons[polygonId];
        if(polygon)
          return polygon;
        else
          return polygons[polygonId] = blgTree.create();
      },
  //  * `computeViewBounds()` sets the value of
  // `viewBounds` based on
  //
      computeViewBounds = function(){
        //    * the value of `zoom` and `pan`,
        var viewWidth = vertexBounds.width * zoom,
            viewHeight = vertexBounds.height * zoom;
        viewBounds.set(
          pan.x - viewWidth / 2,
          pan.y - viewHeight / 2,
          viewWidth, viewHeight
        );

        //    * the value of canvasBounds
        //      * to "squarify" the projection.
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
      },
      model = {
    getPan: function(){
      return pan;
    },
    setPan: function(x, y){
      pan.set(x, y);
      computeViewBounds();
      model.trigger('change');
    },
    getZoom: function(){
      return zoom;
    },
    setZoom: function(newZoom){
      zoom = newZoom;
      computeViewBounds();
      model.trigger('change');
    },
    setCanvasBounds: function(x, y, width, height){
      canvasBounds.set(x, y, width, height);
      computeViewBounds();
      model.trigger('change');
    },
    getCanvasBounds: function(){
      return canvasBounds;
    },
    setVertexBounds: function(newVertexBounds){
      vertexBounds.set(newVertexBounds);
      pan.set(vertexBounds.centerX, vertexBounds.centerY);
      computeViewBounds();
      model.trigger('change');
    },
    getVertexBounds: function(){
      return vertexBounds;
    },
    getViewBounds: function(){
      return viewBounds;
    },
    loadFile: function(key, file){
      _(file).each(function(vertex){
        _(vertex.memberships).each(function(membership){
          getPolygon(membership.polygonId).insert(
            vertex.x, vertex.y,
            membership.vertexId,
            vertex.level
          );
        });
      });
      model.trigger('change');
      //_(_(polygons).keys()).each(function(key){
      //  var polygon = polygons[key];
      //  console.log(key);
      //  polygon.print();
      //});
    },
    getPolygonsInView: function(){
      //TODO only return polygons in view
      return _(polygons).values();
    }
  };

  // Backbone events are used.
  _.extend(model, Backbone.Events);

  return model;
});
