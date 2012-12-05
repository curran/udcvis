// This module loads polygons from GEOJSON files.
//
// Example use:
//
//     geoJSONLoader.loadPolygons(fileName, function(err, polygons){
//       if(err)
//         throw err;
//       var n = 0;
//       _(polygons).each(function(polygon){
//         console.log(polygon.name);
//         _(polygon.vertices).each(function(vector){
//           n++;
//         })
//       });
//       console.log('Loaded '+n+' vertices');
//     });
//
define(['jquery', 'geometry/vector', 'geometry/rectangle'], 
    function($, vector, rectangle){
  return {
    // `loadPolygons(fileName, callback(err, polygons))` Loads the
    // specified GEOJSON file, then calls the callback with
    //
    //  * `err` The error that occurred, or null.
    //  * `polygons` An array of polygon objects with:
    //    * `name` The human-readable name of the polygon.
    //    * `vertices` An array of vector objects that defines
    //      the polygon boundary.
    //      * See `vector.create()`
    loadPolygons: function(fileName, callback){
      $.get(fileName, function(data){
        var polygons = [],
            loadPolygon = function(name, coordinates){
              var xMin = Number.MAX_VALUE, yMin = Number.MAX_VALUE,
                  xMax = -Number.MAX_VALUE, yMax = -Number.MAX_VALUE,
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
                  polygon = {
                    name: name,
                    vertices: []
                  };
              _(coordinates).each(function(point){
                var x = point[0],
                    y = -point[1];
                polygon.vertices.push(vector.create(x, y));
                expandBounds(x, y);
              });
              polygon.bounds = rectangle.create(
                xMin, yMin, xMax - xMin, yMax - yMin
              );
              polygons.push(polygon);
            };
        _(data.features).each(function(feature){
          if(feature.geometry.type === "Polygon"){
            loadPolygon(feature.properties.ADMIN, feature.geometry.coordinates[0]);
          }
          else if(feature.geometry.type === "MultiPolygon"){
            _(feature.geometry.coordinates).each(function(coordinates){
              if(coordinates[0].length > 200)
                loadPolygon(feature.properties.ADMIN, coordinates[0]);
            });
          }
        });
        callback(null, polygons);
      });
    },
    printPolygonAnalysis: function(polygons){
      var n = 0;
      console.log('Polygon Names:');
      _(polygons).each(function(polygon){
        console.log(polygon.name);
        _(polygon.vertices).each(function(vector){
          n++;
        })
      });
      console.log('Loaded '+n+' vertices');
    }
  };
});
