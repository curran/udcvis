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
    s: new SortedSet(),
    // `indices.p` contains predicates.
    p: new SortedSet(),
    // `indices.o` contains objects.
    o: new SortedSet(),
    // `indices.sp` contains:
    //
    // * keys: cantor(subject, predicate)
    // * values: Sorted Sets of object ids.
    sp: {},
    // `indices.po` contains:
    //
    // * keys: cantor(predicate, object)
    // * values: Sorted Sets of subject ids.
    po: {},
    // `indices.so` contains:
    //
    // * keys: cantor(subject, object)
    // * values: Sorted Sets of predicate ids.
    so: {}
  };

  // `cantor(a, b)` Creates a unique integer for any two integers
  //a and b
  // From [Wikipedia: Pairing Function](http://en.wikipedia.org/wiki/Pairing_function)
  var cantor = function(a, b){
    return (a+b)*(a+b+1)/2+b;
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
    insert: (function(){
      function indexInsert(index, key, value){
        var sortedSet = index[key];
        if(!sortedSet)
          sortedSet = index[key] = new SortedSet();
        sortedSet.add(value);
      };
      return function(s, p, o){
        indices.s.add(s);
        indices.p.add(p);
        indices.o.add(o);

        indexInsert(indices.sp, cantor(s, p), o);
        indexInsert(indices.po, cantor(p, o), s);
        indexInsert(indices.so, cantor(s, o), p);
      }
    })(),
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
      if(s === '*' && p === '?' && o === '*')
        return new Iterator(indices.p.iterate());
      if(s === '*' && p === '*' && o === '?')
        return new Iterator(indices.o.iterate());
      if(s === '?' && p !=  '*' && o !=  '*')
        return new Iterator(indices.po[cantor(p, o)].iterate());
      if(s !=  '*' && p === '?' && o !=  '*')
        return new Iterator(indices.so[cantor(s, o)].iterate());
      if(s !=  '*' && p !=  '*' && o === '?')
        return new Iterator(indices.sp[cantor(s, p)].iterate());
    }
  };
});
