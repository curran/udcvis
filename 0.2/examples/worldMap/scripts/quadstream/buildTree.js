define(['quadstream/nodeAddress'], function(nodeAddress){
  return function(vertices, maxLevel){
    // `nodes`
    //
    // * Keys: node address strings.
    // * Values: vertex objects
    var nodes = {},
        b = vertices.bounds,
        addressOf = function(vertex, level){
          var gridSideLength = Math.pow(2, level),
              normalizedX = (vertex.x - b.x) / b.width,
              normalizedY = (vertex.y - b.y) / b.height,
              i = Math.floor(normalizedX * gridSideLength),
              j = Math.floor(normalizedY * gridSideLength);
          return nodeAddress(level, i, j);
        };

    /*var n = 0;*/
    _(vertices).each(function(vertex){
      var address, level, key;
      /*
      if(vertex.memberships.length > 2)
        n++;
      */
      for(level = 0; level < maxLevel; level++){
        key = addressOf(vertex, level);
        if(nodes[key])
          continue;
        else{
          // Noise added to avoid sharp jumps in 
          // the number of vertices drawn.
          vertex.level = level + Math.random();
          nodes[key] = vertex;
          break;
        }
      }
    });
    /*
    console.log(n+" critical vertices");
    */
    return nodes;
  }
});
