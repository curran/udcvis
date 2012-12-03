// This module partitions the quadtree of vertices into files.
define(['quadstream/nodeAddress'], function(nodeAddress){
  return function(nodes, fileDepth){
    // `files`
    //
    // * Keys: node address strings.
    // * Values: arrays of vertex objects
    var files = {},
        makeNode = function(level, i, j){
          return {level: level, i: i, j: j};
        },
        address = function(node){
          return nodeAddress(
            node.level, node.i, node.j
          );
        },
        root = makeNode(0, 0, 0),
        children = function(node){
          var level = node.level + 1;
          return [
            makeNode(level, 2 * node.i    , 2 * node.j    ),
            makeNode(level, 2 * node.i + 1, 2 * node.j    ),
            makeNode(level, 2 * node.i    , 2 * node.j + 1),
            makeNode(level, 2 * node.i + 1, 2 * node.j + 1)
          ];
        },
        fileAddressForNode = function(node){
          var depth = Math.min(fileDepth, node.level),
              level = node.level - depth,
              divisor = Math.pow(2, fileDepth),
              i = Math.floor(node.i / divisor),
              j = Math.floor(node.j / divisor);
          return nodeAddress(level, i, j);
        },
        getFile = function(key){
          var file = files[key];
          if(!file)
            file = files[key] = [];
          return file;
        },
        partition = function(node){
          var vertex = nodes[address(node)];
          if(vertex){
            var key = fileAddressForNode(node),
                file = getFile(key);
            file.push(vertex);
            _(children(node)).each(partition);
          }
        };
    
    partition(root);

    return files;
  };
});
