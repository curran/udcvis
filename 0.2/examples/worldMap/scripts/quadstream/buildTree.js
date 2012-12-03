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

    _(vertices).each(function(vertex){
      var address, level, key;
      for(level = 0; level < maxLevel; level++){
        key = addressOf(vertex, level);
        if(nodes[key])
          continue;
        else{
          vertex.level = level;
          nodes[key] = vertex;
          break;
        }
      }
    });
    return nodes;
  }
});
