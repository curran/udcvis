// ### `preprocessVertices(polygons)`
// Usage:
//
// `var polygons = readPolygonsFromFile('regions.json');
// `var vertices = preprocess(polygons);`
// `var files = quadstream(vertices);`
//
// Arguments:
// 
//  * `polygons` An array of polygons.
//    * Polygons are arrays of vertices.
//    * Vertices are objects with numeric `x` and `y` properties.
//
// Returns:
//
//  * A `vertices` object.
//    * Keys are integer polygon ids, assigned to
//      input polygons in the order they are encountered in the input.
//    * Values are `vertex` objects with:
//      * `vertex.x` and `vertex.y` numeric coordinates,
//      * `vertex.memberships` An array whose elements are vertex `membership` objects with:
//        * `membership.polygonId`
//        * `membership.vertexId` These are assigned to vertices in the order they are encountered
//           in the input, `polygons`.
var preprocess = function(polygons){

  // `verticesByLocation`
  //
  // Keys:
  //
  //  * Strings of the form `x+"_"+y`.
  //
  // Values:
  //
  //  * Vertex objects
  //    * see description of output for `preprocess(polygons)`
  var verticesByLocation = {}

  var location = function(vertex){
    return vertex.x+"_"+vertex.y;
  };

  // `vertices` The output object.
  //    * see description of output for `preprocess(polygons)`
  var vertices = [];

  var polygonId = 0;
  _(polygons).each(function(polygon){
    var vertexId = 0;
    var verticesOfPolygon = vertices[polygonId++] = [];
    _(polygon).each(function(_vertex){

      // Resolve identical vertices in different polygons to the same object.
      var vertexLocation = location(_vertex);
      var vertex = vertices[vertexLocation];
      //
      // Create the vertex object if it doesn't exist.
      //
      if(!vertex)
        vertex = vertices[vertexLocation] = {
          x: _vertex.x,
          y: _vertex.y,
          memberships: []
        };
      //
      // Add a membership for each instance of the vertex.
      //
      vertex.memberships.push({
        polygonId: polygonId,
        vertexId: vertexId
      });
      
      vertexId++;

    });
  });
  return vertices;
};
var quadstream = (function(){
  // Arguments:
  // 
  //  * `vertices` The preprocessed vertices of the input polygon set.
  //    An array of objects with:
  //    * `x`
  //    * `y`
  //    * `memberships` An array of objects with:
  //      * `polygonId`
  //      * `vertexId`
  //  * `fileDepth` Is an integer that defines the number
  //    of quadtree levels traversed for defining the contents
  //    of each file.
  //  * `maxLevel` The maximum quadtree level to partition
  //    vertices into. 
  //  * `bounds` The bounding box to use for the top-level
  //    quadtree node, an object with properties:
  //    * `x`, `y`, `width`, and `height`.
  //    * Each vertex in `vertices` must fall within this rectangle.
  //
  return function(vertices, fileDepth, maxLevel, bounds){

    // `spots` The addresses of representative vertices mapped
    //         to the vertices.
    //
    //  * Keys: spot addresses
    //    * of the form `level+"_"+i+"_"j`
    //  * Values: vertex objects
    var spots = {};

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

    var streamAll = function(vertices){
      _(vertices).each(stream);
    };

    var criticalVertices = function(){
      // Select vertices that close gap.
      return _(vertices).filter(function(vertex){
        // Assume the containing polygon is also a polygon.
        // 
        // This assures that vertices along the outside border
        // between two adjacent polygons `a` and `b` will have 
        // three memberships:
        //
        //  1. `a`
        //  2. `b`
        //  3. The outer polygon that contains all the others.
        vertex.memberships.length > 2;
      });
    }

    var streamCriticalVertices = function(){
      streamAll(criticalVertices());
    };

    var streamExtremeVertices = function(){
      // Find vertices that define polygon bounding boxes.
      //
      // This is so clients can build bounding boxes from
      // the vertices that are in file "1".
      //
      // Also at this stage, store the bounding box of the
      // overall tree.
    };

    var streamOtherVertices = function(){
      // If `stream` is called twice with the same vertex,
      // nothing happens.
      streamAll(vertices);
    };

    var getVerticesForFile = function(file_level, file_i, file_j){
      // Save on object creation by re-using an empty array reference
      //
      //  * For base case of recursion, so used often
      //    * in O(n)) where n is the number of .
      var emptyArray = [];
      var recurse = function(level, i, j){
        var vertex = spots[spotAddress(level, i, j)];

        // Include all subtrees
        var vertices = [];
        if( file_level === 0 )
        ? [vertex] : [];

        if(vertex && level < file_level + fileDepth){

          vertices.push(  recurse(level + 1,   2 * i     ,   2 * j));
          vertices.push(  recurse(level + 1,   2 * i + 1 ,   2 * j));
          vertices.push(  recurse(level + 1,   2 * i     ,   2 * j + 1));
          vertices.push(  recurse(level + 1,   2 * i + 1 ,   2 * j + 1));

          return vertices;
        }
        else
          return emptyArray;
      };
      recurse(0, 0, 0);
    };

    var buildFiles = function(){

      // `files` The output files.
      //
      //  * Keys: file names
      //  * Values: Objects to be serialized as JSON
      var files = {}

      return files;
    }

    // Assumption: it's all in memory.
    streamCriticalVertices();
    streamExtremeVertices();
    streamOtherVertices();
    return buildFiles();
  }
})();
