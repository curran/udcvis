define(['geometry/rectangle'], function(rectangle){
  return function(polygons){
    var vertices = {},
        xMin = Number.MAX_VALUE, yMin = Number.MAX_VALUE,
        xMax = -Number.MAX_VALUE, yMax = -Number.MAX_VALUE,
        vectorKey = function(vector){
          return vector.x+'_'+vector.y;
        },
        expandBounds = function(x, y){
          if(x < xMin)
            xMin = x;
          if(x > xMax)
            xMax = x;
          if(y < yMin)
            yMin = y;
          if(y > yMax)
            yMax = y;
        },
        makeVertex = function(vector){
          expandBounds(vector.x, vector.y);
          return {
            x: vector.x,
            y: vector.y,
            memberships: []
          };
        },
        getVertex = function(vector){
          var key = vectorKey(vector),
              vertex = vertices[key];
          if(vertex)
            return vertex;
          else
            return vertices[key] = makeVertex(vector);
        },
        polygonId = 0;

    _(polygons).each(function(polygon){
      var vertexId = 0;
      _(polygon.vertices).each(function(vector){
        vertex = getVertex(vector);
        vertex.memberships.push({
          polygonId: polygonId,
          vertexId: vertexId
        });
        vertexId++;
      });
      polygonId++;
    });
    vertices = _(vertices).values();
    vertices.bounds = rectangle.create(
      xMin,
      yMin,
      xMax - xMin,
      yMax - yMin
    );
    return vertices;
  };
});
