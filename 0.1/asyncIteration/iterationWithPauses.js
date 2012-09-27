//Idea: visualization painting algorithms act asynchronously,
// and the environment that manages them can perform the following
// operations on them:
//
//  * Pause - temporarily halts execution for later resuming
//  * Resume - resumes execution after pausing
//    * Pause and resume can be used for green threading
//  * Restart - resets all iterators and paints from scratch
//    * Restarts would happen when the data or visualization configuration
//      is updated
var n = 10;

var stopPending = false;
var stopped = false;
var startCallback;

function schedule(callback){
  if(stopPending){
    startCallback = callback;
    stopped = true;
    stopPending = false;
  }
  else{
    setTimeout(callback, 500);
  }
}

(function iterate(i){
  console.log(i);
  if(i < n){
    schedule(function(){
      iterate(i + 1);
    });
  }
})(0);

function stop(){
  console.log("stopping");
  stopPending = true;
}

function start(){
  console.log("starting");
  if(stopPending)
    stopPending = false;
  else if(stopped){
    stopped = false;
    startCallback();
  }
}

setTimeout(stop, 2000);

setTimeout(start, 5000);


