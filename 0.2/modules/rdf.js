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

  var indices = {
    // `indices.s` contains subjects.
    s: new SortedSet()
  };

  return {
    // `rdf.id(val)`
    //
    // * A unique integer id is returned for each unique value.
    // * `val` is a string - either 
    //   * a URI, or 
    //   * a literal value.
    id: (function(){
      var i = 1, id, ids = {};
      return function(val){
        return (id = ids[val]) ? id : (ids[val] = i++);
      };
    })(),
    // `rdf.insert(subject, predicate, object)`
    // * Inserts a triple.
    // * Arguments are ids returned from `rdf.id()`,
    insert: function(s, p, o){
      indices.s.add(s);
    },
    // `rdf.query(subject, predicate, object)`
    // * Queries the RDF store.
    // * Arguments are either:
    //   * ids returned from `rdf.id()`,
    //   * the string "?" (what to match), or
    //   * the string "*" (wildcard).
    // * Returns an iterator over ids that match "?".
    //   * Only one "?" is allowed.
    // * Supports thr following cases:
    //
    // | ?  | *  | *  |
    // | *  | ?  | *  |
    // | *  | *  | ?  |
    // | ?  | id | id |
    // | id | ?  | id |
    // | id | id | ?  |
    // | ?  | id | *  |
    // | ?  | *  | id |
    // | id | ?  | *  |
    // | *  | ?  | id |
    // | id | *  | ?  |
    // | *  | id | ?  |
    query: function(s, p, o){
      if(s === '?' && p === '*' && o === '*')
        return new Iterator(indices.s.iterate());
    }
  };
});
