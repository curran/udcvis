define([], function(){
  function makeNode(x, y, vertexId, importance){
    return {
      x: x, y: y,
      vertexId: vertexId,
      importance: importance
    };
  }

  function toString(node){
    return ['(',
      node.x,',', node.y,',',
      node.vertexId,',',
      node.importance,',',
    ')'].join('');
  }

  return {
    create: function(){
      var root;

      function blgInsert(node){
        var tree = root;
        do {
          if(node.vertexId < tree.vertexId){
            if(tree.leftChild){
              tree = tree.leftChild;
            } else{
              tree.leftChild = node;
              break;
            }
          }
          else if(node.vertexId > tree.vertexId){
            if(tree.rightChild){
              tree = tree.rightChild;
            } else{
              tree.rightChild = node;
              break;
            }
          }
        } while(true);
      }

      function blgPrint(tree, indent){
        if(tree.leftChild)
          blgPrint(tree.leftChild, indent+" ");
        console.log(indent + toString(tree));
        if(tree.rightChild)
          blgPrint(tree.rightChild, indent+" ");
      }

      function blgTraverse(callback, maxImportance, tree){
        if(tree.importance > maxImportance)
          callback(tree.x, tree.y);
        else{
          if(tree.leftChild)
            blgTraverse(callback, maxImportance, tree.leftChild);
          callback(tree.x, tree.y);
          if(tree.rightChild)
            blgTraverse(callback, maxImportance, tree.rightChild);
        }
      }

      return {
        insert: function(x, y, vertexId, importance){
          var node = makeNode(x, y, vertexId, importance);
          if(!root)
            root = node;
          else
            blgInsert(node);
        },
        print: function(){
          blgPrint(root, "");
        },
        traverse: function(callback, maxImportance){
          blgTraverse(callback, maxImportance, root);
        }
      };
    }
  };
});
