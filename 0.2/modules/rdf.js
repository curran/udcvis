// An in-memory RDF store with support for:
//
//  * Efficient querying
//  * Incremental result iteration
define(['lib/collections/sorted-set', 'lib/collections/iterator'], 
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
    sp: {},
    
    //  * The names below mean:
    //    * `q` = "?" (question)
    //    * `i` = some id
    //    * `w` = "*" (wildcard)
    //    * Spacing corresponds to spo, (subject, predicate, object)

    //  * `indices.qiw` contains:
    //    * keys: predicate
    //    * values: Sorted Sets of subject ids.
    //    * Answers queries of the form (?,id,*)
    qiw: {},

    //  * `indices.qwi` contains:
    //    * keys: object
    //    * values: Sorted Sets of subject ids.
    //    * Answers queries of the form (?,*,id)
    qwi: {},

    //  * `indices.iqw` contains:
    //    * keys: subject
    //    * values: Sorted Sets of predicate ids.
    //    * Answers queries of the form (id,?,*)
    iqw: {},

    //  * `indices.wqi` contains:
    //    * keys: object
    //    * values: Sorted Sets of predicate ids.
    //    * Answers queries of the form (*,?,id)
    wqi: {},

    //  * `indices.iwq` contains:
    //    * keys: subject
    //    * values: Sorted Sets of object ids.
    //    * Answers queries of the form (id,*,?)
    iwq: {},

    //  * `indices.wiq` contains:
    //    * keys: predicate
    //    * values: Sorted Sets of object ids.
    //    * Answers queries of the form (*,id,?)
    wiq: {}
  };

  var prefixes = {
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'rdfs': 'http://www.w3.org/2000/01/rdf-schema#'
  };

  // ## Public API
  var rdf = {
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

        indexInsert(indices.qiw, p, s);
        indexInsert(indices.qwi, o, s);
        indexInsert(indices.iqw, s, p);
        indexInsert(indices.wqi, o, p);
        indexInsert(indices.iwq, s, o);
        indexInsert(indices.wiq, p, o);
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
        return indices.s.iterate();
      if(s === '*' && p === '?' && o === '*')
        return indices.p.iterate();
      if(s === '*' && p === '*' && o === '?')
        return indices.o.iterate();

      if(s === '?' && p !=  '*' && o !=  '*')
        return indices.po[cantor(p, o)].iterate();
      if(s !=  '*' && p === '?' && o !=  '*')
        return indices.so[cantor(s, o)].iterate();
      if(s !=  '*' && p !=  '*' && o === '?')
        return indices.sp[cantor(s, p)].iterate();

      if(s === '?' && p !=  '*' && o === '*')
        return indices.qiw[p].iterate();
      if(s === '?' && p === '*' && o !=  '*')
        return indices.qwi[o].iterate();
      if(s !=  '*' && p === '?' && o === '*')
        return indices.iqw[s].iterate();
      if(s === '*' && p === '?' && o !=  '*')
        return indices.wqi[o].iterate();
      if(s !=  '*' && p === '*' && o === '?')
        return indices.iwq[s].iterate();
      if(s === '*' && p !=  '*' && o === '?')
        return indices.wiq[p].iterate();
    },
    and: function(it1, it2){
      var nextValue, next1, next2;
      var findNextValue = function(){
        nextValue = undefined;
        next1 = next2 = NaN;
        while(!nextValue){
          try{
            if(next1 === next2)
              nextValue = next1;
            else
              if(next1 < next2 || isNaN(next1))
                next1 = it1.next();
              else if(next2 < next1 || isNaN(next2))
                next2 = it2.next();
          }
          catch(e){
            // Flow goes here when iteration ends
            break;
          }
        }
      };
      findNextValue();
      return {
        next: function(){
          var currentValue = nextValue;
          if(currentValue != undefined){
            findNextValue();
            return currentValue;
          }
          else
            // StopIteration is thrown for all collections
            // when iteration terminates. It is a global 
            // injected by Iterator.js.
            throw StopIteration;
        }
      };
    },
    qn: function(qName){
      var arr = qName.split(':'),
          prefix = arr[0],
          localPart = arr[1];
      return rdf.id(prefixes[prefix] + localPart);
    }
  };
  return rdf;
});
