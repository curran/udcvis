// An in-memory RDF store with support for:
//
//  * Efficient querying
//  * Incremental result iteration
define(['collections/sorted-set', 'collections/iterator'], 
    function(SortedSet, Iterator){
  // ## Private Variables
  // `cantor(a, b)` 
  //
  //  * The [Cantor Pairing Function](http://en.wikipedia.org/wiki/Pairing_function)
  //  * Returns a unique integer for any two integers `a` and `b`.
  var cantor = function(a, b){
    return (a+b)*(a+b+1)/2+b;
  };

  // ### IDs and Values
  // Throughout this RDF module, the terms "subject", "predicate", and 
  // "object" refer to integer ids that map to elements of an RDF
  // triple of the form (subject, predicate, object).
  var idsAndValues = (function(){
    // Code that maps between IDs and values is located here.
    var i = 1, ids = {}, values = {};
    return {
      id: function(value){
        var id = ids[value];
        if(!id){
          id = ids[value] = i++;
          values[id] = value;
        }
        return id;
      },
      // The `id` and `value` functions are exposed in the public API.
      value: function(id){
        return values[id];
      }
    };
  })();


  // ### Indices
  var indices = {
    //  * `indices.s` contains subjects.
    //    * Answers queries of the form (?,\*,\*)
    s: new SortedSet(),
    //  * `indices.p` contains predicates.
    //    * Answers queries of the form (\*,?,\*)
    p: new SortedSet(),
    //  * `indices.o` contains objects.
    //    * Answers queries of the form (\*,\*,?)
    o: new SortedSet(),
    //  * `indices.po` contains:
    //    * keys: cantor(predicate, object)
    //    * values: Sorted Sets of subject ids.
    //    * Answers queries of the form (?,id,id)
    po: {},
    //  * `indices.so` contains:
    //    * keys: cantor(subject, object)
    //    * values: Sorted Sets of predicate ids.
    //    * Answers queries of the form (id,?,id)
    so: {},
    //  * `indices.sp` contains:
    //    * keys: cantor(subject, predicate)
    //    * values: Sorted Sets of object ids.
    //    * Answers queries of the form (id,id,?)
    sp: {}
  };

  // ## Public API
  return {
    // `rdf.id(value)`
    //
    // * Returns a unique integer id for each unique `value`.
    // * `value` is a string - either 
    //   * a URI, or 
    //   * a literal.
    id: idsAndValues.id,
    // `rdf.value(id)`
    //
    // * Returns the value for the given `id`.
    // * The inverse of `rdf.id(value)`.
    value: idsAndValues.value,
    // `rdf.insert(subject, predicate, object)`
    //
    //  * Inserts a triple.
    //  * Arguments are ids returned from `rdf.id()`,
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
    //
    // * Queries the RDF store.
    // * Arguments are either:
    //   * ids returned from `rdf.id()`,
    //   * the string "?" (what to match), or
    //   * the string "*" (wildcard).
    // * Returns an iterator over ids that match "?".
    //   * Only one "?" is allowed in the query.
    //   * Iterates in sorted order.
    // * Supports the following cases:
    //   * `( ?  , *  , *  )`
    //   * `( *  , ?  , *  )`
    //   * `( *  , *  , ?  )`
    //   * `( ?  , id , id )`
    //   * `( id , ?  , id )`
    //   * `( id , id , ?  )`
    //   * `( ?  , id , *  )`
    //   * `( ?  , *  , id )`
    //   * `( id , ?  , *  )`
    //   * `( *  , ?  , id )`
    //   * `( id , *  , ?  )`
    //   * `( *  , id , ?  )`
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
