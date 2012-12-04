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
      // `rootParent` is a sentinel node pointing to the root of the tree.
      var rootParent = {
            //  * Having level -1 guarantees that all inserted nodes
            //    will be under rootParent, as the lowest encountered
            //    level for inserted nodes is 0;
            level: -1,
            //  * Having vertexId -1 guarantees that only
            //    `rootParent.rightChild` will ever pe populated, as the
            //    lowest vertex id for any inserted node is at least 0.
            vertexId: -1
          },
          root = function(){
            return rootParent.rightChild;
          };
      //
      // ### `blgInsert()`
      //
      // `node` is a node to be inserted into the tree
      // in a manner such that the following invariants are upheld:
      //
      //  * Inorder tree traversal yields vertices in increasing order
      //    with respect to their `vertedId`, which defines their original order.
      //  * Depth in the tree corresponds to increasing vertex level.
      //    * `vertex.level` contains the level the vertex was assigned to
      //      in the quadtree (see `quadstream/buildTree.js`).
      function blgInsert(node){
        //
        // ## Insertion Algorithm
        //
        // `tree` is a root of a subtree of the existing tree,
        // initialized to the sentinel root node parent.
        var tree = rootParent,
        // `treeParent` keeps track of the parent node of `tree`.
        treeParent,
        // `new` and `old` `Subtree` temporarily store a subtree
        //  (a child of treeParent) during insertion.
        newSubtree, oldSubtree;
        do {
          //
          // When inserting a node `node` into a subtree `tree`,
          //
          // * If the level of `node` is greater than
          //   the level of `tree`, 
          if(true){//node.level > tree.level){
            //   * then `node` is suitable to insert
            //     as a child of `tree` using the insertion
            //     algorithm for a binary search tree.
            if(node.vertexId < tree.vertexId){
              if(tree.leftChild){
                treeParent = tree;
                tree = tree.leftChild;
              } else{
                tree.leftChild = node;
                break;
              }
            }
            else if(node.vertexId > tree.vertexId){
              if(tree.rightChild){
                treeParent = tree;
                tree = tree.rightChild;
              } else{
                tree.rightChild = node;
                break;
              }
            }
          } else{
            // * If the level of `node is less than
            //   the level of `tree`,
            //   * then `tree` should be a child of `node`.
            //   * this can be accomplished by:
            //     * setting the parent node of `tree`
            //       to contain `node` as a child
            //       in place of `tree`.
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
          blgInsert(node);
        },
        print: function(){
          if(root())
            blgPrint(root(), "");
        },
        traverse: function(callback, maxImportance){
          if(root())
            blgTraverse(callback, maxImportance, root());
        }
      };
    }
  };
});
