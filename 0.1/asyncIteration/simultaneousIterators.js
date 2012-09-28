// A demonstration of green-threading afforded by simple
// use of the JavaScript event loop with an iterator API.
//
// The idea here is that this kind of scheduling can be used
// in the implementation of visualization painter algorithms
// such that they draw incrementally to an offscreen buffer,
// and the offscreen buffer is drawn to the display at 60 FPS.
// This is possible because `requestAnimationFrame` will insert
// callbacks onto the same event queue used for iterator scheduling,
// so the code that renders the visualization painter buffers to 
// the display will execute every 16 milliseconds, and in between
// executions, the visualization painter iterators will incrementally
// execute until they are done.

var useEventLoop;
// When `useEventLoop` is set to true, iterators will place
// each iteration callback on the JavaScript event loop.
// 
// When `useEventLoop` is false, iterators call iteration
// callbacks immediately, causing the iterator to execute
// synchronously, blocking future iterators.

var arrA = [0,1,2,3,5,7,9];
var arrB = [1,3,4,5,6,7,8,9];
var arrC = [1,2,3];

var iterator = function(arr){
  var i = 0, n = arr.length;
  return {
    hasNext: function(){
      return i < n;
    },
    next: function(callback){
      var nextValue = arr[i++];
      if(useEventLoop)
        setTimeout(function(){
          callback(nextValue);
        }, 0);
      else
        callback(nextValue);
    }
  };
};


var forEach = function(it, callback){
  if(it.hasNext()){
    it.next(function(element){
      callback(element);
      forEach(it, callback);
    });
  }
};

var logEach = function(name, arr){
  var i = 0;
  forEach(iterator(arr), function(element){
    console.log(name+'['+(i++)+']='+element);
  });
};

var logArrays = function(){
  logEach(' A',arrA);
  logEach('         B',arrB);
  logEach('                 C',arrC);
};

useEventLoop = false;
console.log("Without using the event loop:");
logArrays();

useEventLoop = true;
console.log("Using the event loop:");
logArrays();

// From the output, one can clearly see that use of the event loop
// leads to interleaved scheduling of iterations, and not using it
// leads to strictly serial execution of iterators.
// 
// Here is sample output:
//
//`Without using the event loop:`<br>
//` A[0]=0`<br>
//` A[1]=1`<br>
//` A[2]=2`<br>
//` A[3]=3`<br>
//` A[4]=5`<br>
//` A[5]=7`<br>
//` A[6]=9`<br>
//`         B[0]=1`<br>
//`         B[1]=3`<br>
//`         B[2]=4`<br>
//`         B[3]=5`<br>
//`         B[4]=6`<br>
//`         B[5]=7`<br>
//`         B[6]=8`<br>
//`         B[7]=9`<br>
//`                 C[0]=1`<br>
//`                 C[1]=2`<br>
//`                 C[2]=3`<br>
//`Using the event loop:`<br>
//` A[0]=0`<br>
//`                 C[0]=1`<br>
//`         B[0]=1`<br>
//` A[1]=1`<br>
//`         B[1]=3`<br>
//`                 C[1]=2`<br>
//` A[2]=2`<br>
//`                 C[2]=3`<br>
//`         B[2]=4`<br>
//` A[3]=3`<br>
//`         B[3]=5`<br>
//` A[4]=5`<br>
//`         B[4]=6`<br>
//` A[5]=7`<br>
//`         B[5]=7`<br>
//` A[6]=9`<br>
//`         B[6]=8`<br>
//`         B[7]=9`<br>
