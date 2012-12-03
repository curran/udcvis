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
              var polygon = {
                name: name,
                vertices: []
              };
              _(coordinates).each(function(point){
                var x = point[0],
                    y = point[1];
                polygon.vertices.push(vector.create(x, y));
              });
              polygons.push(polygon);
            };
        _(data.features).each(function(feature){
          _(feature.geometry.coordinates).each(function(coordinates){
            loadPolygon(feature.properties.ADMIN, coordinates);
          });
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
