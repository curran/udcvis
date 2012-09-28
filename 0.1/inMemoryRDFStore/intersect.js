// An experiment to find an algorithm that
// computes intersection of sorted integer sets via an
// iterator API. For use in the in-memory RDF store
// when computing queries using AND.

var arr1 = [0,1,2,3,5,7,9];
var arr2 = [1,3,4,5,6,7,8,9];

var iterator = function(arr){
  var i = 0, n = arr.length;
  return {
    hasNext: function(){
      return i < n;
    },
    next: function(){
      return arr[i++];
    }
  };
};

var intersect = function(it1, it2){
  var nextValue, next1, next2;
  var findNextValue = function(){
    nextValue = undefined;
    next1 = next2 = NaN;
    while(!nextValue)
      if(next1 === next2)
        nextValue = next1;
      else
        if(next1 < next2 || isNaN(next1))
          if(it1.hasNext())
            next1 = it1.next();
          else
            break;
        else if(next2 < next1 || isNaN(next2))
          if(it2.hasNext())
            next2 = it2.next();
          else
            break;
  };
  findNextValue();
  return {
    hasNext: function(){
      return nextValue ? true : false;
    },
    next: function(){
      var currentValue = nextValue;
      findNextValue();
      return currentValue;
    }
  };
};

var toString = function(it){
  var strs = ["["];
  while(it.hasNext()){
    strs.push(it.next());
    strs.push(it.hasNext()?",":"]");
  }
  return strs.join("");
}

console.log([
  toString(iterator(arr1)),
  " intersect ",
  toString(iterator(arr2)),
  " = ",
  toString(intersect(iterator(arr1), iterator(arr2)))
].join(""));
