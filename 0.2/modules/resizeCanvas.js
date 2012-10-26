define([],function(){
  // Updates the canvas size to meet the window size.
  //
  //  * Returns true if a resize was performed
  //    (leaving the canvas blank).
  //  * Returns false if a resize was not performed
  //    (leaving the canvas intact).
  return function (canvas){
    if(!((canvas.width === window.innerWidth) && 
         (canvas.height === window.innerHeight))){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      return true;
    }
    return false;
  }
});
