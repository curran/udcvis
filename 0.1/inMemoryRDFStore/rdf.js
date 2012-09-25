var rdf = function(){
  // A quick and dirty sorted set implementation.
  // It has the following drawbacks:
  //
  //  - It sorts on requests for iterators.
  //    - Sporradic O(n lg n) cost
  //  - It defensively makes a copy of the array for iterators.
  //    - O(n) memory and compute cost per iterator
  //
  // Ideally this would be implemented using a Red-Black tree.
  var makeSortedSet = function(){
    var _array = [];
    var _dirty = false;
    return {
      insert: function(x){
        _array.push(x);
        _dirty = true;
      },
      iterator: function(){
        if(_dirty){
          _array.sort();
          _dirty = false;
        }
        var _arrayCopy = _array.slice(0);
        var i = 0;
        return {
          hasNext: function(){
            return i < _arrayCopy.length;
          },
          next: function(){
            return _arrayCopy[i++];
          },
          toString: function(){
            var it = this, strings = ["["];
            while(it.hasNext()){
              strings.push(it.next());
              strings.push(it.hasNext()?", ":"]");
            }
            return strings.join('');
          }
        }
      }
    };
  };

  var emptySet = makeSortedSet();


  // Keys are cantor pairs from subject and predicate URI ids.
  // Values are sorted sets that have the following methods:
  //  
  //  - `insert(x)` Inserts an integer or literal `x`.
  //  - `iterator()` Gets an iterator object that has:
  //
  //    - `hasNext()` Returns true if there is a next value.
  //    - `next()` Gets the next element of the sorted set.
  spIndex = {};
  poIndex = {};

  // Inserts a value into the given index. Arguments are:
  var indexInsert = function(index, key, value){
    var list = index[key];
    if(!list){
      list = index[key] = makeSortedSet();
    }
    list.insert(value);
  };


  // `rdf(subject, predicate, object)` executes a query 
  // on the in-memory store.
  // The arguments here are either integer URI ids or the string '?'.
  // Only one of the arguments is allowed to be '?'.
  // The '?' must be either the subject or the object argument.
  // The return value is a sorted array of matching values for the '?'.
  // Values in the returned array may be either integers or literal objects.
  // Each literal object `obj` has properties
  //
  //  - `obj.isLiteral === true`
  //  - `obj.value` gets the literal value.
  var rdf = function(s, p, o){
    var key, index, indexEntry;
    if(o === '?'){
      key = cantor(s, p);
      index = spIndex;
    }
    else if(s === '?'){
      key = cantor(p, o);
      index = poIndex;
    }
    else{
      throw new Error("When calling rdf(s,p,o), either s or o must be '?'");
    }
    indexEntry = index[key];
    if(indexEntry){
      return indexEntry.iterator();
    }
    else{
      return emptySet.iterator();
    }
  };

  // Creates a unique key for two integer IDs.
  // From http://en.wikipedia.org/wiki/Pairing_function
  var cantor = function(a, b){
    return (a+b)*(a+b+1)/2+b;
  }

  // Returns a literal value for use as the `object` argument
  // to `rdf.insert()`.
  rdf.literal = (function(){
    // The prototype of literal values
    var literalPrototype = {
      isLiteral: true,
      toString: function(){
        return '"'+this.value+'"';
      }
    };
    return function(value){
      var literal = Object.create(literalPrototype);
      literal.value = value;
      return literal;
    };
  })();
  

  // The argument is a URI string.
  // The return value is an integer id for that URI.
  rdf.uri = (function(){
    // The URI id counter for generating ids
    var idCounter = 0;
    // Keys are URI strings, values are integer URI ids.
    var uriToId = {};
    // Keys are integer URI ids, values are URI strings.
    //var idToUri = {};
    return function(uri){
      var id = uriToId[uri];
      if(!id){
        id = idCounter++;
        uriToId[uri] = id;
        //idToUri[id] = uri;
      }
      return id;
    };
  })();

  // `insert(subject, predicate, object)`
  // Inserts a triple into the in-memory store. The arguments are:
  //
  //  - The `subject` and `predicate` arguments are 
  //    integer URI ids from `rdf.uri()`.
  //  - The `object` argument may be either:
  //
  //    - a URI id from `rdf.uri()`, or 
  //    - a literal from `rdf.literal(value)`.
  rdf.insert = function(s, p, o){
    indexInsert(spIndex, cantor(s, p), o);
    indexInsert(poIndex, cantor(p, o), s);
  };

  return rdf;
}();

var me = rdf.uri('http://www.w3.org/People/EM/contact#me');
var fullName = rdf.uri('http://www.w3.org/2000/10/swap/pim/contact#fullName');
var type = rdf.uri('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
var person = rdf.uri('http://www.w3.org/2000/10/swap/pim/contact#Person');

rdf.insert(me, type, person);
rdf.insert(me, fullName, rdf.literal("Eric Miller"));
rdf.insert(me,
  rdf.uri('http://www.w3.org/2000/10/swap/pim/contact#mailbox'),
  rdf.uri('mailto:em@w3.org'));
rdf.insert(me,
  rdf.uri('http://www.w3.org/2000/10/swap/pim/contact#personalTitle'),
  rdf.literal("Dr."));

var show = function(iterator){
  console.log(iterator.toString());
}

console.log('expecting ["Eric Miller"], got ');
show(rdf(me, fullName, '?'));
console.log();
console.log('expecting true, got ')
show(rdf(me, fullName, '?').next().isLiteral);
console.log();
console.log('expecting ['+me+'], got ');
show(rdf('?', type, person));

//Region,Population,Year
//World,2532229237,1950
//Africa,229895014,1950
//Asia,1403388587,1950
//Europe,547287120,1950
//Latin America and the Caribbean,167368224,1950
//Northern America,171614868,1950
//Oceania,12675424,1950
//World,6895889018,2010
//Africa,1022234400,2010
//Asia,4164252297,2010
//Europe,738198601,2010
//Latin America and the Caribbean,590082023,2010
//Northern America,344528824,2010
//Oceania,36592873,2010
