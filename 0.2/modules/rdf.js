define(['collections/sorted-set', 'collections/iterator'], 
    function(SortedSet, Iterator){
  var set = new SortedSet();
  set.add(1);
  set.add(3);
  set.add(2);
  var iterator = new Iterator(set.iterate());
  iterator.forEach(function (value) {
    console.log(value);
  });

  return {
    id: (function(){
      var i = 1, id, ids = {};
      // `rdf.id(val)`
      //
      // * `val` is a string - either a URI or literal value.
      // * A unique integer id is returned for each unique value.
      return function(val){
        return (id = ids[val]) ? id : (ids[val] = i++);
      };
    })()
  };
});
