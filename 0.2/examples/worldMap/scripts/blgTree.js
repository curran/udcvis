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
        // `tree` is a root of a subtree of the existing tree,
        // initialized to the root node.
        var tree = root,
        // `treeParent` keeps track of the parent node of `tree`.
            treeParent,
        // `new` and `old` `Subtree` are used for temporarily storing a subtree
        //  (a child of treeParent) during insertion.
            newSubtree, oldSubtree;
        //
        // ## Insertion Algorithm
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
            /* TODO handle this case using a sentinel
            // sentinel = vertex.create({
            //   
            // });
            // treeParent = treePointer
            if(!treeParent){
              oldSubtree = root;
              ...
              root = newSubtree;
            }
            */
            // * If the level of `node is less than
            //   the level of `tree`,
            //   * then `tree` should be a child of `node`.
            //   * this can be accomplished by:
            //     * setting the parent node of `tree`
            //       to contain `node` as a child
            //       in place of `tree`.
            //if(treeParent.leftChild === tree){
            //  oldSubtree = treeParent.leftChild;
            //  //...
            //  treeParent.leftChild = newSubtree;
            //}
            //else if(treeParent.rightChild === tree){
            //  oldSubtree = treeParent.rightChild;
            //  ///...
            //  treeParent.rightChild = newSubtree;
            //}
          }

        } while(true);
      }
//        do {
//          if(node.vertexId < tree.vertexId){
//            if(tree.leftChild){
//              tree = tree.leftChild;
//            } else{
//              tree.leftChild = node;
//              break;
//            }
//          }
//          else if(node.vertexId > tree.vertexId){
//            if(tree.rightChild){
//              tree = tree.rightChild;
//            } else{
//              tree.rightChild = node;
//              break;
//            }
//          }
//        } while(true);
//      }

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
