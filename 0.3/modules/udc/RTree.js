define(["udc/Rectangle"], function(Rectangle){

  function RTree(bucketSize){
    this.root = new Node();
    this.bucketSize = bucketSize || 50;
  }
  RTree.prototype = {
    insert: (function(){
      function i(node, entry, bucketSize){
        node.bounds.expandToFit(entry.bounds);
        if(node.isLeaf){
          if(node.entries.length < bucketSize){
            node.entries.push(entry);
          }
          else{
            split(node, bucketSize);
            insert(node, entry, bucketSize);
          }
        }
        else{
          insert(bestChild(node, entry), entry, bucketSize);
        }
      }
      return function(bounds, item){
        var entry = new Entry(bounds, item);
        i(this.root, entry, this.bucketSize);
      };
    })(),
    query: (function(){
      function q(node, queryRect, resultsArr){
        var i, e;
        if(node.bounds.intersects(queryRect)){
          if(node.isLeaf){
            for(i = 0; i < node.entries.length; i++){
              e = node.entries[i];
              if(e.bounds.intersects(queryRect)){
                resultsArr.push(e.item);
              }
            }
          }
          else{
            for(i = 0; i < node.children.length; i++){
              q(node.children[i], queryRect, resultsArr);
            }
          }
        }
      }
      return function(queryRect){
        var resultsArr = [];
        q(this.root, queryRect, resultsArr);
        return resultsArr;
      }
    })()
  };

  function Node(){
    this.children = [];
    this.bounds = emptyBounds();
    this.isLeaf = true;
    this.entries = [];
  }

  function emptyBounds(){
    var i = Number.MAX_VALUE;
    return new Rectangle(-i/2,-i/2,i,i);
  }

  function Entry(bounds, item){
    this.bounds = bounds;
    this.item = item;
  }

  
  var split = (function(){
    return function(node, bucketSize){
      var inf = Number.MAX_VALUE,
          xMin = inf, xMax = -inf,
          yMin = inf, yMax = -inf,
          xMinE, xMaxE, yMinE, yMaxE,
          child1 = new Node(),
          child2 = new Node(),
          i, e, entries = node.entries;

      // TODO abstract out (min, max, minE, maxE)
      // minMax(arr, fn(item) -> value, callback(min, max
      for(i = 0; i < entries.length; i++){
        e = entries[i];
        if(e.bounds.x < xMin){
          xMin = e.bounds.x;
          xMinE = e;
        }
        if(e.bounds.x < xMax){
          xMax = e.bounds.x1();
          xMaxE = e;
        }
        if(e.bounds.y < yMin){
          yMin = e.bounds.y;
          yMinE = e;
        }
        if(e.bounds.y < yMax){
          yMax = e.bounds.y1();
          yMaxE = e;
        }
      }

      if((xMax - xMin) > (yMax - yMin)){
        insert(child1, xMinE, bucketSize);
        insert(child2, xMaxE, bucketSize);
        entries.splice(entries.indexOf(xMinE), 1);
        entries.splice(entries.indexOf(xMaxE), 1);
      }
      else{
        insert(child1, yMinE, inf);
        insert(child2, yMaxE, inf);
        entries.splice(entries.indexOf(yMinE), 1);
        entries.splice(entries.indexOf(yMaxE), 1);
      }

      node.entries.length = 0;
      node.isLeaf = false;
      node.children.push(child1, child2);
      node.bounds.expandToFit(child1.bounds);
      node.bounds.expandToFit(child2.bounds);

      for(i = 0; i < entries.length; i++){
        insert(node, entries[i], bucketSize);
      }
    }
  })();


  function bestChild(node, entry){
    var i, c, cMin, e, eMin = Number.MAX_VALUE;
    for(i = 0; i < node.children.length; i++){
      c = node.children[i];
      e = c.bounds.expansionNeededToFit(entry.bounds);
      if( e < eMin ){
        eMin = e;
        cMin = c;
      }
    }
    return cMin;
  }

  return RTree;
});
